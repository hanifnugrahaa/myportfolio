// src/components/ActivityCard.tsx
import React from 'react';
import './ActivityCard.css';
import { Activity } from '../data';
import { motion } from 'framer-motion';

interface ActivityCardProps {
  activity: Activity;
  isActive: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive }) => {
  const { name, imageUrl } = activity;

  return (
    <motion.div 
      className={`activity-card-container ${isActive ? 'active' : ''}`}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
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
    </motion.div>
  );
};

export default ActivityCard;