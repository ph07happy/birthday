import React from 'react';
import { motion } from 'motion/react';
import './ComicButton.css';

export default function ComicButton({
  children,
  onClick,
  variant = 'cyan', // 'cyan' | 'red' | 'yellow' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  type = 'button',
  icon = null,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.04, rotate: -1 } : {}}
      whileTap={!disabled ? { scale: 0.96, rotate: 1 } : {}}
      className={`comic-btn comic-btn-${variant} comic-btn-${size} ${className}`}
      {...props}
    >
      <span className="comic-btn-halftone" />
      <span className="comic-btn-content">
        {icon && <span className="comic-btn-icon">{icon}</span>}
        {children}
      </span>
      <span className="comic-btn-glitch-border" />
    </motion.button>
  );
}
