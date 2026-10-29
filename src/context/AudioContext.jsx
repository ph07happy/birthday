import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '../config/siteConfig';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolumeState] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Compute clean audio source URL supporting subpaths (e.g. /birthday/ on GitHub Pages)
  const getAudioSource = useCallback(() => {
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}audio/sunflower.mp3`;
  }, []);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.src = getAudioSource();
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'auto';

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', (e) => {
      console.warn('[SpiderAudio] Audio playback warning:', e);
      setIsPlaying(false);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [getAudioSource]);

  // Play music with user interaction safety
  const playMusic = useCallback(() => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = isMuted ? 0 : volume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('[SpiderAudio] Autoplay blocked, waiting for next user gesture:', err);
          setIsPlaying(false);
        });
    }
  }, [isMuted, volume]);

  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, pauseMusic, playMusic]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audio) {
      audio.muted = nextMuted;
    }
  }, [isMuted]);

  const setVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const value = {
    isPlaying,
    hasInteracted,
    volume,
    isMuted,
    playMusic,
    pauseMusic,
    togglePlay,
    toggleMute,
    setVolume,
    trackInfo: {
      title: "Sunflower",
      artist: "Post Malone & Swae Lee",
      movie: "Spider-Man: Into the Spider-Verse",
    },
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useBackgroundMusic() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useBackgroundMusic must be used within an AudioProvider');
  }
  return context;
}
