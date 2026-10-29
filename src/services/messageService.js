/**
 * Message Service: Transforms, normalizes, and filters Google Form responses
 */
import { extractFieldValue, isValidResponse } from '../utils/validation.js';
import { normalizePictures } from '../utils/imageUtils.js';

/**
 * Normalizes a raw submission item into the standard application response schema:
 * {
 *   id: string,
 *   messageTo: string,       // Recipient name
 *   messageBy: string,       // Sender name
 *   message: string,         // Message content
 *   pictures: Array<{ id, url, alt }>
 * }
 */
export function normalizeFormResponse(rawItem, index = 0) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  // Derive stable response ID
  const rawId = rawItem.id || rawItem.responseId || rawItem._id;
  const stableId = rawId ? String(rawId) : `response-${String(index + 1).padStart(3, '0')}`;

  // 1. Recipient: "message to"
  const messageTo = 
    extractFieldValue(rawItem, 'messageto') || 
    rawItem.messageTo || 
    'Birthday Star';

  // 2. Sender: "message by"
  const rawMessageBy = 
    extractFieldValue(rawItem, 'messageby') || 
    rawItem.messageBy || 
    '';

  // 3. Message Body: "message" (New specific field)
  const rawMessage = 
    extractFieldValue(rawItem, 'message') || 
    rawItem.message || 
    '';

  // Determine final message content and sender
  // If specific "message" field is provided, use it as the message body, and messageBy as sender
  // If "message" is blank, fallback to messageBy (for backwards compatibility with older forms)
  const messageContent = rawMessage ? rawMessage.trim() : (rawMessageBy ? rawMessageBy.trim() : '');
  const senderName = rawMessageBy ? rawMessageBy.trim() : (rawMessage ? 'A Multiverse Friend' : '');

  // 4. Picture field: "upload pictures (in .jpg, .png)" / "upload pictures"
  const rawPictures = 
    extractFieldValue(rawItem, 'uploadpictures') ||
    rawItem.uploadPictures ||
    rawItem.uploadpictures ||
    rawItem.pictures ||
    [];

  const pictures = normalizePictures(rawPictures, stableId);

  return {
    id: stableId,
    messageTo,
    messageBy: senderName || 'A Multiverse Friend',
    message: messageContent,
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
