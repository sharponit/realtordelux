# Luxary Realtor™ AI Service (Railway)

Separate AI/LLM backend intended for Railway deployment.

## Endpoints
- POST /match-property
- POST /generate-property-explanation
- POST /transaction-summary
- POST /detect-bottlenecks
- POST /generate-next-actions
- POST /translate
- POST /chat
- GET /health

## Env
- AI_SERVICE_API_KEY=
- OPENAI_API_KEY=
- OPENROUTER_API_KEY=
- ANTHROPIC_API_KEY=
- OLLAMA_BASE_URL=

## Providers (placeholders)
- OpenAI
- Claude / OpenRouter
- Ollama / local LLMs

## Notes
- Keep heavy AI orchestration in Railway, not Vercel.
- Frontend should degrade gracefully to mock AI when service is down.
