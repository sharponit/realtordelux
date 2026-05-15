import type { UserRole } from './roles';

export const permissions = {
  general: ['profile:own', 'messages:own'],
  buyer: ['properties:read', 'offers:create', 'documents:own', 'messages:own'],
  seller: ['properties:own', 'offers:read', 'documents:own', 'messages:own'],
  renter: ['properties:read', 'offers:create', 'documents:own', 'messages:own'],
  investor: ['properties:read', 'offers:create', 'documents:own', 'messages:own'],
  realtor: ['listings:manage', 'leads:manage', 'clients:manage', 'offers:coordinate', 'firm:read'],
  developer: ['developments:manage', 'projects:manage', 'investor_leads:read', 'media:manage', 'messages:own'],
  property_manager: ['managed_properties:manage', 'maintenance:manage', 'tenants:manage', 'concierge:manage', 'messages:own'],
  photographer: ['photography:profile', 'photography:jobs', 'photography:uploads', 'photography:pricing'],
  lawyer: ['cases:manage', 'clients:read', 'documents:review', 'compliance:review'],
  notary: ['transactions:verify', 'appointments:manage', 'documents:verify'],
  firm_owner: ['firm:manage', 'users:invite', 'licenses:manage', 'billing:manage', 'verification:manage'],
  firm_admin: ['firm:read', 'users:manage', 'licenses:read', 'documents:manage'],
  admin: ['platform:read', 'users:manage', 'firms:manage', 'verification:manage', 'support:manage'],
  super_admin: ['*']
} satisfies Record<UserRole, string[]>;

export function can(role: UserRole, permission: string) {
  return permissions[role].includes('*') || permissions[role].includes(permission);
}

export function canAccessRole(currentRole: UserRole, targetRole: UserRole, roles: readonly UserRole[] = [currentRole]) {
  return currentRole === 'super_admin' || roles.includes(targetRole);
}
