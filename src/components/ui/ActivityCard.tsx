// src/components/ActivityCard.tsx
import React from 'react';
import './ActivityCard.css';
import { Activity } from '../../data';
import { motion } from 'framer-motion';
import { useCyberAudio } from '../../hooks/useCyberAudio';

interface ActivityCardProps {
  activity: Activity;
  isActive: boolean;
  onClick?: () => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive, onClick, index }) => {
  const { name, imageUrl } = activity;
  const { playHover, playClick } = useCyberAudio();

  return (
    <motion.div 
      className={`activity-card-container ${isActive ? 'active' : ''}`}
      onClick={() => { playClick(); onClick?.(); }}
      onMouseEnter={playHover}
      whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
      whileTap={isActive ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Sombong Background Watermark */}
      <div className="arrogant-watermark">
        {index % 2 === 0 ? '[ TOP TIER ]' : '[ ELITE ]'}
      </div>
      <img 
        src={imageUrl} 
        alt={name} 
        className="activity-card-image"
        loading={isActive ? 'eager' : 'lazy'}
        decoding="async"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/images/fallback-activity.jpg';
        }}
      />
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