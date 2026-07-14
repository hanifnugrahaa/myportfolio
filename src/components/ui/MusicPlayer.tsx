import React, { useState } from 'react';
import './MusicPlayer.css';

const MusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`music-player-container ${isOpen ? 'open' : ''}`}>
      <div className="music-player-panel">
        <iframe 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/artist/050h7Z8Fh4uVpU40U6a7xR?utm_source=generator&theme=0" 
          width="100%" 
          height="152" 
          frameBorder="0" 
          allowFullScreen={false} 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </div>
      <button 
        className="music-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Play Music (Perunggu - Gemilang)"
        aria-label="Toggle Music Player"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </button>
    </div>
  );
};

export default MusicPlayer;
