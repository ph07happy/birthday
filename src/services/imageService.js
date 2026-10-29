/**
 * Image handling service
 */
import { extractDriveFileId, getDisplayableImageUrl, normalizePictures } from '../utils/imageUtils.js';

export { extractDriveFileId, getDisplayableImageUrl, normalizePictures };

/**
 * Returns an inline SVG placeholder when an image fails to load
 */
export function getFallbackImageSvg(text = 'PHOTO UNAVAILABLE') {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#12121E" stroke="#00F0FF" stroke-width="4"/>
    <defs>
      <pattern id="hatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(229, 37, 33, 0.25)" stroke-width="2" />
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#hatch)"/>
    <circle cx="300" cy="180" r="45" fill="none" stroke="#E52521" stroke-width="4"/>
    <path d="M280 180 L320 180 M300 160 L300 200" stroke="#00F0FF" stroke-width="3"/>
    <text x="300" y="260" font-family="'Space Grotesk', sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      ${text}
    </text>
    <text x="300" y="285" font-family="'Space Grotesk', sans-serif" font-size="13" fill="#9BA1B6" text-anchor="middle">
      CHECK GOOGLE DRIVE SHARING PERMISSIONS
    </text>
  </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
