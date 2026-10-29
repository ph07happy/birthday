import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import ComicButton from '../components/ComicButton';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="spider-container not-found-page-root">
      <div className="not-found-card">
        <span className="comic-badge-sfx pink">DIMENSIONAL RIFT 404</span>
        <h1 className="comic-title not-found-glitch-title text-glitch">
          LOST IN THE MULTIVERSE
        </h1>
        <p className="not-found-sub">
          The coordinates you entered collapsed into another dimension. Let's get you back on the right web-line!
        </p>

        <Link to="/">
          <ComicButton variant="cyan" size="lg" icon={<Home size={20} />}>
            RETURN TO HOMEPAGE
          </ComicButton>
        </Link>
      </div>
    </div>
  );
}
