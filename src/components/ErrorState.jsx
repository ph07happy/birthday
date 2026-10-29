import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import ComicButton from './ComicButton';
import './ErrorState.css';

export default function ErrorState({
  title = 'MULTIVERSE ANOMALY DETECTED',
  message = 'We encountered an error connecting to the response dimension.',
  onRetry,
}) {
  return (
    <div className="error-state-container">
      <div className="error-comic-box">
        <div className="error-icon-circle">
          <AlertTriangle size={36} className="text-yellow" />
        </div>
        <h3 className="error-heading text-glitch">{title}</h3>
        <p className="error-description">{message}</p>

        {onRetry && (
          <ComicButton
            variant="cyan"
            size="md"
            onClick={onRetry}
            icon={<RefreshCw size={18} />}
          >
            RE-ESTABLISH CONNECTION
          </ComicButton>
        )}
      </div>
    </div>
  );
}
