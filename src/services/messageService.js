/**
 * Message Service: Transforms, normalizes, and filters Google Form responses
 */
import { extractFieldValue, isValidResponse } from '../utils/validation.js';
import { normalizePictures } from '../utils/imageUtils.js';

/**
 * Normalizes a raw submission item (from Google Apps Script or JSON payload)
 * into the standard application response schema:
 * {
 *   id: string,
 *   messageTo: string,
 *   messageBy: string,
 *   pictures: Array<{ id, url, alt }>
 * }
 */
export function normalizeFormResponse(rawItem, index = 0) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  // Derive stable response ID
  const rawId = rawItem.id || rawItem.responseId || rawItem._id;
  const stableId = rawId ? String(rawId) : `response-${String(index + 1).padStart(3, '0')}`;

  // Extract the exact 3 fields
  const messageTo = extractFieldValue(rawItem, 'messageto') || rawItem.messageTo || 'Birthday Star';
  const messageBy = extractFieldValue(rawItem, 'messageby') || rawItem.messageBy || '';
  
  // Extract picture field
  const rawPictures = 
    rawItem.uploadPictures ||
    rawItem.uploadpictures ||
    extractFieldValue(rawItem, 'uploadpictures') ||
    rawItem.pictures ||
    [];

  const pictures = normalizePictures(rawPictures, stableId);

  return {
    id: stableId,
    messageTo,
    messageBy,
    pictures,
    timestamp: rawItem.timestamp || rawItem.Timestamp || new Date().toISOString(),
  };
}

/**
 * Normalizes an array of raw response objects, deduplicating by stable ID
 */
export function processRawResponses(rawList = []) {
  if (!Array.isArray(rawList)) return [];

  const seenIds = new Set();
  const processed = [];

  rawList.forEach((item, index) => {
    const normalized = normalizeFormResponse(item, index);
    if (normalized && isValidResponse(normalized) && !seenIds.has(normalized.id)) {
      seenIds.add(normalized.id);
      processed.push(normalized);
    }
  });

  return processed;
}

/**
 * Finds adjacent responses (previous and next) in an ordered array
 */
export function getAdjacentResponses(responses, currentId) {
  if (!Array.isArray(responses) || responses.length === 0 || !currentId) {
    return { previous: null, next: null, currentIndex: -1, total: 0 };
  }

  const currentIndex = responses.findIndex((r) => r.id === currentId);
  if (currentIndex === -1) {
    return { previous: null, next: null, currentIndex: -1, total: responses.length };
  }

  const previous = currentIndex > 0 ? responses[currentIndex - 1] : null;
  const next = currentIndex < responses.length - 1 ? responses[currentIndex + 1] : null;

  return {
    previous,
    next,
    currentIndex,
    total: responses.length,
  };
}
