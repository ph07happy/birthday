/**
 * Application Route Paths & Navigation Helpers
 */

export const ROUTE_PATHS = {
  HOME: '/',
  COUNTDOWN: '/countdown',
  GALLERY: '/gallery',
  MESSAGE: '/messages/:id',
  NOT_FOUND: '*',
};

/**
 * Builds the URL path to an individual response page
 */
export function getMessageRoutePath(responseId) {
  return `/messages/${encodeURIComponent(responseId)}`;
}
