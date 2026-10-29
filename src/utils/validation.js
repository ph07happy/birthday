/**
 * Validation and normalization helpers for Google Form submissions
 */

/**
 * Normalizes header keys to lowercase alphanumeric characters.
 * E.g., "Message To", "message to ", "MESSAGE  TO" -> "messageto"
 */
export function normalizeHeaderKey(header) {
  if (!header || typeof header !== 'string') return '';
  return header.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Finds the corresponding value for a canonical key among object properties,
 * matching flexibly against normalized variations with strict exact match priority.
 */
export function extractFieldValue(rowObj, canonicalKey) {
  if (!rowObj || typeof rowObj !== 'object') return '';

  const targetKey = normalizeHeaderKey(canonicalKey);

  // Pass 1: Strict exact normalized match across all keys
  for (const [key, value] of Object.entries(rowObj)) {
    if (normalizeHeaderKey(key) === targetKey) {
      return value !== undefined && value !== null ? String(value).trim() : '';
    }
  }

  // Pass 2: Fallback partial match, avoiding cross-contamination between "message", "messageby", and "messageto"
  for (const [key, value] of Object.entries(rowObj)) {
    const norm = normalizeHeaderKey(key);

    // Guard: Prevent "message" from matching "messageby" or "messageto"
    if (targetKey === 'message' && (norm.includes('by') || norm.includes('to'))) {
      continue;
    }
    if (targetKey === 'messageby' && norm.includes('to')) {
      continue;
    }
    if (targetKey === 'messageto' && norm.includes('by')) {
      continue;
    }

    if (norm.includes(targetKey) || targetKey.includes(norm)) {
      return value !== undefined && value !== null ? String(value).trim() : '';
    }
  }

  return '';
}

/**
 * Validates a single response object
 */
export function isValidResponse(response) {
  if (!response || typeof response !== 'object') return false;
  if (!response.id) return false;
  // A response is valid if it has message, messageBy, or pictures
  const hasMessage = Boolean(response.message && response.message.trim());
  const hasSender = Boolean(response.messageBy && response.messageBy.trim());
  const hasPictures = Boolean(Array.isArray(response.pictures) && response.pictures.length > 0);
  return hasMessage || hasSender || hasPictures;
}
