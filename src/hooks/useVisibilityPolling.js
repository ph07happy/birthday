/**
 * useVisibilityPolling Hook
 * 
 * Executes an async polling task on an interval, pausing when the browser tab
 * is hidden and triggering an immediate check upon tab re-focus.
 */
import { useEffect, useRef, useCallback } from 'react';

export function useVisibilityPolling(callback, intervalMs, isEnabled = true) {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const executePoll = useCallback(async () => {
    if (isFetchingRef.current || !isEnabled) return;
    try {
      isFetchingRef.current = true;
      await savedCallback.current();
    } catch (err) {
      console.warn('[VisibilityPolling] Polling error:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || !intervalMs || intervalMs <= 0) return;

    // Start recurring interval
    timerRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        executePoll();
      }
    }, intervalMs);

    // Tab visibility listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        executePoll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, isEnabled, executePoll]);

  return { triggerImmediate: executePoll };
}
