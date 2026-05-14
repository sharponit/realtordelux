export const USER_ROLES = [
  'general',
  'buyer',
  'seller',
  'renter',
  'investor',
  'realtor',
  'photographer',
  'lawyer',
  'notary',
  'firm_owner',
  'firm_admin',
  'admin',
  'super_admin'
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type OnboardingStatus = 'not_started' | 'in_progress' | 'pending_verification' | 'complete';

export type FirmType = 'real_estate_agency' | 'law_firm' | 'notary_office' | 'mixed_services';

export const PROFESSIONAL_ROLES = ['realtor', 'photographer', 'lawyer', 'notary'] as const satisfies readonly UserRole[];
export const FIRM_ROLES = ['firm_owner', 'firm_admin'] as const satisfies readonly UserRole[];
export const PLATFORM_ROLES = ['admin', 'super_admin'] as const satisfies readonly UserRole[];

export const roleLabels: Record<UserRole, string> = {
  general: 'General',
  buyer: 'Buyer',
  seller: 'Seller',
  renter: 'Renter',
  investor: 'Investor',
  realtor: 'Realtor',
  photographer: 'Photographer',
  lawyer: 'Lawyer',
  notary: 'Notary',
  firm_owner: 'Firm Owner',
  firm_admin: 'Firm Admin',
  admin: 'Admin',
  super_admin: 'Super Admin'
};

export const roleDashboardPath: Record<UserRole, string> = {
  general: '/dashboard/general',
  buyer: '/dashboard/buyer',
  seller: '/dashboard/seller',
  renter: '/dashboard/renter',
  investor: '/dashboard/investor',
  realtor: '/dashboard/realtor',
  photographer: '/dashboard/photographer',
  lawyer: '/dashboard/lawyer',
  notary: '/dashboard/notary',
  firm_owner: '/dashboard/firm-owner',
  firm_admin: '/dashboard/firm-admin',
  admin: '/dashboard/admin',
  super_admin: '/dashboard/super-admin'
};

export function isUserRole(value: string | null | undefined): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function requiresFirm(role: UserRole) {
  return role === 'firm_owner' || role === 'firm_admin';
}

export function isProfessionalRole(role: UserRole) {
  return role === 'realtor' || role === 'photographer' || role === 'lawyer' || role === 'notary';
}

export function isPlatformRole(role: UserRole) {
  return role === 'admin' || role === 'super_admin';
}

export const rolePriority: UserRole[] = [
  'admin',
  'super_admin',
  'realtor',
  'seller',
  'buyer',
  'investor',
  'lawyer',
  'notary',
  'photographer',
  'renter',
  'general',
  'firm_owner',
  'firm_admin'
];

export function getPrimaryRole(roles: readonly UserRole[]) {
  return rolePriority.find((role) => roles.includes(role)) || roles[0] || 'general';
}
