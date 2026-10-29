import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import ComicButton from '../components/ComicButton';
import { siteConfig } from '../config/siteConfig';
import './IntroPage.css';

export default function IntroPage({ onEnter }) {
  const navigate = useNavigate();

  const handleEnter = () => {
    if (onEnter) onEnter();
    navigate('/');
  };

  return (
    <div className="spider-intro-page-root">
      {/* Cinematic Comic Panels */}
      <div className="spider-container intro-container">
        {/* Multiverse Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="intro-badge-wrapper"
        >
          <span className="comic-badge-sfx cyan">CLASSIFIED MULTIVERSE PORTAL</span>
        </motion.div>

        {/* Kinetic Staggered Comic Phrases */}
        <div className="intro-comic-frames">
          <motion.div
            initial={{ opacity: 0, x: -50, skewX: -4 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="intro-comic-strip strip-1"
          >
            <span className="strip-text">ANOTHER YEAR. ANOTHER UNIVERSE.</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, skewX: 4 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="intro-comic-strip strip-2"
          >
            <span className="strip-text">ONE PERSON. INFINITE POSSIBILITIES.</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="intro-comic-strip strip-3"
          >
            <span className="strip-text text-glitch">
              YOUR NEXT CHAPTER IS ABOUT TO BEGIN.
            </span>
          </motion.div>
        </div>

        {/* Recipient Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="intro-hero-heading"
        >
          <h1 className="comic-title intro-title">
            HAPPY BIRTHDAY{' '}
            <span className="intro-name-highlight">
              {siteConfig.birthdayName ? siteConfig.birthdayName.toUpperCase() : 'HERO'}
            </span>
          </h1>
          <p className="intro-tagline font-body">
            Dimensional transmissions have been gathered across the multiverse. Step through the rift to begin.
          </p>
        </motion.div>

        {/* Prominent Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.15 }}
          className="intro-cta-box"
        >
          <ComicButton
            variant="cyan"
            size="lg"
            onClick={handleEnter}
            icon={<Sparkles size={24} />}
          >
            ENTER THE UNIVERSE <ArrowRight size={24} />
          </ComicButton>
        </motion.div>
      </div>
    </div>
  );
}
