import React from 'react';
import './WebOverlay.css';

export default function WebOverlay() {
  return (
    <div className="web-overlay-container" aria-hidden="true">
      {/* Top-Left Web Corner */}
      <svg className="web-corner web-tl" viewBox="0 0 250 250">
        <path d="M0 0 L250 0 M0 0 L0 250 M0 0 L250 250 M0 0 L180 250 M0 0 L250 180" stroke="rgba(0, 240, 255, 0.22)" strokeWidth="1.5" />
        <path d="M40 0 C40 22 22 40 0 40" stroke="rgba(229, 37, 33, 0.3)" strokeWidth="1.5" fill="none" />
        <path d="M90 0 C90 50 50 90 0 90" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" fill="none" />
        <path d="M150 0 C150 82 82 150 0 150" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" fill="none" />
        <path d="M220 0 C220 120 120 220 0 220" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Bottom-Right Web Corner */}
      <svg className="web-corner web-br" viewBox="0 0 250 250">
        <path d="M250 250 L0 250 M250 250 L250 0 M250 250 L0 0 M250 250 L70 0 M250 250 L0 70" stroke="rgba(229, 37, 33, 0.25)" strokeWidth="1.5" />
        <path d="M210 250 C210 228 228 210 250 210" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" fill="none" />
        <path d="M160 250 C160 200 200 160 250 160" stroke="rgba(229, 37, 33, 0.3)" strokeWidth="1.5" fill="none" />
        <path d="M100 250 C100 168 168 100 250 100" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" fill="none" />
        <path d="M30 250 C30 130 130 30 250 30" stroke="rgba(229, 37, 33, 0.2)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}
