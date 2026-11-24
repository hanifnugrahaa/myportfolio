// src/components/ActivityCard.tsx
import React from 'react';
import './ActivityCard.css';
import type { Activity } from '../../data';
import { getPortfolioMedia } from '../../lib/portfolioMedia';
import { motion } from 'framer-motion';
import { useCyberAudio } from '../../hooks/useCyberAudio';

interface ActivityCardProps {
  activity: Activity;
  isActive: boolean;
  onClick?: () => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive, onClick, index }) => {
  const name = activity.name;
  const cover = getPortfolioMedia(activity)[0];
  const { playHover, playClick } = useCyberAudio();

  const dragState = React.useRef({ x: 0, y: 0, isDragging: false });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { x: e.clientX, y: e.clientY, isDragging: false };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragState.current.x) > 10 || Math.abs(e.clientY - dragState.current.y) > 10) {
      dragState.current.isDragging = true;
    }
  };

  const handlePointerUp = () => {
    if (!dragState.current.isDragging) {
      playClick();
      onClick?.();
    }
  };

  return (
    <motion.div 
      className={`activity-card-container ${isActive ? 'active' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="button"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={playHover}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Sombong Background Watermark */}
      <div className="arrogant-watermark">
        {index % 2 === 0 ? '[ TOP TIER ]' : '[ ELITE ]'}
      </div>
      {cover?.type === 'video' ? (
        <video src={cover.url} className="activity-card-image" autoPlay={isActive} loop muted playsInline />
      ) : (
        <img src={cover?.url} alt={name} className="activity-card-image" loading={isActive ? 'eager' : 'lazy'} decoding="async" />
      )}
      <div className="activity-card-overlay" />
      
      {/* Editorial Magazine Typography */}
      <div className="magazine-content">
        <h3 className="magazine-title" data-text={name}>{name}</h3>
      </div>

      {/* Neo-Tokyo Editorial Badge */}
      <div className="japan-badge">
        活動 — {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
