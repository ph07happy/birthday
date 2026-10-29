/**
 * Date and Time utilities for Spider-Verse Countdown
 */

/**
 * Calculates remaining time components between now and the target date.
 * Returns { days, hours, minutes, seconds, totalMs, isReached, isInvalid }
 */
export function calculateTimeRemaining(targetDateStr) {
  if (!targetDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isReached: false, isInvalid: true };
  }

  const targetTime = new Date(targetDateStr).getTime();
  if (isNaN(targetTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isReached: false, isInvalid: true };
  }

  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isReached: true,
      isInvalid: false,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalMs: diff,
    isReached: false,
    isInvalid: false,
  };
}

/**
 * Checks whether the target date has passed.
 */
export function isBirthdayReached(targetDateStr) {
  if (!targetDateStr) return false;
  const targetTime = new Date(targetDateStr).getTime();
  if (isNaN(targetTime)) return false;
  return Date.now() >= targetTime;
}

/**
 * Formats a date into a stylized comic date string (e.g., "NOV 15, 2026")
 */
export function formatComicDate(dateStr, timeZone = 'UTC') {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone,
    }).format(d).toUpperCase();
  } catch {
    return dateStr;
  }
}
