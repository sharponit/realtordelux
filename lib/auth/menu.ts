import type { UserRole } from './roles';

export interface MenuItem {
  label: string;
  href: string;
}

export const roleMenus: Record<UserRole, MenuItem[]> = {
  general: [
    { label: 'Dashboard', href: '/dashboard/general' },
    { label: 'Properties', href: '/search' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/general' }
  ],
  buyer: [
    { label: 'Dashboard', href: '/dashboard/buyer' },
    { label: 'Matches', href: '/matches' },
    { label: 'Saved Properties', href: '/saved-properties' },
    { label: 'Offers', href: '/offers' },
    { label: 'Concierge', href: '/concierge' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/buyer' }
  ],
  seller: [
    { label: 'Dashboard', href: '/dashboard/seller' },
    { label: 'My Properties', href: '/my-properties' },
    { label: 'Listing Progress', href: '/listing-progress' },
    { label: 'Offers', href: '/offers' },
    { label: 'Invite Realtor', href: '/realtor/invite-seller' },
    { label: 'Documents', href: '/documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/seller' }
  ],
  renter: [
    { label: 'Dashboard', href: '/dashboard/renter' },
    { label: 'Matches', href: '/matches' },
    { label: 'Saved Rentals', href: '/saved-properties' },
    { label: 'Offers', href: '/offers' },
    { label: 'Concierge', href: '/concierge' },
    { label: 'Profile', href: '/profile/renter' }
  ],
  investor: [
    { label: 'Dashboard', href: '/dashboard/investor' },
    { label: 'Opportunities', href: '/matches' },
    { label: 'Saved Assets', href: '/saved-properties' },
    { label: 'Offers', href: '/offers' },
    { label: 'Profile', href: '/profile/investor' }
  ],
  realtor: [
    { label: 'Dashboard', href: '/dashboard/realtor' },
    { label: 'Invite Seller', href: '/realtor/invite-seller' },
    { label: 'Listings', href: '/listings' },
    { label: 'Review Listings', href: '/realtor/listings/review' },
    { label: 'Clients', href: '/clients' },
    { label: 'Lawyer Recommendations', href: '/lawyer-recommendations' },
    { label: 'Photographer Booking', href: '/photography/assign' },
    { label: 'Commission Tracking', href: '/brokerage/invitations' },
    { label: 'Messages', href: '/messages' },
    { label: 'Firm', href: '/firm' },
    { label: 'Profile', href: '/profile/realtor' }
  ],
  photographer: [
    { label: 'Dashboard', href: '/dashboard/photographer' },
    { label: 'Jobs', href: '/photography/jobs' },
    { label: 'Portfolio', href: '/photographer/portfolio' },
    { label: 'Pricing', href: '/photographer/pricing' },
    { label: 'Availability', href: '/photographer/availability' },
    { label: 'Profile', href: '/profile/photographer' }
  ],
  lawyer: [
    { label: 'Dashboard', href: '/dashboard/lawyer' },
    { label: 'Legal Files', href: '/legal-files' },
    { label: 'Due Diligence', href: '/due-diligence' },
    { label: 'Contract Review', href: '/contract-review' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile/lawyer' }
  ],
  notary: [
    { label: 'Dashboard', href: '/dashboard/notary' },
    { label: 'Notary Files', href: '/notary-files' },
    { label: 'Transfer Appointments', href: '/appointments' },
    { label: 'Signing Workflow', href: '/signing-workflow' },
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
    { label: 'Seller Invitations', href: '/brokerage/invitations' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' }
  ],
  firm_admin: [
    { label: 'Dashboard', href: '/dashboard/firm-admin' },
    { label: 'Company Profile', href: '/firm' },
    { label: 'Users', href: '/firm/users' },
    { label: 'Licenses', href: '/firm/licenses' },
    { label: 'Documents', href: '/documents' },
    { label: 'Seller Invitations', href: '/brokerage/invitations' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' }
  ],
  admin: [
    { label: 'Platform Dashboard', href: '/dashboard/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Firms', href: '/admin/firms' },
    { label: 'Subscriptions', href: '/admin/subscriptions' },
    { label: 'Verification Queue', href: '/admin/verification' },
    { label: 'Photographers', href: '/admin/photographers' },
    { label: 'Photography Jobs', href: '/admin/photography-jobs' },
    { label: 'Attribution Audit', href: '/admin/attribution-audit' },
    { label: 'Support', href: '/admin/support' },
    { label: 'Platform Settings', href: '/admin/settings' }
  ],
  super_admin: [
    { label: 'Full Access', href: '/dashboard/super-admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Firms', href: '/admin/firms' },
    { label: 'Subscriptions', href: '/admin/subscriptions' },
    { label: 'Verification Queue', href: '/admin/verification' },
    { label: 'Photographers', href: '/admin/photographers' },
    { label: 'Photography Jobs', href: '/admin/photography-jobs' },
    { label: 'Attribution Audit', href: '/admin/attribution-audit' },
    { label: 'Support', href: '/admin/support' },
    { label: 'Platform Settings', href: '/admin/settings' },
    { label: 'All Profiles', href: '/profile/super-admin' }
  ]
};

export function getMenuForRole(role: UserRole) {
  return roleMenus[role];
}
