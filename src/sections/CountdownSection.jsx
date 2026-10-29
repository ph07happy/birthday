import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import CountdownUnit from '../components/CountdownUnit';
import MovingRevealButton from '../components/MovingRevealButton';
import { formatComicDate } from '../utils/dateUtils';
import './CountdownSection.css';

export default function CountdownSection({
  countdown,
  isUnlocked,
  birthdayDate,
  timeZone,
  onUnlockClick,
}) {
  const { days, hours, minutes, seconds } = countdown;
  const confettiTriggeredRef = useRef(false);

  // Trigger celebration burst when unlocked
  useEffect(() => {
    if (isUnlocked && !confettiTriggeredRef.current) {
      confettiTriggeredRef.current = true;
      try {
        // Spider-Verse vibrant confetti explosion
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#E52521', '#00F0FF', '#FFE600', '#FF007F', '#FFFFFF'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 70,
            origin: { x: 0 },
            colors: ['#00F0FF', '#FFE600', '#FFFFFF'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 70,
            origin: { x: 1 },
            colors: ['#E52521', '#FF007F', '#FFFFFF'],
          });
        }, 350);
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [isUnlocked]);

  const targetFormatted = formatComicDate(birthdayDate, timeZone);

  return (
    <section className="spider-countdown-section" id="countdown-anchor">
      <div className="spider-container countdown-container">
        {/* Section Heading */}
        <motion.div
          key={isUnlocked ? 'unlocked-header' : 'locked-header'}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="countdown-header-group"
        >
          {isUnlocked ? (
            <>
              <div className="countdown-kicker kicker-celebration">
                <span className="comic-badge-sfx yellow">EVENT ACTIVATED</span>
              </div>
              <h2 className="comic-title text-glitch celebration-heading">
                THE WAIT IS OVER. YOUR UNIVERSE IS HERE.
              </h2>
              <p className="countdown-subtitle">
                The dimensional rift has opened. All birthday transmissions are now live!
              </p>
            </>
          ) : (
            <>
              <div className="countdown-kicker">
                <span className="comic-tag">TARGET DATE: {targetFormatted}</span>
              </div>
              <h2 className="comic-title countdown-heading">
                THE COUNTDOWN TO YOUR NEXT CHAPTER
              </h2>
              <p className="countdown-subtitle">
                Every second brings us closer to a day worth celebrating.
              </p>
            </>
          )}
        </motion.div>

        {/* 4 Comic Countdown Units (Never hidden, stays at 0-0-0-0) */}
        <div className="countdown-grid">
          <CountdownUnit value={days} label="DAYS" accent="cyan" />
          <CountdownUnit value={hours} label="HOURS" accent="red" />
          <CountdownUnit value={minutes} label="MINUTES" accent="yellow" />
          <CountdownUnit value={seconds} label="SECONDS" accent="pink" />
        </div>

        {/* The Playful Moving Button Arena */}
        <div className="countdown-button-container">
          <MovingRevealButton
            isUnlocked={isUnlocked}
            onUnlockClick={onUnlockClick}
          />
        </div>
      </div>
    </section>
  );
}
