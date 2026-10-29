import React from 'react';
import { motion } from 'motion/react';
import './ComicPanel.css';

export default function ComicPanel({
  children,
  className = '',
  accent = 'cyan', // 'cyan' | 'red' | 'yellow' | 'none'
  cutCorner = false,
  tag = null,
  ...props
}) {
  return (
    <motion.div
      className={`comic-panel-container comic-panel-accent-${accent} ${cutCorner ? 'comic-cut' : ''} ${className}`}
      {...props}
    >
      <div className="comic-panel-halftone" />
      {tag && <div className={`comic-panel-tag tag-${accent}`}>{tag}</div>}
      <div className="comic-panel-body">{children}</div>
    </motion.div>
  );
}
