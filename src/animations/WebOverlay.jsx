import React from 'react';
import './WebOverlay.css';

export default function WebOverlay() {
  return (
    <div className="web-overlay-container" aria-hidden="true">
      {/* Top-Left Web Corner (Crisp luminous white & neon cyan) */}
      <svg className="web-corner web-tl" viewBox="0 0 300 300">
        {/* Radial Spokes */}
        <line x1="0" y1="0" x2="300" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="0" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="300" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="0" y1="0" x2="220" y2="300" stroke="#00F0FF" strokeWidth="2" />
        <line x1="0" y1="0" x2="300" y2="220" stroke="#00F0FF" strokeWidth="2" />
        <line x1="0" y1="0" x2="130" y2="300" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        <line x1="0" y1="0" x2="300" y2="130" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        <line x1="0" y1="0" x2="60" y2="300" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="300" y2="60" stroke="rgba(0, 240, 255, 0.8)" strokeWidth="1.5" />
        
        {/* Concentric Connecting Spiral Arcs (Pure light colors with glowing finish) */}
        <path d="M45 0 C45 25 25 45 0 45" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
        <path d="M95 0 C95 52 52 95 0 95" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M150 0 C150 82 82 150 0 150" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        <path d="M210 0 C210 115 115 210 0 210" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M275 0 C275 152 152 275 0 275" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Small spider hanging thread */}
        <line x1="160" y1="160" x2="195" y2="215" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="3 2" />
        <circle cx="195" cy="217" r="4.5" fill="#00F0FF" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>

      {/* Top-Right Web Corner */}
      <svg className="web-corner web-tr" viewBox="0 0 300 300">
        <line x1="300" y1="0" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="0" x2="300" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="0" x2="0" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="0" x2="80" y2="300" stroke="#00F0FF" strokeWidth="2" />
        <line x1="300" y1="0" x2="0" y2="220" stroke="#00F0FF" strokeWidth="2" />
        <line x1="300" y1="0" x2="170" y2="300" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        <line x1="300" y1="0" x2="0" y2="130" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        
        <path d="M255 0 C255 25 275 45 300 45" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
        <path d="M205 0 C205 52 248 95 300 95" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M150 0 C150 82 218 150 300 150" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        <path d="M90 0 C90 115 185 210 300 210" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M25 0 C25 152 148 275 300 275" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      </svg>

      {/* Bottom-Left Web Corner */}
      <svg className="web-corner web-bl" viewBox="0 0 280 280">
        <line x1="0" y1="280" x2="280" y2="280" stroke="#FFFFFF" strokeWidth="2.2" />
        <line x1="0" y1="280" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2.2" />
        <line x1="0" y1="280" x2="280" y2="0" stroke="#FFFFFF" strokeWidth="2.2" />
        <line x1="0" y1="280" x2="210" y2="0" stroke="#00F0FF" strokeWidth="1.8" />
        <line x1="0" y1="280" x2="280" y2="90" stroke="#00F0FF" strokeWidth="1.8" />
        
        <path d="M0 235 C25 235 45 255 45 280" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        <path d="M0 185 C52 185 95 228 95 280" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M0 130 C82 130 150 198 150 280" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
        <path d="M0 70 C115 70 210 165 210 280" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
      </svg>

      {/* Bottom-Right Web Corner */}
      <svg className="web-corner web-br" viewBox="0 0 300 300">
        <line x1="300" y1="300" x2="0" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="300" x2="300" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="300" x2="0" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="300" y1="300" x2="70" y2="0" stroke="#00F0FF" strokeWidth="2" />
        <line x1="300" y1="300" x2="0" y2="70" stroke="#00F0FF" strokeWidth="2" />
        <line x1="300" y1="300" x2="160" y2="0" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        <line x1="300" y1="300" x2="0" y2="160" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.8" />
        
        <path d="M255 300 C255 275 275 255 300 255" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
        <path d="M205 300 C205 248 248 205 300 205" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M150 300 C150 218 218 150 300 150" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        <path d="M90 300 C90 185 185 90 300 90" stroke="#00F0FF" strokeWidth="2.2" fill="none" />
        <path d="M25 300 C25 148 148 25 300 25" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      </svg>
    </div>
  );
}
