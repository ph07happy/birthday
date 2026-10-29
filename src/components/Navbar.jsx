import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Lock, RefreshCw, Music } from 'lucide-react';
import { useBackgroundMusic } from '../context/AudioContext';
import { siteConfig } from '../config/siteConfig';
import './Navbar.css';

export default function Navbar({ isUnlocked, onRefresh, newResponsesCount = 0 }) {
  const { isPlaying, togglePlay, trackInfo } = useBackgroundMusic();
  const location = useLocation();

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
          {/* Background Music Player: Sunflower */}
          <button
            type="button"
            onClick={togglePlay}
            className={`navbar-music-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? `Pause ${trackInfo.title}` : `Play ${trackInfo.title} (${trackInfo.artist})`}
            aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          >
            {isPlaying ? (
              <>
                <div className="music-equalizer" aria-hidden="true">
                  <span className="eq-bar bar-1" />
                  <span className="eq-bar bar-2" />
                  <span className="eq-bar bar-3" />
                </div>
                <span className="music-title-pill">SUNFLOWER</span>
                <Volume2 size={16} className="music-status-icon" />
              </>
            ) : (
              <>
                <Music size={15} />
                <span className="music-title-pill">SUNFLOWER</span>
                <VolumeX size={15} className="music-status-icon muted" />
              </>
            )}
          </button>

          {/* Refresh Action for live updates */}
          {isUnlocked && onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="navbar-icon-btn"
              title="Check for new responses"
            >
              <RefreshCw size={17} />
              {newResponsesCount > 0 && (
                <span className="navbar-notify-count">+{newResponsesCount}</span>
              )}
            </button>
          )}

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
