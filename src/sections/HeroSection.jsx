import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';
import ComicButton from '../components/ComicButton';
import { siteConfig } from '../config/siteConfig';
import './HeroSection.css';

export default function HeroSection({ onEnterUniverse }) {
  return (
    <section className="spider-hero-root">
      <div className="spider-container hero-container">
        {/* Top Badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-top-badges"
        >
          <span className="comic-badge-sfx cyan">EARTH-1610 MULTIVERSE</span>
          <span className="comic-badge-sfx red">CLASSIFIED BIRTHDAY EVENT</span>
        </motion.div>

        {/* Cinematic Kinetic Titles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hero-title-group"
        >
          <div className="hero-subline font-body">ANOTHER YEAR. ANOTHER UNIVERSE.</div>
          <h1 className="comic-title hero-main-title">
            INTO {siteConfig.birthdayName ? `${siteConfig.birthdayName}'S` : 'YOUR'}{' '}
            <span className="hero-gradient-text">BIRTHDAY-VERSE</span>
          </h1>
          <div className="hero-tagline">
            ONE PERSON. INFINITE POSSIBILITIES. YOUR NEXT CHAPTER IS ABOUT TO BEGIN.
          </div>
        </motion.div>

        {/* Enter Universe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="hero-cta-wrapper"
        >
          <ComicButton
            variant="cyan"
            size="lg"
            onClick={onEnterUniverse}
            icon={<Sparkles size={22} />}
          >
            ENTER THE UNIVERSE <ArrowDown size={22} />
          </ComicButton>
        </motion.div>
      </div>

      <div className="hero-diagonal-divider" />
    </section>
  );
}
