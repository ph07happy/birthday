import React from 'react';
import './ComicBackground.css';

export default function ComicBackground({ children }) {
  return (
    <div className="comic-bg-root">
      {/* Halftone Ben-Day pattern */}
      <div className="comic-bg-halftone" />

      {/* Spider-Verse Ambient Glow Orbs */}
      <div className="comic-bg-orb orb-red" />
      <div className="comic-bg-orb orb-cyan" />
      <div className="comic-bg-orb orb-pink" />

      {/* Speed lines */}
      <div className="comic-bg-speedlines" />

      {/* Scanline CRT overlay */}
      <div className="comic-bg-scanlines" />

      {/* Content wrapper */}
      <div className="comic-bg-content">{children}</div>
    </div>
  );
}
