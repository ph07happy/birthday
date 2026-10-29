/**
 * useBirthdayMessages Hook
 * 
 * Central manager for loading, caching, polling, and navigating birthday messages.
 * Strictly respects the birthday reveal lock: messages will NOT be requested
 * or exposed until the birthday countdown completes.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchBirthdayMessages } from '../services/birthdayApi';
import { getAdjacentResponses } from '../services/messageService';
import { useVisibilityPolling } from './useVisibilityPolling';
import { siteConfig } from '../config/siteConfig';

export function useBirthdayMessages(isUnlocked) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLockedByServer, setIsLockedByServer] = useState(false);
  const [newResponsesCount, setNewResponsesCount] = useState(0);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const previousCountRef = useRef(0);

  const loadMessages = useCallback(async (isPolling = false) => {
    // Before the birthday reveal, strictly do not fetch message content
    if (!isUnlocked) {
      setMessages([]);
      return;
    }

    if (!isPolling) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await fetchBirthdayMessages();

      if (result.locked) {
        setIsLockedByServer(true);
        setMessages([]);
      } else {
        setIsLockedByServer(false);
        const incomingData = result.data || [];

        // Check if new responses arrived during polling
        if (isPolling && incomingData.length > previousCountRef.current && previousCountRef.current > 0) {
          const added = incomingData.length - previousCountRef.current;
          setNewResponsesCount(added);
          setShowNewBadge(true);
        }

        previousCountRef.current = incomingData.length;
        setMessages(incomingData);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve messages');
    } finally {
      if (!isPolling) {
        setIsLoading(false);
      }
    }
  }, [isUnlocked]);

  // Initial load once unlocked
  useEffect(() => {
    if (isUnlocked) {
      loadMessages(false);
    } else {
      setMessages([]);
    }
  }, [isUnlocked, loadMessages]);

  // Background polling (only active when unlocked)
  const { triggerImmediate } = useVisibilityPolling(
    () => loadMessages(true),
    siteConfig.pollIntervalMs,
    isUnlocked
  );

  const dismissNewBadge = useCallback(() => {
    setShowNewBadge(false);
    setNewResponsesCount(0);
  }, []);

  const getMessageById = useCallback(
    (id) => {
      if (!isUnlocked) return null;
      return messages.find((m) => m.id === id) || null;
    },
    [isUnlocked, messages]
  );

  const getAdjacent = useCallback(
    (currentId) => {
      if (!isUnlocked) return { previous: null, next: null, currentIndex: -1, total: 0 };
      return getAdjacentResponses(messages, currentId);
    },
    [isUnlocked, messages]
  );

  return {
    messages,
    isLoading,
    error,
    isLockedByServer,
    newResponsesCount,
    showNewBadge,
    lastRefreshed,
    dismissNewBadge,
    refreshMessages: triggerImmediate,
    getMessageById,
    getAdjacent,
  };
}
