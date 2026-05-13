export function parseJsonObject(text, fallback) {
  if (!text || typeof text !== 'string') {
    return fallback;
  }

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return fallback;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return fallback;
    }
  }
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}
