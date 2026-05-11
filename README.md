# Luxary Realtor™

Enterprise MVP foundation for a global luxury real-estate operating system built with Next.js + TypeScript + Tailwind.

## Features
- Luxury property discovery and detail views
- AI concierge intake with mocked recommendations
- Role-based dashboard foundation
- Offer/transaction timeline architecture
- Secure document center placeholder
- AI agent center for bottlenecks and risk alerts
- Multi-market architecture
- i18n foundation (EN/ES/AR)
- Legal and compliance placeholder pages
- Audit logging + watermarking architecture placeholders

## Intellectual Property

Luxary Realtor™  
Developed by SaaSolutions SL  
Intellectual Property owned by Paradox FZCO  
© 2026 Paradox FZCO. All rights reserved.

## Deployment Architecture

### Vercel (Frontend)
- Next.js App Router UI and routing.
- Lightweight frontend logic and API surface.
- Must run even if AI backend is offline.

### Supabase (Backend Platform)
- PostgreSQL data store, Auth, Storage, Realtime, and RLS.
- Use `lib/supabase/*` service abstraction and typed models.
- Migration and seed placeholders in `supabase/`.

### Railway (AI/LLM Backend)
- Dedicated heavy AI workloads in `services/ai-service`.
- Exposes match/scoring/translation/chat endpoints.
- Provider abstraction placeholders for OpenAI/OpenRouter/Claude/Ollama.

## Vercel Deployment Notes
1. Add env variables from `.env.example` in Vercel project settings.
2. Deploy frontend independently of AI service.
3. If `AI_SERVICE_URL` is missing/offline, frontend automatically falls back to mock AI responses.
4. Keep long-running inference off Vercel and route it to Railway.

## Supabase Architecture Notes
- RLS strategy placeholders are documented in migration SQL.
- Storage buckets to provision: property-images, floorplans, transaction-documents, legal-documents, kyc-files, signed-contracts, upload-staging.
- Future placeholders: signed URLs, expiring access, watermarking, virus scanning, chain-of-custody audit logs.

## Realtime + Edge Functions (Placeholders)
- Realtime channels: notifications, offers, transaction stages, messages, AI alerts, document approvals.
- Edge functions: workflow automation, notification triggers, AI triggers, webhooks, PDF generation, escrow/payment events.
