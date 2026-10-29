import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../sections/HeroSection';
import CountdownSection from '../sections/CountdownSection';
import MessageGallerySection from '../sections/MessageGallerySection';
import FinaleSection from '../sections/FinaleSection';
import { siteConfig } from '../config/siteConfig';

export default function HomePage({
  revealState,
  messagesState,
}) {
  const navigate = useNavigate();
  const { countdown, isUnlocked, birthdayDate, timeZone } = revealState;
  const {
    messages,
    isLoading,
    error,
    refreshMessages,
    showNewBadge,
    newResponsesCount,
    dismissNewBadge,
    lastRefreshed,
  } = messagesState;

  const scrollToCountdown = () => {
    const el = document.getElementById('countdown-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUnlockClick = () => {
    // When countdown is zero, navigate to gallery
    navigate('/gallery');
  };

  return (
    <div className="spider-home-page">
      {/* Hero Section */}
      <HeroSection onEnterUniverse={scrollToCountdown} />

      {/* Countdown Section with Moving Reveal Button */}
      <CountdownSection
        countdown={countdown}
        isUnlocked={isUnlocked}
        birthdayDate={birthdayDate}
        timeZone={timeZone}
        onUnlockClick={handleUnlockClick}
      />

      {/* Only display Gallery when birthday is unlocked */}
      {isUnlocked && (
        <MessageGallerySection
          messages={messages}
          isLoading={isLoading}
          error={error}
          onRefresh={refreshMessages}
          showNewBadge={showNewBadge}
          newResponsesCount={newResponsesCount}
          onDismissNewBadge={dismissNewBadge}
          lastRefreshed={lastRefreshed}
        />
      )}

      {/* Finale Section */}
      <FinaleSection />
    </div>
  );
}
