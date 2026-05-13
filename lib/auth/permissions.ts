import type { UserRole } from './roles';

export const permissions = {
  buyer: ['properties:read', 'offers:create', 'documents:own', 'messages:own'],
  seller: ['properties:own', 'offers:read', 'documents:own', 'messages:own'],
  realtor: ['listings:manage', 'leads:manage', 'clients:manage', 'offers:coordinate', 'firm:read'],
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

export function canAccessRole(currentRole: UserRole, targetRole: UserRole) {
  return currentRole === 'super_admin' || currentRole === targetRole;
}
