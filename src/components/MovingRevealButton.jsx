import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lock, ArrowRight, Zap } from 'lucide-react';
import './MovingRevealButton.css';

const PLAYFUL_PHRASES = [
  "TOO SLOW!",
  "NOT YET!",
  "THE UNIVERSE ISN'T READY!",
  "NICE TRY, WEB-SLINGER!",
  "CAN'T CATCH ME!",
  "DIMENSION LOCKED!",
  "ALMOST... BUT NOPE!",
  "PATIENCE, HERO!",
];

export default function MovingRevealButton({
  isUnlocked,
  onUnlockClick,
  className = '',
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [attemptCount, setAttemptCount] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const speechTimeoutRef = useRef(null);
  const arenaRef = useRef(null);
  const buttonRef = useRef(null);

  // If unlocked, immediately reset position to center and clear any playful speech
  useEffect(() => {
    if (isUnlocked) {
      setPosition({ x: 0, y: 0 });
      setShowSpeechBubble(false);
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    }
  }, [isUnlocked]);

  // Clean up speech bubble timer on unmount
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Calculates a safe random offset within the designated movement arena
   */
  const dodgeButton = useCallback(() => {
    if (isUnlocked) return;

    const arena = arenaRef.current;
    const button = buttonRef.current;
    if (!arena || !button) return;

    const arenaRect = arena.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Available freedom margins
    const maxDeltaX = Math.max(20, (arenaRect.width - buttonRect.width) / 2 - 15);
    const maxDeltaY = Math.max(15, (arenaRect.height - buttonRect.height) / 2 - 15);

    // Generate random coordinate within bounds
    // Avoid small moves so the jump is obvious and playful
    let newX = (Math.random() * 2 - 1) * maxDeltaX;
    let newY = (Math.random() * 2 - 1) * maxDeltaY;

    // Minimum jump distance from current offset
    if (Math.abs(newX - position.x) < 40) {
      newX = newX >= 0 ? Math.min(maxDeltaX, newX + 50) : Math.max(-maxDeltaX, newX - 50);
    }

    setPosition({ x: Math.round(newX), y: Math.round(newY) });
    setAttemptCount((prev) => prev + 1);

    // Pick playful phrase
    const randomPhrase = PLAYFUL_PHRASES[Math.floor(Math.random() * PLAYFUL_PHRASES.length)];
    setCurrentPhrase(randomPhrase);
    setShowSpeechBubble(true);

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 2200);
  }, [isUnlocked, position.x]);

  const handleAction = (e) => {
    if (isUnlocked) {
      // Countdown finished: navigate to messages
      if (onUnlockClick) {
        onUnlockClick(e);
      }
      return;
    }

    // Still locked: prevent navigation and dodge!
    e.preventDefault();
    e.stopPropagation();
    dodgeButton();
  };

  return (
    <div className={`moving-button-arena ${className}`} ref={arenaRef}>
      {/* Speech Bubble Feedback */}
      <AnimatePresence>
        {!isUnlocked && showSpeechBubble && currentPhrase && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="moving-speech-callout"
            style={{
              transform: `translate(${position.x}px, ${position.y - 58}px)`,
            }}
          >
            <span className="comic-badge-sfx cyan">{currentPhrase}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Interactive Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleAction}
        onTouchEnd={!isUnlocked ? handleAction : undefined}
        onMouseEnter={!isUnlocked && attemptCount > 2 ? dodgeButton : undefined}
        animate={
          isUnlocked
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: position.x,
                y: position.y,
                rotate: position.x > 0 ? 1.5 : -1.5,
              }
        }
        transition={{
          type: 'spring',
          damping: 18,
          stiffness: 280,
          mass: 0.8,
        }}
        whileHover={isUnlocked ? { scale: 1.05 } : {}}
        whileTap={isUnlocked ? { scale: 0.96 } : {}}
        className={`moving-reveal-btn ${isUnlocked ? 'btn-unlocked anim-glow-pulse' : 'btn-locked'}`}
        aria-label={isUnlocked ? 'Unlock the birthday messages' : 'You want to see the message, tap me'}
      >
        <span className="btn-dots-pattern" />

        <div className="btn-inner-content">
          {isUnlocked ? (
            <>
              <Sparkles className="btn-icon text-yellow" size={24} />
              <span className="btn-label-text">UNLOCK THE MESSAGES</span>
              <ArrowRight className="btn-icon" size={24} />
            </>
          ) : (
            <>
              <Lock className="btn-icon text-cyan" size={20} />
              <span className="btn-label-text">YOU WANT TO SEE THE MESSAGE, TAP ME</span>
              <Zap className="btn-icon text-red" size={20} />
            </>
          )}
        </div>

        {/* Counter of attempts while locked */}
        {!isUnlocked && attemptCount > 0 && (
          <span className="attempts-pill">
            TRY #{attemptCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
