# VIYRA AI Service

Railway-deployable AI microservice for the VIYRA luxury real-estate platform. It runs a small local/open-source model through Ollama and exposes protected JSON APIs for the Vercel frontend and future backend workflows.

## Stack

- Node.js 20
- Express
- Ollama local model runtime
- Default model: `qwen2.5:3b`
- Dockerfile deployment for Railway
- API key protection for `/ai/*`
- Public healthcheck at `/health`
- Supabase service-role placeholder for server-side AI event logging

## Endpoints

Public:

- `GET /health`

Protected with `x-api-key`:

- `POST /ai/chat`
- `POST /ai/match-property`
- `POST /ai/document-check`
- `POST /ai/onboarding-summary`
- `POST /ai/translate`

## Environment Variables

```env
PORT=8080
AI_API_KEY=change-me
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_ORIGINS=https://viyra.com,https://www.viyra.com
REQUEST_TIMEOUT_MS=90000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=30
PULL_MODEL_ON_START=true
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend. Only this Railway service should receive it.

## Railway Deployment

1. Create a new Railway service from this repository.
2. Set the service root to `services/ai-service`.
3. Use Dockerfile deployment.
4. Add the environment variables above.
5. Set the healthcheck path to `/health`.
6. Add a persistent volume and mount it at:

```txt
/data/ollama
```

Ollama model files are stored under `/data/ollama/models`. Without the persistent volume, Railway will need to download the model again after redeploys.

The container starts Ollama first, waits for `/api/tags`, then starts the Express app. If `PULL_MODEL_ON_START=true`, the app attempts to pull `OLLAMA_MODEL` if it is missing. First deploy can take several minutes because small models are still multiple GB. If automatic pull is too slow for your Railway plan, set `PULL_MODEL_ON_START=false`, open a Railway shell, and run:

```bash
ollama pull qwen2.5:3b
```

Alternative model:

```env
OLLAMA_MODEL=llama3.2:3b
```

## Local Development With Existing Ollama

Install and start Ollama locally:

```bash
ollama serve
ollama pull qwen2.5:3b
```

In another terminal:

```bash
cd services/ai-service
npm install
cp .env.example .env
npm run dev
```

Healthcheck:

```bash
curl http://localhost:8080/health
```

## Local Development With Docker

```bash
cd services/ai-service
docker build -t viyra-ai .
docker run --rm -p 8080:8080 \
  -e AI_API_KEY=local-secret \
  -e OLLAMA_MODEL=qwen2.5:3b \
  -v viyra-ollama:/data/ollama \
  viyra-ai
```

## Sample Requests

Health:

```bash
curl http://localhost:8080/health
```

Chat:

```bash
curl -X POST http://localhost:8080/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: local-secret" \
  -d '{
    "message": "Help me prepare my Marbella villa listing.",
    "role": "seller",
    "language": "en",
    "context": { "propertyType": "villa", "city": "Marbella" }
  }'
```

Property match:

```bash
curl -X POST http://localhost:8080/ai/match-property \
  -H "Content-Type: application/json" \
  -H "x-api-key: local-secret" \
  -d '{
    "buyerPreferences": {
      "budget": 9000000,
      "city": "Marbella",
      "mustHave": ["sea view", "privacy", "pool"]
    },
    "property": {
      "price": 8500000,
      "city": "Marbella",
      "features": ["sea view", "pool", "gated community"]
    },
    "language": "en"
  }'
```

Document check:

```bash
curl -X POST http://localhost:8080/ai/document-check \
  -H "Content-Type: application/json" \
  -H "x-api-key: local-secret" \
  -d '{
    "transactionType": "purchase",
    "country": "Spain",
    "documents": ["passport", "proof of funds"],
    "role": "lawyer"
  }'
```

Onboarding summary:

```bash
curl -X POST http://localhost:8080/ai/onboarding-summary \
  -H "Content-Type: application/json" \
  -H "x-api-key: local-secret" \
  -d '{
    "userType": "realtor",
    "formData": {
      "country": "Spain",
      "registrationNumber": "",
      "firmName": "Viyra Marbella Partners"
    }
  }'
```

Translation:

```bash
curl -X POST http://localhost:8080/ai/translate \
  -H "Content-Type: application/json" \
  -H "x-api-key: local-secret" \
  -d '{
    "text": "Your private property onboarding is ready.",
    "sourceLanguage": "auto",
    "targetLanguage": "es"
  }'
```

## Security Notes

- `/health` is public.
- All `/ai/*` routes require `x-api-key`.
- CORS is restricted by `ALLOWED_ORIGINS`.
- Requests are rate-limited in memory.
- Legal/document outputs always include: `This is not legal advice.`
- The service never claims to replace a lawyer, notary, financial advisor, or human professional.

## Supabase Placeholder

`src/services/supabaseClient.js` prepares a service-role client for future backend-only logging and AI workflow persistence. Suggested future table:

```sql
create table if not exists public.ai_service_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  role text,
  language text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

Keep this service-role key only in Railway.
