/**
 * useBirthdayReveal Hook
 * 
 * Authoritative single source of truth for the birthday reveal state.
 * Evaluates whether the configured target timestamp has arrived.
 */
import { useCountdown } from './useCountdown';
import { siteConfig } from '../config/siteConfig';

export function useBirthdayReveal() {
  const countdown = useCountdown(siteConfig.birthdayDate);

  const isUnlocked = countdown.isReached;
  const isCountingDown = !countdown.isReached && !countdown.isInvalid;

  return {
    isUnlocked,
    isCountingDown,
    countdown,
    birthdayName: siteConfig.birthdayName,
    birthdayDate: siteConfig.birthdayDate,
    timeZone: siteConfig.timeZone,
  };
}
