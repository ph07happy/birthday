/**
 * Birthday API Client
 * 
 * Communicates with the Google Apps Script Web App backend.
 * Supports direct CORS fetch and JSONP fallback to handle cross-origin Google restrictions.
 */
import { apiConfig } from '../config/apiConfig.js';
import { siteConfig } from '../config/siteConfig.js';
import { DEMO_RESPONSES } from './demoDataService.js';
import { processRawResponses } from './messageService.js';

/**
 * Executes a JSONP request as a resilient fallback
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
 * Fetches all unlocked birthday responses
 */
export async function fetchBirthdayMessages() {
  const { appsScriptUrl, apiMode, requestTimeoutMs } = apiConfig;

  // Strict Demo Mode or No Apps Script URL provided yet
  if (apiMode === 'demo' || !appsScriptUrl) {
    if (siteConfig.showDemoData) {
      return {
        locked: false,
        source: 'demo',
        data: processRawResponses(DEMO_RESPONSES),
        count: DEMO_RESPONSES.length,
      };
    }
    // Production without demo data: return empty list waiting for responses
    return {
      locked: false,
      source: 'unconfigured',
      data: [],
      count: 0,
      notice: 'Backend URL not yet configured in src/config/apiConfig.js',
    };
  }

  // Live Apps Script Endpoint configured
  const urlObj = new URL(appsScriptUrl);
  urlObj.searchParams.set('action', 'getMessages');
  urlObj.searchParams.set('_t', Date.now().toString()); // Cache buster

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

    const response = await fetch(urlObj.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      mode: 'cors',
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.locked) {
      return {
        locked: true,
        source: 'apps-script',
        unlockTime: json.unlockTime,
        message: json.message || 'Universe locked until birthday countdown ends.',
        data: [],
      };
    }

    return {
      locked: false,
      source: 'apps-script',
      data: processRawResponses(json.data || json.responses || []),
      count: (json.data || []).length,
    };
  } catch (err) {
    console.warn('[SpiderApi] Direct fetch failed, attempting JSONP fallback...', err);

    if (apiConfig.useJsonpFallback && typeof window !== 'undefined') {
      try {
        const jsonpData = await fetchJsonp(appsScriptUrl, { action: 'getMessages' }, requestTimeoutMs);
        if (jsonpData.locked) {
          return {
            locked: true,
            source: 'apps-script-jsonp',
            unlockTime: jsonpData.unlockTime,
            message: jsonpData.message,
            data: [],
          };
        }
        return {
          locked: false,
          source: 'apps-script-jsonp',
          data: processRawResponses(jsonpData.data || jsonpData.responses || []),
          count: (jsonpData.data || []).length,
        };
      } catch (jsonpErr) {
        console.warn('[SpiderApi] JSONP fallback also failed:', jsonpErr);
      }
    }

    // In auto mode with demo data enabled, fallback to demo dataset
    if (apiMode === 'auto' && siteConfig.showDemoData) {
      console.info('[SpiderApi] Falling back to local demo dataset.');
      return {
        locked: false,
        source: 'demo-fallback',
        data: processRawResponses(DEMO_RESPONSES),
        count: DEMO_RESPONSES.length,
        error: err.message,
      };
    }

    throw new Error(`Failed to load messages from backend: ${err.message}`);
  }
}
