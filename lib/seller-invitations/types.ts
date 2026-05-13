export type RepresentationType =
  | 'exclusive_listing'
  | 'co_listing'
  | 'referral_introduction'
  | 'buyer_side_introduction'
  | 'platform_assisted_listing';

export type ListingPrivacyMode = 'public' | 'qualified_buyers_only' | 'off_market';

export type SellerInviteStatus = 'pending' | 'opened' | 'accepted' | 'expired' | 'revoked';

export interface SellerInvitationPreview {
  status: SellerInviteStatus | 'invalid';
  seller_full_name?: string;
  property_address?: string;
  city?: string;
  country?: string;
  estimated_property_value?: number;
  property_type?: string;
  preferred_privacy_mode?: ListingPrivacyMode;
  personal_message?: string | null;
  representation_type?: RepresentationType;
  realtor_name?: string | null;
  realtor_photo?: string | null;
  brokerage_name?: string | null;
  expires_at?: string;
}
