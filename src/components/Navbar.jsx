import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Lock, RefreshCw, Flame } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import './Navbar.css';

// Procedural audio synthesizer using Web Audio API (100% royalty-free & zero external audio files)
let audioCtx = null;
function playWebSwingChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {
    // Audio context not allowed or unsupported
  }
}

export default function Navbar({ isUnlocked, onRefresh, newResponsesCount = 0 }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const location = useLocation();

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playWebSwingChime();
    }
  };

  return (
    <header className="spider-navbar-root">
      <div className="spider-container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo-icon">🕷️</span>
          <span className="navbar-brand-title text-glitch">
            {siteConfig.siteTitle.toUpperCase()}
          </span>
        </Link>

        {/* Center / Status */}
        <div className="navbar-status-badge">
          {isUnlocked ? (
            <span className="status-pill unlocked anim-badge-wiggle">
              <Sparkles size={14} className="text-yellow" /> UNIVERSE UNLOCKED
            </span>
          ) : (
            <span className="status-pill locked">
              <Lock size={13} /> COUNTDOWN ACTIVE
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Refresh Action for live updates */}
          {isUnlocked && onRefresh && (
            <button
              type="button"
              onClick={() => {
                onRefresh();
                if (soundEnabled) playWebSwingChime();
              }}
              className="navbar-icon-btn"
              title="Check for new responses"
            >
              <RefreshCw size={17} />
              {newResponsesCount > 0 && (
                <span className="navbar-notify-count">+{newResponsesCount}</span>
              )}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`navbar-icon-btn ${soundEnabled ? 'active' : ''}`}
            title={soundEnabled ? 'Mute comic sound FX' : 'Enable comic sound FX'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Navigation Links */}
          <nav className="navbar-nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              COUNTDOWN
            </Link>

            {isUnlocked ? (
              <Link
                to="/gallery"
                className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}
              >
                MEMORIES
              </Link>
            ) : (
              <span className="nav-link disabled" title="Unlocks when countdown finishes">
                <Lock size={12} /> MEMORIES
              </span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
