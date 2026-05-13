import type { UserRole } from './roles';

export interface MenuItem {
  label: string;
  href: string;
}

export const roleMenus: Record<UserRole, MenuItem[]> = {
  buyer: [
    { label: 'Dashboard', href: '/dashboard/buyer' },
    { label: 'Saved Properties', href: '/saved-properties' },
    { label: 'AI Match Preferences', href: '/ai-concierge' },
    { label: 'Offers', href: '/offers' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/buyer' }
  ],
  seller: [
    { label: 'Dashboard', href: '/dashboard/seller' },
    { label: 'My Properties', href: '/my-properties' },
    { label: 'Offers Received', href: '/offers' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/seller' }
  ],
  realtor: [
    { label: 'Dashboard', href: '/dashboard/realtor' },
    { label: 'Listings', href: '/listings' },
    { label: 'Leads', href: '/leads' },
    { label: 'Clients', href: '/clients' },
    { label: 'Viewings', href: '/viewings' },
    { label: 'Offers', href: '/offers' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Firm', href: '/firm' },
    { label: 'Profile', href: '/profile/realtor' }
  ],
  lawyer: [
    { label: 'Dashboard', href: '/dashboard/lawyer' },
    { label: 'Cases', href: '/cases' },
    { label: 'Clients', href: '/clients' },
    { label: 'Documents', href: '/documents' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/lawyer' }
  ],
  notary: [
    { label: 'Dashboard', href: '/dashboard/notary' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Documents', href: '/documents' },
    { label: 'Verification', href: '/verification' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/notary' }
  ],
  firm_owner: [
    { label: 'Dashboard', href: '/dashboard/firm-owner' },
    { label: 'Company Profile', href: '/firm' },
    { label: 'Users', href: '/firm/users' },
    { label: 'Licenses', href: '/firm/licenses' },
    { label: 'Billing', href: '/firm/billing' },
    { label: 'Compliance Verification', href: '/verification/company' },
    { label: 'Workflows', href: '/firm/workflows' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' }
  ],
  firm_admin: [
    { label: 'Dashboard', href: '/dashboard/firm-admin' },
    { label: 'Company Profile', href: '/firm' },
    { label: 'Users', href: '/firm/users' },
    { label: 'Licenses', href: '/firm/licenses' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' }
  ],
  admin: [
    { label: 'Platform Dashboard', href: '/dashboard/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Firms', href: '/admin/firms' },
    { label: 'Subscriptions', href: '/admin/subscriptions' },
    { label: 'Verification Queue', href: '/admin/verification' },
    { label: 'Support', href: '/admin/support' },
    { label: 'Platform Settings', href: '/admin/settings' }
  ],
  super_admin: [
    { label: 'Full Access', href: '/dashboard/super-admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Firms', href: '/admin/firms' },
    { label: 'Subscriptions', href: '/admin/subscriptions' },
    { label: 'Verification Queue', href: '/admin/verification' },
    { label: 'Support', href: '/admin/support' },
    { label: 'Platform Settings', href: '/admin/settings' },
    { label: 'All Profiles', href: '/profile/super-admin' }
  ]
};

export function getMenuForRole(role: UserRole) {
  return roleMenus[role];
}
