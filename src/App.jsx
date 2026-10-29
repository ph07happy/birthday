import React from 'react';
import { HashRouter } from 'react-router-dom';
import ComicBackground from './animations/ComicBackground';
import WebOverlay from './animations/WebOverlay';
import ParticleField from './animations/ParticleField';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import { AudioProvider } from './context/AudioContext';
import { useBirthdayReveal } from './hooks/useBirthdayReveal';
import { useBirthdayMessages } from './hooks/useBirthdayMessages';
import './styles/global.css';

export default function App() {
  const revealState = useBirthdayReveal();
  const messagesState = useBirthdayMessages(revealState.isUnlocked);

  return (
    <HashRouter>
      <AudioProvider>
        <div className="spider-app-wrapper">
          <ComicBackground>
            <WebOverlay />
            <ParticleField />
            <Navbar
              isUnlocked={revealState.isUnlocked}
              onRefresh={messagesState.refreshMessages}
              newResponsesCount={messagesState.newResponsesCount}
            />
            <main className="spider-main-content">
              <AppRouter
                revealState={revealState}
                messagesState={messagesState}
              />
            </main>
          </ComicBackground>
        </div>
      </AudioProvider>
    </HashRouter>
  );
}
