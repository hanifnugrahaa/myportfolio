import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import ActivityCard from '../ui/ActivityCard';
import ActivityModal from '../ui/ActivityModal';
import { myActivities, Activity } from '../../data';
import './ActivitySlider.css';

const ActivitySlider: React.FC = () => {
  const { t } = useTranslation();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter activities yang memiliki imageUrl
  const activitiesWithImages = myActivities.filter(activity => activity.imageUrl);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    
    // Create a scroll trigger that translates the track horizontally
    const getScrollAmount = () => {
      const trackWidth = trackRef.current?.scrollWidth || 0;
      return -(trackWidth - window.innerWidth + window.innerWidth * 0.1); 
    };

    const tween = gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, 
      }
    });

    return () => tween.kill();
  }, { scope: containerRef });

  const handleCardClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleExitComplete = () => setSelectedActivity(null);

  return (
    <div ref={containerRef} className="gsap-activity-section pt-24 pb-16 md:pt-32 md:pb-32 flex flex-col">
      {/* Tategaki Background Text */}
      <div className="gsap-tategaki-bg-activity">
        活動
      </div>

      <div className="w-full z-10 px-8 pb-4 text-center md:text-left md:pl-[5vw] shrink-0">
        <h2 className="text-4xl font-bold mb-2">{t('activities.title')}</h2>
        <p className="text-muted-foreground font-mono text-sm">[ HORIZONTAL_SCROLL_ENABLED ]</p>
      </div>
      
      <div className="flex-1 w-full relative">
        <div 
          ref={trackRef} 
          className="gsap-activity-track"
        >
          {activitiesWithImages.map((activity, index) => (
            <div key={index} className="gsap-activity-card-wrapper">
              <ActivityCard 
                activity={activity} 
                isActive={true}
                onClick={() => handleCardClick(activity)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onExitComplete={handleExitComplete}
      />
    </div>
  );
};

export default ActivitySlider;