import { createSupabaseServerClient, supabaseService } from '@/lib/supabase/server';
import { writeAuditLog } from '@/lib/platform/audit';
import { createNotification, queueEmailPlaceholder } from '@/lib/platform/notifications';
import { generateInviteToken, getInviteExpiry, hashInviteToken } from './tokens';
import type { ListingPrivacyMode, RepresentationType, SellerInvitationPreview } from './types';

export interface CreateSellerInvitationInput {
  seller_full_name: string;
  seller_email: string;
  seller_phone?: string;
  property_address: string;
  city: string;
  country: string;
  estimated_property_value?: number;
  property_type?: string;
  preferred_privacy_mode: ListingPrivacyMode;
  personal_message?: string;
  commission_model?: string;
  commission_percentage?: number;
  platform_fee_percentage?: number;
  representation_type: RepresentationType;
  realtor_user_id?: string;
  brokerage_id?: string;
}

export async function createSellerInvitation(input: CreateSellerInvitationInput, origin: string) {
  const userClient = (await createSupabaseServerClient()) as any;
  const service = supabaseService() as any;
  const {
    data: { user }
  } = await userClient.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: profile } = await userClient
    .from('profiles')
    .select('role,full_name,avatar_url')
    .eq('user_id', user.id)
    .single();

  if (!profile || !['realtor', 'firm_owner', 'firm_admin', 'admin', 'super_admin'].includes(profile.role)) {
    throw new Error('Only realtors, brokerage admins, and platform admins can invite sellers.');
  }

  const realtorUserId = input.realtor_user_id || user.id;
  const token = generateInviteToken();
  const tokenHash = hashInviteToken(token);
  const expiresAt = getInviteExpiry();

  const { data: activeFirmUser } = await userClient
    .from('firm_users')
    .select('firm_id')
    .eq('user_id', realtorUserId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  const brokerageId = input.brokerage_id || activeFirmUser?.firm_id || null;

  const { data: invitation, error } = await userClient
    .from('seller_invitations')
    .insert({
      token_hash: tokenHash,
      seller_full_name: input.seller_full_name,
      seller_email: input.seller_email.toLowerCase(),
      seller_phone: input.seller_phone || null,
      property_address: input.property_address,
      city: input.city,
      country: input.country,
      estimated_property_value: input.estimated_property_value || null,
      property_type: input.property_type || null,
      preferred_privacy_mode: input.preferred_privacy_mode,
      personal_message: input.personal_message || null,
      commission_model: input.commission_model || 'percentage',
      commission_percentage: input.commission_percentage || 3,
      platform_fee_percentage: input.platform_fee_percentage || 0,
      representation_type: input.representation_type,
      invited_by_realtor_id: realtorUserId,
      brokerage_id: brokerageId,
      status: 'pending',
      expires_at: expiresAt
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const inviteLink = `${origin}/seller/onboarding/invite/${token}`;

  await writeAuditLog(service, {
    actor_id: user.id,
    action: 'invitation_created',
    resource_type: 'seller_invitation',
    resource_id: invitation.id,
    metadata: { seller_email: input.seller_email, representation_type: input.representation_type }
  });

  await createNotification(service, {
    user_id: realtorUserId,
    type: 'seller_invited',
    title: 'Seller invitation created',
    body: `${input.seller_full_name} has been invited to onboard ${input.property_address}.`,
    metadata: { invitation_id: invitation.id }
  });

  await queueEmailPlaceholder(service, {
    to_email: input.seller_email,
    template: 'seller_property_invitation',
    subject: 'Your private VIYRA property onboarding invitation',
    payload: { invite_link: inviteLink, realtor_name: profile.full_name, property_address: input.property_address }
  });

  return { invitation, inviteLink };
}

export async function getInvitationPreviewByToken(token: string): Promise<SellerInvitationPreview> {
  const service = supabaseService() as any;
  const tokenHash = hashInviteToken(token);
  const { data: invite } = await service
    .from('seller_invitations')
    .select('*')
    .eq('token_hash', tokenHash)
    .single();

  if (!invite) {
    return { status: 'invalid' };
  }

  if (invite.status === 'accepted' || invite.status === 'revoked') {
    return { status: invite.status };
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await service.from('seller_invitations').update({ status: 'expired' }).eq('id', invite.id);
    return { status: 'expired' };
  }

  if (invite.status === 'pending') {
    await service
      .from('seller_invitations')
      .update({ status: 'opened', opened_at: new Date().toISOString() })
      .eq('id', invite.id);
    await writeAuditLog(service, {
      action: 'invite_opened',
      resource_type: 'seller_invitation',
      resource_id: invite.id,
      metadata: { city: invite.city, country: invite.country }
    });
  }

  const [{ data: realtor }, { data: firm }] = await Promise.all([
    service.from('profiles').select('full_name,avatar_url').eq('user_id', invite.invited_by_realtor_id).single(),
    invite.brokerage_id ? service.from('firms').select('name').eq('id', invite.brokerage_id).single() : Promise.resolve({ data: null })
  ]);

  return {
    status: invite.status === 'pending' ? 'opened' : invite.status,
    seller_full_name: invite.seller_full_name,
    property_address: invite.property_address,
    city: invite.city,
    country: invite.country,
    estimated_property_value: invite.estimated_property_value,
    property_type: invite.property_type,
    preferred_privacy_mode: invite.preferred_privacy_mode,
    personal_message: invite.personal_message,
    representation_type: invite.representation_type,
    realtor_name: realtor?.full_name || 'Your VIYRA realtor',
    realtor_photo: realtor?.avatar_url || null,
    brokerage_name: firm?.name || null,
    expires_at: invite.expires_at
  };
}

export interface AcceptSellerInvitationInput {
  token: string;
  ownership_name: string;
  seller_type: 'individual' | 'company';
  title_deed_url?: string;
  identity_document_url?: string;
  company_document_url?: string;
  privacy_mode: ListingPrivacyMode;
  living_area_sqm?: number;
  plot_size_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  staff_rooms?: number;
  garage_spaces?: number;
  luxury_features?: string[];
  amenity_flags?: Record<string, boolean | string | number | null>;
  media_urls?: string[];
  request_certified_photographer?: boolean;
  seller_refuses_attribution?: boolean;
}

export async function acceptSellerInvitation(input: AcceptSellerInvitationInput) {
  const userClient = (await createSupabaseServerClient()) as any;
  const service = supabaseService() as any;
  const {
    data: { user }
  } = await userClient.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const tokenHash = hashInviteToken(input.token);
  const { data: invite } = await service
    .from('seller_invitations')
    .select('*')
    .eq('token_hash', tokenHash)
    .single();

  if (!invite) throw new Error('Invitation not found.');
  if (invite.status === 'accepted') throw new Error('This invitation has already been accepted.');
  if (invite.status === 'revoked') throw new Error('This invitation has been revoked.');
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await service.from('seller_invitations').update({ status: 'expired' }).eq('id', invite.id);
    throw new Error('This invitation has expired.');
  }
  if (input.seller_refuses_attribution) {
    await writeAuditLog(service, {
      actor_id: user.id,
      action: 'seller_refused_attribution',
      resource_type: 'seller_invitation',
      resource_id: invite.id,
      metadata: { invited_by_realtor_id: invite.invited_by_realtor_id }
    });
    throw new Error('Attribution is required for this invitation-based onboarding flow.');
  }

  await service.from('profiles').upsert({
    user_id: user.id,
    full_name: input.ownership_name || invite.seller_full_name,
    email: user.email || invite.seller_email,
    phone: invite.seller_phone,
    role: 'seller',
    country: invite.country,
    onboarding_status: 'complete'
  });

  const { data: property, error: propertyError } = await service
    .from('properties')
    .insert({
      seller_id: user.id,
      realtor_id: invite.invited_by_realtor_id,
      invited_by_realtor_id: invite.invited_by_realtor_id,
      brokerage_id: invite.brokerage_id,
      title: `${invite.property_type || 'Luxury property'} in ${invite.city}`,
      price: invite.estimated_property_value,
      address: invite.property_address,
      city: invite.city,
      country: invite.country,
      property_type: invite.property_type,
      listing_privacy_mode: input.privacy_mode,
      seller_onboarding_status: 'pending_realtor_review',
      attribution_source: 'seller_invitation',
      invitation_id: invite.id,
      ownership_verified: false,
      ai_metadata: {
        future_ai_tasks: [
          'generate_luxury_property_description',
          'score_listing_quality',
          'suggest_pricing',
          'recommend_photographer',
          'detect_missing_information',
          'create_multilingual_listing_content'
        ]
      }
    })
    .select('*')
    .single();

  if (propertyError) throw new Error(propertyError.message);

  const { data: listing, error: listingError } = await service
    .from('property_listings')
    .insert({
      property_id: property.id,
      seller_id: user.id,
      listing_realtor_id: invite.invited_by_realtor_id,
      brokerage_id: invite.brokerage_id,
      invitation_id: invite.id,
      privacy_mode: input.privacy_mode,
      status: 'pending_realtor_review',
      ai_metadata: property.ai_metadata || {}
    })
    .select('*')
    .single();

  if (listingError) throw new Error(listingError.message);

  await service.from('seller_property_onboardings').insert({
    invitation_id: invite.id,
    seller_id: user.id,
    property_id: property.id,
    listing_id: listing.id,
    ownership_name: input.ownership_name,
    seller_type: input.seller_type,
    title_deed_url: input.title_deed_url || null,
    identity_document_url: input.identity_document_url || null,
    company_document_url: input.company_document_url || null,
    living_area_sqm: input.living_area_sqm || null,
    plot_size_sqm: input.plot_size_sqm || null,
    bedrooms: input.bedrooms || null,
    bathrooms: input.bathrooms || null,
    staff_rooms: input.staff_rooms || null,
    garage_spaces: input.garage_spaces || null,
    luxury_features: input.luxury_features || [],
    amenity_flags: input.amenity_flags || {},
    media_urls: input.media_urls || [],
    request_certified_photographer: Boolean(input.request_certified_photographer),
    status: 'pending_realtor_review'
  });

  await service.from('seller_realtor_relationships').insert({
    seller_id: user.id,
    realtor_id: invite.invited_by_realtor_id,
    brokerage_id: invite.brokerage_id,
    invitation_id: invite.id,
    representation_type: invite.representation_type,
    status: 'active',
    accepted_at: new Date().toISOString()
  });

  await service.from('property_attributions').insert({
    property_id: property.id,
    listing_id: listing.id,
    seller_id: user.id,
    listing_realtor_id: invite.invited_by_realtor_id,
    brokerage_id: invite.brokerage_id,
    invitation_id: invite.id,
    attribution_source: 'seller_invitation',
    representation_type: invite.representation_type,
    status: 'active',
    accepted_at: new Date().toISOString()
  });

  await service.from('commission_attributions').insert({
    property_id: property.id,
    listing_id: listing.id,
    seller_id: user.id,
    listing_realtor_id: invite.invited_by_realtor_id,
    brokerage_id: invite.brokerage_id,
    commission_percentage: invite.commission_percentage,
    platform_fee_percentage: invite.platform_fee_percentage,
    attribution_source: 'seller_invitation',
    invitation_id: invite.id,
    representation_type: invite.representation_type,
    status: 'active',
    accepted_at: new Date().toISOString(),
    custom_split: {
      listing_realtor_percentage: invite.commission_percentage,
      brokerage_share_pending: true,
      platform_fee_percentage: invite.platform_fee_percentage
    }
  });

  await service
    .from('seller_invitations')
    .update({
      status: 'accepted',
      accepted_by: user.id,
      accepted_at: new Date().toISOString(),
      property_id: property.id,
      listing_id: listing.id
    })
    .eq('id', invite.id);

  await createNotification(service, {
    user_id: invite.invited_by_realtor_id,
    type: 'seller_completed_onboarding',
    title: 'Seller onboarding submitted',
    body: `${invite.seller_full_name} submitted ${invite.property_address} for realtor review.`,
    metadata: { invitation_id: invite.id, property_id: property.id, listing_id: listing.id }
  });

  if (input.request_certified_photographer) {
    await createNotification(service, {
      user_id: invite.invited_by_realtor_id,
      type: 'photographer_requested',
      title: 'Certified photographer requested',
      body: `${invite.seller_full_name} requested a certified photographer for ${invite.property_address}.`,
      metadata: { property_id: property.id, listing_id: listing.id }
    });
  }

  await writeAuditLog(service, {
    actor_id: user.id,
    action: 'invite_accepted',
    resource_type: 'seller_invitation',
    resource_id: invite.id,
    metadata: { property_id: property.id, listing_id: listing.id, realtor_id: invite.invited_by_realtor_id }
  });
  await writeAuditLog(service, {
    actor_id: user.id,
    action: 'commission_attribution_created',
    resource_type: 'commission_attribution',
    resource_id: invite.id,
    metadata: { property_id: property.id, listing_id: listing.id }
  });

  return { property, listing };
}
