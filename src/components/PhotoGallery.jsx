import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, AlertCircle } from 'lucide-react';
import { getFallbackImageSvg } from '../services/imageService';
import './PhotoGallery.css';

export default function PhotoGallery({ pictures = [], recipientName = '' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  if (!pictures || pictures.length === 0) {
    return null;
  }

  const handleImageError = (picId) => {
    setFailedImages((prev) => ({ ...prev, [picId]: true }));
  };

  const count = pictures.length;
  let layoutClass = 'layout-grid';
  if (count === 1) layoutClass = 'layout-single';
  else if (count === 2) layoutClass = 'layout-double';
  else if (count === 3) layoutClass = 'layout-triple';

  return (
    <div className="spider-photo-gallery-root">
      <div className={`gallery-panel-grid ${layoutClass}`}>
        {pictures.map((pic, idx) => {
          const isFailed = failedImages[pic.id];
          const src = isFailed ? getFallbackImageSvg() : pic.url;

          return (
            <motion.div
              key={pic.id || idx}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 0.8 : -0.8 }}
              className="gallery-comic-frame"
              onClick={() => !isFailed && setSelectedPhoto(pic)}
            >
              <div className="frame-image-container">
                <img
                  src={src}
                  alt={pic.alt || `Memory ${idx + 1} for ${recipientName}`}
                  onError={() => handleImageError(pic.id)}
                  loading="lazy"
                  className="frame-img"
                />
                
                {/* Halftone texture overlay */}
                <div className="frame-halftone-overlay" />

                {/* Comic Badge / Zoom Hint */}
                <div className="frame-zoom-badge">
                  <Maximize2 size={15} />
                  <span>PANEL #{idx + 1}</span>
                </div>
              </div>

              {isFailed && (
                <div className="frame-permission-warning">
                  <AlertCircle size={14} className="text-yellow" />
                  <span>Google Drive share permission needed</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Comic Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="comic-lightbox-backdrop"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="comic-lightbox-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
              >
                <X size={26} />
              </button>

              <div className="lightbox-img-wrapper">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.alt || 'Full preview'}
                  className="lightbox-full-img"
                />
              </div>

              <div className="lightbox-caption-bar">
                <span className="comic-badge-sfx cyan">MULTIVERSE CAPTURE</span>
                <span className="lightbox-caption-text">{selectedPhoto.alt}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
