import React from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ message = 'WARPING MULTIVERSE DATA...' }) {
  return (
    <div className="spider-loading-container">
      <div className="loading-glitch-box">
        <div className="spider-spinner" />
        <h2 className="loading-title text-glitch">{message}</h2>
        <div className="loading-sub-bar">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
