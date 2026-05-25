// src/components/ActivityCard.tsx
import React from 'react';
import './ActivityCard.css';
import { Activity } from '../data';
import { motion } from 'framer-motion';

interface ActivityCardProps {
  activity: Activity;
  isActive: boolean;
  onClick?: () => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive, onClick, index }) => {
  const { name, imageUrl } = activity;

  return (
    <motion.div 
      className={`activity-card-container ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
      whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
      whileTap={isActive ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className="activity-card-image"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/images/fallback-activity.jpg';
        }}
      />
      <div className="activity-card-overlay" />
      
      <div className="activity-card-glass-panel">
        <h3 className="activity-card-title">{name}</h3>
      </div>

      {/* Neo-Tokyo Editorial Badge */}
      <div className="japan-badge">
        活動 — {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

export default ActivityCard;