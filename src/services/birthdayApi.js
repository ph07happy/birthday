/**
 * Birthday API Client
 * 
 * Communicates with:
 * 1. Linked Google Sheet (via Google Visualization Query API & CSV export)
 * 2. Google Apps Script Web App (if configured)
 * 3. Curated local demo dataset (if enabled in siteConfig)
 * 
 * Respects strict birthday access control:
 * Responses are never revealed before the configured birthday countdown completes.
 */
import { apiConfig } from '../config/apiConfig.js';
import { siteConfig } from '../config/siteConfig.js';
import { isBirthdayReached } from '../utils/dateUtils.js';
import { DEMO_RESPONSES } from './demoDataService.js';
import { processRawResponses } from './messageService.js';

/**
 * Executes a JSONP request for Google Apps Script
 */
function fetchJsonp(url, params = {}, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const callbackName = `spider_jsonp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const urlObj = new URL(url);

    Object.entries(params).forEach(([key, val]) => {
      urlObj.searchParams.set(key, val);
    });
    urlObj.searchParams.set('callback', callbackName);

    let script = document.createElement('script');
    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error(`JSONP request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.src = urlObj.toString();
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP network error'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Fetches responses directly from the public Google Sheet using GViz API
 */
async function fetchFromGoogleSheetDirect(spreadsheetId, gid, timeoutMs = 12000) {
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}&_t=${Date.now()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(gvizUrl, {
    method: 'GET',
    signal: controller.signal,
  });

  clearTimeout(timer);

  if (!response.ok) {
    throw new Error(`Google Sheets responded with HTTP ${response.status}`);
  }

  const rawText = await response.text();
  const match = rawText.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);

  if (!match || !match[1]) {
    throw new Error('Unexpected response format from Google Sheets');
  }

  const parsed = JSON.parse(match[1]);
  const table = parsed.table || {};
  const cols = table.cols || [];
  const rows = table.rows || [];

  const headers = cols.map((col, idx) => col.label || `col_${idx}`);

  const rawResponses = rows.map((row, rIdx) => {
    const obj = { id: `response-${String(rIdx + 1).padStart(3, '0')}` };
    (row.c || []).forEach((cell, cIdx) => {
      const headerName = headers[cIdx];
      if (headerName && cell && cell.v !== null && cell.v !== undefined) {
        obj[headerName] = cell.f || cell.v;
      }
    });
    return obj;
  });

  return rawResponses;
}

/**
 * Fetches all unlocked birthday responses
 */
export async function fetchBirthdayMessages() {
  const { appsScriptUrl, spreadsheetId, gid, apiMode, requestTimeoutMs } = apiConfig;

  // Strict Client-Side Birthday Check
  const unlocked = isBirthdayReached(siteConfig.birthdayDate);
  if (!unlocked) {
    return {
      locked: true,
      source: 'client-lock',
      unlockTime: siteConfig.birthdayDate,
      message: 'The multiverse is locked until the countdown finishes.',
      data: [],
    };
  }

  // Strategy 1: Google Apps Script Web App (if configured)
  if (appsScriptUrl && (apiMode === 'auto' || apiMode === 'apps-script')) {
    try {
      const urlObj = new URL(appsScriptUrl);
      urlObj.searchParams.set('action', 'getMessages');
      urlObj.searchParams.set('_t', Date.now().toString());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

      const response = await fetch(urlObj.toString(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.locked) {
          return {
            locked: true,
            source: 'apps-script',
            unlockTime: json.unlockTime,
            message: json.message,
            data: [],
          };
        }
        return {
          locked: false,
          source: 'apps-script',
          data: processRawResponses(json.data || []),
          count: (json.data || []).length,
        };
      }
    } catch (appsScriptErr) {
      console.warn('[SpiderApi] Apps Script fetch failed, attempting live Google Sheet...', appsScriptErr);
    }
  }

  // Strategy 2: Direct Google Sheet Live Feed (from linked Google Form spreadsheet)
  if (spreadsheetId && gid && (apiMode === 'auto' || apiMode === 'sheets-live')) {
    try {
      const rawRows = await fetchFromGoogleSheetDirect(spreadsheetId, gid, requestTimeoutMs);
      const processed = processRawResponses(rawRows);

      // If sheet has submissions, return them
      if (processed.length > 0) {
        return {
          locked: false,
          source: 'google-sheets-live',
          data: processed,
          count: processed.length,
        };
      }

      // If sheet is connected but has 0 submissions yet, check if demo data should be shown
      if (siteConfig.showDemoData) {
        console.info('[SpiderApi] Google Sheet has 0 responses yet, showing demo data for preview.');
        return {
          locked: false,
          source: 'demo-preview',
          data: processRawResponses(DEMO_RESPONSES),
          count: DEMO_RESPONSES.length,
          notice: 'Showing preview responses while awaiting real submissions.',
        };
      }

      return {
        locked: false,
        source: 'google-sheets-live',
        data: [],
        count: 0,
      };
    } catch (sheetErr) {
      console.warn('[SpiderApi] Direct Google Sheet fetch failed:', sheetErr);
    }
  }

  // Strategy 3: Demo dataset fallback (only if enabled)
  if (siteConfig.showDemoData) {
    return {
      locked: false,
      source: 'demo',
      data: processRawResponses(DEMO_RESPONSES),
      count: DEMO_RESPONSES.length,
    };
  }

  // Production failure state (no demo data, real sources unreachable)
  throw new Error('Unable to establish connection to the Google Sheet or backend endpoint.');
}
