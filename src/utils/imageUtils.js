/**
 * Image parsing and Google Drive URL resolution
 */

/**
 * Extracts a Google Drive File ID from various share link formats:
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID...
 * - https://drive.google.com/thumbnail?id=FILE_ID...
 * - https://lh3.googleusercontent.com/d/FILE_ID...
 */
export function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') return null;

  // Match /file/d/ID
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Match id=ID query parameter
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // Match /d/ID (lh3)
  const lh3Match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}

/**
 * Converts a raw image or Google Drive link into an embeddable image URL.
 * Google Drive files shared as 'Anyone with link can view' work best with:
 * - https://lh3.googleusercontent.com/d/{id}=w1600 (Fastest Google CDN image proxy)
 * - Fallback: https://drive.google.com/thumbnail?id={id}&sz=w1600
 */
export function getDisplayableImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  const cleanUrl = rawUrl.trim();
  const driveId = extractDriveFileId(cleanUrl);

  if (driveId) {
    // Return high-resolution thumbnail proxy
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
  }

  return cleanUrl;
}

/**
 * Splits raw cell text (which might contain multiple comma-, newline-, or semicolon-delimited URLs)
 * into an array of clean URL strings.
 */
export function splitPictureLinks(rawInput) {
  if (!rawInput) return [];

  if (Array.isArray(rawInput)) {
    return rawInput.flatMap((item) => splitPictureLinks(item));
  }

  if (typeof rawInput !== 'string') return [];

  // Split by common delimiters in Google Form spreadsheets: comma, semicolon, newline, or whitespace between http
  const parts = rawInput
    .split(/[\r\n,;]+|\s+(?=https?:\/\/)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image')));

  return parts;
}

/**
 * Normalizes raw uploaded picture input into an array of structured picture objects:
 * [{ id: string, url: string, alt: string }]
 */
export function normalizePictures(rawInput, responseId = 'response') {
  const urls = splitPictureLinks(rawInput);

  return urls.map((url, idx) => {
    const displayUrl = getDisplayableImageUrl(url);
    return {
      id: `${responseId}-pic-${idx + 1}`,
      url: displayUrl,
      rawUrl: url,
      alt: `Birthday memory ${idx + 1}`,
    };
  });
}
