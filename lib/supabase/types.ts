import type { OnboardingStatus, UserRole } from '@/lib/auth/roles';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  roles?: UserRole[];
  onboarding_status: OnboardingStatus;
  preferred_language: string;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirmRow {
  id: string;
  name: string;
  legal_name: string | null;
  registration_number: string | null;
  chamber_of_commerce_country: string | null;
  chamber_of_commerce_id: string | null;
  vat_number: string | null;
  firm_type: string;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  verification_status: string;
  subscription_status: string;
  license_seats: number;
  created_at: string;
  updated_at: string;
}

export interface FirmUserRow {
  id: string;
  firm_id: string;
  user_id: string;
  role_in_firm: string;
  platform_role: UserRole;
  status: string;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalVerificationRow {
  id: string;
  user_id: string | null;
  firm_id: string | null;
  profession_type: string;
  country: string;
  registry_source: string;
  registry_number: string | null;
  verification_status: string;
  verification_payload: Json | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  firm_id: string;
  plan_name: string;
  billing_provider: string;
  license_seats: number;
  active_users: number;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhotographerProfileRow {
  id: string;
  user_id: string;
  display_name: string;
  profile_photo_url: string | null;
  country: string;
  city: string;
  operating_region: string | null;
  operating_radius_km: number;
  languages: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  social_links: Json;
  portfolio_images: string[];
  drone_available: boolean;
  drone_certification_url: string | null;
  equipment_list: string[];
  real_estate_experience: string | null;
  luxury_experience_years: number;
  average_delivery_days: number;
  services: string[];
  base_price: number;
  add_on_prices: Json;
  rating: number;
  review_count: number;
  completed_jobs: number;
  completed_luxury_jobs: number;
  verification_status: string;
  active_status: string;
  viyra_service_fee_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PhotographerPricingRow {
  id: string;
  user_id: string;
  interior_price: number;
  exterior_price: number;
  drone_price: number;
  twilight_price: number;
  video_walkthrough_price: number;
  tour_360_price: number;
  floorplan_scan_price: number;
  viyra_service_fee_rate: number;
  calculated_service_fee: number;
  calculated_customer_total: number;
  created_at: string;
  updated_at: string;
}

export interface PhotographyJobRow {
  id: string;
  property_id: string | null;
  requested_by: string;
  photographer_id: string | null;
  property_address: string | null;
  property_city: string | null;
  property_region: string | null;
  property_country: string | null;
  requested_shoot_date: string | null;
  service_package: string[];
  requires_drone: boolean;
  photographer_price: number;
  viyra_service_fee: number;
  customer_total: number;
  status: string;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  payout_status: string;
  photographer_payout_amount: number;
  platform_fee_amount: number;
  created_at: string;
  updated_at: string;
}

export interface PhotographyUploadRow {
  id: string;
  photography_job_id: string;
  uploaded_by: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  file_type: string;
  photo_category: string | null;
  upload_status: string;
  image_count: number;
  below_minimum_warning: boolean;
  admin_override_minimum: boolean;
  ai_score: number | null;
  ai_selected: boolean;
  ai_category: string | null;
  sharpness_score: number | null;
  brightness_score: number | null;
  luxury_score: number | null;
  room_detected: string | null;
  image_orientation: string | null;
  publication_status: string;
  created_at: string;
  updated_at: string;
}

export interface SellerInvitationRow {
  id: string;
  token_hash: string;
  seller_full_name: string;
  seller_email: string;
  seller_phone: string | null;
  property_address: string;
  city: string;
  country: string;
  estimated_property_value: number | null;
  property_type: string | null;
  preferred_privacy_mode: string;
  personal_message: string | null;
  commission_model: string;
  commission_percentage: number;
  platform_fee_percentage: number;
  representation_type: string;
  invited_by_realtor_id: string;
  brokerage_id: string | null;
  property_id: string | null;
  listing_id: string | null;
  status: string;
  expires_at: string;
  opened_at: string | null;
  accepted_by: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyListingRow {
  id: string;
  property_id: string;
  seller_id: string;
  listing_realtor_id: string;
  brokerage_id: string | null;
  invitation_id: string | null;
  privacy_mode: string;
  status: string;
  title: string | null;
  description: string | null;
  ai_metadata: Json;
  missing_information: Json;
  legal_review_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerPropertyOnboardingRow {
  id: string;
  invitation_id: string;
  seller_id: string;
  property_id: string;
  listing_id: string;
  ownership_name: string;
  seller_type: string;
  title_deed_url: string | null;
  identity_document_url: string | null;
  company_document_url: string | null;
  living_area_sqm: number | null;
  plot_size_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  staff_rooms: number | null;
  garage_spaces: number | null;
  luxury_features: string[];
  amenity_flags: Json;
  media_urls: string[];
  request_certified_photographer: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionAttributionRow {
  id: string;
  property_id: string;
  listing_id: string | null;
  seller_id: string;
  listing_realtor_id: string;
  buyer_realtor_id: string | null;
  referral_realtor_id: string | null;
  brokerage_id: string | null;
  commission_percentage: number;
  platform_fee_percentage: number;
  attribution_source: string;
  invitation_id: string;
  representation_type: string;
  status: string;
  custom_split: Json;
  created_at: string;
  accepted_at: string | null;
}

export interface ResidencyRuleRow {
  id: string;
  country: string;
  country_code: string;
  pathway_key: string;
  pathway_name: string;
  status: 'active' | 'draft' | 'paused';
  min_property_value: number;
  currency: string;
  eligible_nationalities: string[];
  excluded_nationalities: string[];
  buyer_profile_requirements: Json;
  summary: string;
  multilingual_content: Json;
  disclaimer: string;
  luxury_markets: string[];
  managed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResidencyOpportunityInterestRow {
  id: string;
  buyer_id: string;
  property_id: string | null;
  country: string;
  residency_pathway: string;
  rule_id: string | null;
  action_source: string;
  buyer_nationality: string | null;
  buyer_profile: Json;
  status: string;
  assigned_lawyer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResidencyLawyerReviewRequestRow {
  id: string;
  interest_id: string;
  requested_by: string;
  assigned_lawyer_id: string | null;
  country: string;
  residency_pathway: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow>; Update: Partial<ProfileRow> };
      firms: { Row: FirmRow; Insert: Partial<FirmRow>; Update: Partial<FirmRow> };
      firm_users: { Row: FirmUserRow; Insert: Partial<FirmUserRow>; Update: Partial<FirmUserRow> };
      professional_verifications: {
        Row: ProfessionalVerificationRow;
        Insert: Partial<ProfessionalVerificationRow>;
        Update: Partial<ProfessionalVerificationRow>;
      };
      subscriptions: { Row: SubscriptionRow; Insert: Partial<SubscriptionRow>; Update: Partial<SubscriptionRow> };
      photographer_profiles: { Row: PhotographerProfileRow; Insert: Partial<PhotographerProfileRow>; Update: Partial<PhotographerProfileRow> };
      photographer_pricing: { Row: PhotographerPricingRow; Insert: Partial<PhotographerPricingRow>; Update: Partial<PhotographerPricingRow> };
      photographer_portfolios: { Row: any; Insert: any; Update: any };
      photographer_realtor_requests: { Row: any; Insert: any; Update: any };
      photography_jobs: { Row: PhotographyJobRow; Insert: Partial<PhotographyJobRow>; Update: Partial<PhotographyJobRow> };
      photography_job_invites: { Row: any; Insert: any; Update: any };
      photography_uploads: { Row: PhotographyUploadRow; Insert: Partial<PhotographyUploadRow>; Update: Partial<PhotographyUploadRow> };
      photography_reviews: { Row: any; Insert: any; Update: any };
      seller_invitations: { Row: SellerInvitationRow; Insert: Partial<SellerInvitationRow>; Update: Partial<SellerInvitationRow> };
      property_listings: { Row: PropertyListingRow; Insert: Partial<PropertyListingRow>; Update: Partial<PropertyListingRow> };
      seller_realtor_relationships: { Row: any; Insert: any; Update: any };
      seller_property_onboardings: { Row: SellerPropertyOnboardingRow; Insert: Partial<SellerPropertyOnboardingRow>; Update: Partial<SellerPropertyOnboardingRow> };
      property_attributions: { Row: any; Insert: any; Update: any };
      commission_attributions: { Row: CommissionAttributionRow; Insert: Partial<CommissionAttributionRow>; Update: Partial<CommissionAttributionRow> };
      residency_rules: { Row: ResidencyRuleRow; Insert: Partial<ResidencyRuleRow>; Update: Partial<ResidencyRuleRow> };
      residency_opportunity_interests: {
        Row: ResidencyOpportunityInterestRow;
        Insert: Partial<ResidencyOpportunityInterestRow>;
        Update: Partial<ResidencyOpportunityInterestRow>;
      };
      residency_lawyer_review_requests: {
        Row: ResidencyLawyerReviewRequestRow;
        Insert: Partial<ResidencyLawyerReviewRequestRow>;
        Update: Partial<ResidencyLawyerReviewRequestRow>;
      };
      co_listing_agents: { Row: any; Insert: any; Update: any };
      referral_links: { Row: any; Insert: any; Update: any };
      notification_events: { Row: any; Insert: any; Update: any };
      properties: {
        Row: {
          id: string;
          realtor_id: string | null;
          seller_id?: string | null;
          invited_by_realtor_id?: string | null;
          brokerage_id?: string | null;
          invitation_id?: string | null;
          market_code: string | null;
          title: string | null;
          price: number | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          property_type?: string | null;
          listing_privacy_mode?: string | null;
          seller_onboarding_status?: string | null;
          attribution_source?: string | null;
          ownership_verified?: boolean;
          ai_metadata?: Json;
          created_at: string;
          updated_at: string;
          created_by?: string | null;
          deleted_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          property_id: string | null;
          buyer_id: string | null;
          seller_id: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
          created_by?: string | null;
        };
      };
    };
  };
}
/** Viyra.com™ */
