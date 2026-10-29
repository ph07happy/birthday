/**
 * Google Apps Script API Configuration
 * 
 * Replace APPS_SCRIPT_DEPLOYMENT_URL with the Web App URL generated from your
 * Google Apps Script project (e.g., https://script.google.com/macros/s/.../exec).
 */
export const apiConfig = {
  // Google Apps Script Web App Deployment URL
  // Paste your published deployment URL here:
  appsScriptUrl: "",

  // API Modes:
  // 'auto'        -> Fetches from Apps Script endpoint if configured; uses demo data if showDemoData=true
  // 'apps-script' -> Strictly requires Google Apps Script; errors out if unreachable
  // 'demo'        -> Strictly uses local demo dataset (offline development)
  apiMode: "auto",

  // Timeout for API requests in milliseconds
  requestTimeoutMs: 12000,

  // Use JSONP if direct CORS is restricted by certain browser extensions or network policies
  useJsonpFallback: true,
};
