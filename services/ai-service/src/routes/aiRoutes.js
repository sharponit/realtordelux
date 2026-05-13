import { Router } from 'express';
import { z } from 'zod';
import { requireApiKey } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validation.js';
import { ollama } from '../services/ollamaClient.js';
import { logAiEvent } from '../services/supabaseClient.js';
import {
  buildChatPrompt,
  buildDocumentCheckPrompt,
  buildOnboardingSummaryPrompt,
  buildPropertyMatchPrompt,
  buildTranslatePrompt,
  legalDisclaimer
} from '../services/promptBuilder.js';
import { ensureArray, parseJsonObject } from '../utils/json.js';

export const aiRouter = Router();

aiRouter.use('/ai', requireApiKey, rateLimit);

const roleSchema = z.enum(['buyer', 'seller', 'realtor', 'lawyer', 'notary', 'admin']);
const languageSchema = z.enum(['en', 'es', 'nl', 'fr', 'ar', 'de']);

const chatSchema = z.object({
  message: z.string().min(1).max(8000),
  role: roleSchema,
  language: languageSchema.default('en'),
  context: z.record(z.unknown()).default({})
});

const matchPropertySchema = z.object({
  buyerPreferences: z.record(z.unknown()).default({}),
  property: z.record(z.unknown()).default({}),
  language: languageSchema.default('en')
});

const documentCheckSchema = z.object({
  transactionType: z.enum(['purchase', 'sale', 'rental']),
  country: z.string().min(1),
  documents: z.array(z.unknown()).default([]),
  role: z.enum(['lawyer', 'notary', 'realtor', 'buyer', 'seller'])
});

const onboardingSummarySchema = z.object({
  userType: z.enum(['realtor', 'lawyer', 'notary', 'buyer', 'seller']),
  formData: z.record(z.unknown()).default({})
});

const translateSchema = z.object({
  text: z.string().min(1).max(16000),
  sourceLanguage: z.string().min(2).default('auto'),
  targetLanguage: z.string().min(2)
});

function ollamaUnavailable(res, error) {
  return res.status(503).json({
    error: 'Ollama is not available.',
    detail: error instanceof Error ? error.message : String(error)
  });
}

aiRouter.post('/ai/chat', validateBody(chatSchema), async (req, res) => {
  const body = req.validatedBody;
  const prompt = buildChatPrompt(body);

  try {
    const result = await ollama.generate(prompt);
    await logAiEvent({ type: 'chat', role: body.role, language: body.language });
    return res.json({
      reply: result.response?.trim() || '',
      model: result.model
    });
  } catch (error) {
    return ollamaUnavailable(res, error);
  }
});

aiRouter.post('/ai/match-property', validateBody(matchPropertySchema), async (req, res) => {
  const body = req.validatedBody;
  const prompt = buildPropertyMatchPrompt(body);
  const fallback = {
    score: 0,
    summary: 'The match could not be evaluated because the AI model response was unavailable or invalid.',
    strengths: [],
    weaknesses: ['AI response unavailable'],
    missingInformation: []
  };

  try {
    const result = await ollama.generate({ ...prompt, format: 'json' });
    const parsed = parseJsonObject(result.response, fallback);
    await logAiEvent({ type: 'match_property', language: body.language });

    return res.json({
      score: Number.isFinite(Number(parsed.score)) ? Math.max(0, Math.min(100, Number(parsed.score))) : 0,
      summary: String(parsed.summary || fallback.summary),
      strengths: ensureArray(parsed.strengths),
      weaknesses: ensureArray(parsed.weaknesses),
      missingInformation: ensureArray(parsed.missingInformation)
    });
  } catch (error) {
    return ollamaUnavailable(res, error);
  }
});

aiRouter.post('/ai/document-check', validateBody(documentCheckSchema), async (req, res) => {
  const body = req.validatedBody;
  const prompt = buildDocumentCheckPrompt(body);
  const fallback = {
    present: [],
    missing: [],
    needsReview: ['Human legal review required'],
    warning: legalDisclaimer
  };

  try {
    const result = await ollama.generate({ ...prompt, format: 'json' });
    const parsed = parseJsonObject(result.response, fallback);
    await logAiEvent({ type: 'document_check', role: body.role, metadata: { country: body.country } });

    return res.json({
      present: ensureArray(parsed.present),
      missing: ensureArray(parsed.missing),
      needsReview: ensureArray(parsed.needsReview),
      warning: legalDisclaimer
    });
  } catch (error) {
    return ollamaUnavailable(res, error);
  }
});

aiRouter.post('/ai/onboarding-summary', validateBody(onboardingSummarySchema), async (req, res) => {
  const body = req.validatedBody;
  const prompt = buildOnboardingSummaryPrompt(body);
  const fallback = {
    summary: 'Onboarding summary could not be generated.',
    missingFields: [],
    riskFlags: [],
    recommendedNextSteps: []
  };

  try {
    const result = await ollama.generate({ ...prompt, format: 'json' });
    const parsed = parseJsonObject(result.response, fallback);
    await logAiEvent({ type: 'onboarding_summary', role: body.userType });

    return res.json({
      summary: String(parsed.summary || fallback.summary),
      missingFields: ensureArray(parsed.missingFields),
      riskFlags: ensureArray(parsed.riskFlags),
      recommendedNextSteps: ensureArray(parsed.recommendedNextSteps)
    });
  } catch (error) {
    return ollamaUnavailable(res, error);
  }
});

aiRouter.post('/ai/translate', validateBody(translateSchema), async (req, res) => {
  const body = req.validatedBody;
  const prompt = buildTranslatePrompt(body);
  const fallback = {
    translatedText: body.text,
    sourceLanguage: body.sourceLanguage,
    targetLanguage: body.targetLanguage
  };

  try {
    const result = await ollama.generate({ ...prompt, format: 'json' });
    const parsed = parseJsonObject(result.response, fallback);
    await logAiEvent({ type: 'translate', language: body.targetLanguage });

    return res.json({
      translatedText: String(parsed.translatedText || fallback.translatedText),
      sourceLanguage: String(parsed.sourceLanguage || body.sourceLanguage),
      targetLanguage: String(parsed.targetLanguage || body.targetLanguage)
    });
  } catch (error) {
    return ollamaUnavailable(res, error);
  }
});
