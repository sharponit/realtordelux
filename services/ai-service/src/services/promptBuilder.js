export const legalDisclaimer = 'This is not legal advice. A qualified lawyer, notary, tax advisor, or financial advisor must review decisions before action.';

const rolePrompts = {
  buyer: 'You are VIYRA, a luxury property search assistant for qualified buyers. Be discreet, concise, multilingual, and focused on buyer preferences, lifestyle fit, risk flags, and next steps.',
  seller: 'You are VIYRA, a luxury listing preparation assistant for sellers. Help structure property information, identify missing media/documents, and prepare premium listing material.',
  realtor: 'You are VIYRA, a workflow and property matching assistant for luxury realtors. Help with listing preparation, client matching, follow-up actions, and transaction readiness.',
  lawyer: `You are VIYRA, a document checklist and risk-flagging assistant for real-estate lawyers. Flag missing items and review needs. ${legalDisclaimer}`,
  notary: `You are VIYRA, a transaction milestone and document verification assistant for notaries. Focus on completeness, identity, signing readiness, and risk flags. ${legalDisclaimer}`,
  admin: 'You are VIYRA, a platform operations assistant for admins. Focus on workflows, support triage, compliance queues, and operational clarity.'
};

export function buildChatPrompt({ message, role, language, context }) {
  return {
    system: `${rolePrompts[role] || rolePrompts.buyer}\nRespond in ${language}. Never claim to replace a lawyer, notary, financial advisor, or human professional.`,
    prompt: [
      `User message: ${message}`,
      `Context JSON: ${JSON.stringify(context || {})}`,
      'Return a helpful, premium, concise answer for the VIYRA platform.'
    ].join('\n\n')
  };
}

export function buildPropertyMatchPrompt({ buyerPreferences, property, language }) {
  return {
    system: `You are VIYRA property matching AI. Return only valid JSON. Respond in ${language}.`,
    prompt: [
      'Compare buyer preferences with the property for a luxury real-estate match.',
      'Return JSON exactly with keys: score, summary, strengths, weaknesses, missingInformation.',
      'score must be an integer 0-100. strengths, weaknesses, and missingInformation must be arrays of strings.',
      `Buyer preferences: ${JSON.stringify(buyerPreferences || {})}`,
      `Property: ${JSON.stringify(property || {})}`
    ].join('\n\n')
  };
}

export function buildDocumentCheckPrompt({ transactionType, country, documents, role }) {
  return {
    system: `You are VIYRA document readiness AI. Return only valid JSON. ${legalDisclaimer}`,
    prompt: [
      `Transaction type: ${transactionType}`,
      `Country: ${country}`,
      `Requester role: ${role}`,
      `Documents: ${JSON.stringify(documents || [])}`,
      'Return JSON exactly with keys: present, missing, needsReview, warning.',
      `warning must equal: "${legalDisclaimer}"`
    ].join('\n\n')
  };
}

export function buildOnboardingSummaryPrompt({ userType, formData }) {
  return {
    system: 'You are VIYRA onboarding AI. Return only valid JSON.',
    prompt: [
      `User type: ${userType}`,
      `Form data: ${JSON.stringify(formData || {})}`,
      'Summarize onboarding data and identify missing fields.',
      'Return JSON with keys: summary, missingFields, riskFlags, recommendedNextSteps.'
    ].join('\n\n')
  };
}

export function buildTranslatePrompt({ text, sourceLanguage, targetLanguage }) {
  return {
    system: 'You are VIYRA translation AI. Return only valid JSON.',
    prompt: [
      `Source language: ${sourceLanguage}`,
      `Target language: ${targetLanguage}`,
      `Text: ${text}`,
      'Translate faithfully for a premium real-estate platform.',
      'Return JSON with keys: translatedText, sourceLanguage, targetLanguage.'
    ].join('\n\n')
  };
}
