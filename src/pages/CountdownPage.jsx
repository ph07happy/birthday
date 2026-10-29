import React from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownSection from '../sections/CountdownSection';
import FinaleSection from '../sections/FinaleSection';

export default function CountdownPage({ revealState }) {
  const navigate = useNavigate();
  const { countdown, isUnlocked, birthdayDate, timeZone } = revealState;

  const handleUnlockClick = () => {
    navigate('/gallery');
  };

  return (
    <div className="spider-countdown-page">
      <CountdownSection
        countdown={countdown}
        isUnlocked={isUnlocked}
        birthdayDate={birthdayDate}
        timeZone={timeZone}
        onUnlockClick={handleUnlockClick}
      />
      <FinaleSection />
    </div>
  );
}
