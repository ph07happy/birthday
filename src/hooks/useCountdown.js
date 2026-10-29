/**
 * useCountdown Hook
 * 
 * Provides an accurate, second-by-second countdown to the target birthday date.
 * - Handles browser tab sleep & wake-up via visibilitychange
 * - Cleans up interval on unmount
 * - Halts at zero and never displays negative values
 * - Retains 0 Days · 0 Hours · 0 Minutes · 0 Seconds after completion
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateTimeRemaining } from '../utils/dateUtils';

export function useCountdown(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetDateStr));
  const intervalRef = useRef(null);
  const targetDateRef = useRef(targetDateStr);

  targetDateRef.current = targetDateStr;

  const updateCountdown = useCallback(() => {
    const currentTarget = targetDateRef.current;
    const remaining = calculateTimeRemaining(currentTarget);
    setTimeLeft(remaining);

    if (remaining.isReached && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Immediate initial sync
    updateCountdown();

    const initial = calculateTimeRemaining(targetDateRef.current);
    if (initial.isReached) {
      return;
    }

    // Start 1-second interval
    intervalRef.current = setInterval(updateCountdown, 1000);

    // Re-sync on visibility change (recovers from mobile/desktop tab sleep)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCountdown();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetDateStr, updateCountdown]);

  return {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
    totalMs: timeLeft.totalMs,
    isReached: timeLeft.isReached,
    isInvalid: timeLeft.isInvalid,
    resync: updateCountdown,
  };
}
