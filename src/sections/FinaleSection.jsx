import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import './FinaleSection.css';

export default function FinaleSection() {
  return (
    <footer className="spider-finale-root">
      <div className="spider-container finale-container">
        {/* Comic sound effect badges */}
        <div className="finale-sfx-cluster">
          <span className="comic-badge-sfx cyan">THWIP!</span>
          <span className="comic-badge-sfx red">BOOM!</span>
          <span className="comic-badge-sfx yellow">POW!</span>
        </div>

        <div className="finale-quote-box">
          <p className="finale-quote text-glitch">
            "{siteConfig.themeQuote}"
          </p>
          <div className="finale-subtext">
            Crafted with <Heart size={14} className="heart-icon" /> for {siteConfig.birthdayName}. Happy Birthday from your entire universe!
          </div>
        </div>

        <div className="finale-credits-strip">
          <span>CLASSIFIED MULTIVERSE PORTAL // SPIDER-VERSE BIRTHDAY INITIATIVE</span>
          <span>STATION ID: 1610-BDAY</span>
        </div>
      </div>
    </footer>
  );
}
