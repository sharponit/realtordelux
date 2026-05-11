/** Luxary Realtor™ */
export const routes = {
  health: () => ({ ok: true, service: 'ai-service', provider: 'mock' }),
  matchProperty: () => ({ matches: [{ propertyId: 'p1', score: 93 }] }),
  generatePropertyExplanation: () => ({ text: 'AI explanation placeholder.' }),
  transactionSummary: () => ({ summary: 'Transaction summary placeholder.' }),
  detectBottlenecks: () => ({ alerts: ['Missing nota simple'] }),
  generateNextActions: () => ({ steps: ['Upload proof of funds'] }),
  translate: () => ({ text: 'Translated output placeholder' }),
  chat: () => ({ reply: 'Concierge reply placeholder' })
};
