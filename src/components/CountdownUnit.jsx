import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './CountdownUnit.css';

export default function CountdownUnit({ value, label, accent = 'cyan' }) {
  const displayVal = String(value).padStart(2, '0');

  return (
    <div className={`countdown-unit-card unit-${accent}`}>
      <div className="countdown-unit-inner">
        <div className="countdown-unit-halftone" />
        <div className="countdown-number-wrapper">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayVal}
              initial={{ y: -25, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 25, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="countdown-number text-glitch"
            >
              {displayVal}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="countdown-label-strip">
          <span className="countdown-label">{label}</span>
        </div>
      </div>
      <div className="countdown-accent-line" />
    </div>
  );
}
