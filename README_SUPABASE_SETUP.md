# Supabase Setup (Project: piyrgfknwqgthqfwdhzn)

1) Open SQL Editor in Supabase dashboard for:
https://piyrgfknwqgthqfwdhzn.supabase.co

2) Execute the full schema from:
- `supabase/migrations/20260511_initial.sql`

3) Execute seeds from:
- `supabase/seeds/seed.sql`

4) Add project variables:
- NEXT_PUBLIC_SUPABASE_URL=https://piyrgfknwqgthqfwdhzn.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=...

5) Optional RLS hardening:
- Add table-level policies per role (buyer/seller/realtor/lawyer/notary/admin)
- Restrict document and transaction access to assigned records.

Note: This repo cannot directly provision your hosted Supabase instance without service credentials.
