import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import MessageGallerySection from '../sections/MessageGallerySection';
import ComicButton from '../components/ComicButton';
import FinaleSection from '../sections/FinaleSection';
import './MemoriesPage.css';

export default function MemoriesPage({
  revealState,
  messagesState,
}) {
  const { isUnlocked } = revealState;
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

  if (!isUnlocked) {
    return (
      <div className="spider-container memories-locked-container">
        <div className="locked-comic-card">
          <div className="locked-badge-wrap">
            <span className="comic-badge-sfx red">ACCESS DENIED</span>
          </div>
          <div className="locked-icon-shield">
            <Lock size={44} className="text-red" />
          </div>
          <h2 className="comic-title locked-heading">
            MULTIVERSE MEMORIES LOCKED
          </h2>
          <p className="locked-description">
            Birthday messages and photographs are sealed inside the dimensional vault until the countdown reaches zero!
          </p>
          <Link to="/">
            <ComicButton variant="cyan" size="md" icon={<ArrowLeft size={18} />}>
              RETURN TO COUNTDOWN
            </ComicButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="spider-memories-page">
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
      <FinaleSection />
    </div>
  );
}
