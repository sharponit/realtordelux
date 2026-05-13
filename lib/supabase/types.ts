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
      properties: {
        Row: {
          id: string;
          realtor_id: string | null;
          market_code: string | null;
          title: string | null;
          price: number | null;
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
