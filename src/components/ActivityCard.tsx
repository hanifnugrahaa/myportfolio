// src/components/ActivityCard.jsx
import React from 'react';
import './ActivityCard.css';
import { Activity } from '../data';

interface ActivityCardProps {
  activity: Activity;
  isActive: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive }) => {
  const { name, imageUrl } = activity;

  return (
    <div className={`activity-card-container ${isActive ? 'active' : ''}`}>
      <img 
        src={imageUrl} 
        alt={name} 
        className="activity-card-image"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/assets/images/fallback-activity.jpg';
        }}
      />
      <div className="activity-card-overlay" />
      
      <div className="activity-card-glass-panel">
        <h3 className="activity-card-title">{name}</h3>
      </div>
    </div>
  );
};

export default ActivityCard;