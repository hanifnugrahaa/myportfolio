// src/components/ActivitySlider.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, EffectCards, Autoplay, Mousewheel } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ActivityCard from '../ui/ActivityCard';
import ActivityModal from '../ui/ActivityModal';
import { myActivities, Activity } from '../../data';
import './ActivitySlider.css';

const ActivitySlider = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Modal State
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter activities yang memiliki imageUrl
  const activitiesWithImages = myActivities.filter(activity => activity.imageUrl);

  const handleCardClick = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    setSelectedActivity(null);
  }, []);

  // Keyboard Navigation (A/D) hanya aktif saat kursor di atas slider ini
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered || !swiperInstance) return;
      if (e.key === 'a' || e.key === 'A') swiperInstance.slidePrev();
      if (e.key === 'd' || e.key === 'D') swiperInstance.slideNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, swiperInstance]);

  return (
    <div 
      className="activity-carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Neo-Tokyo Tategaki Watermark */}
      <div className="slider-tategaki">
        活動
      </div>

      <div className="activity-section-header">
        <h2 className="text-4xl font-bold mb-8 text-center">{t('activities.title')}</h2>
      </div>
      
      <div className="activity-carousel-container">
        <button className="activity-nav-btn activity-swiper-button-prev" aria-label="Previous activity">
          <ChevronLeft size={24} aria-hidden="true" />
          <span className="nav-key-hint">A</span>
        </button>
        
        <div className="activity-swiper-container">
          <SwiperReact
            onSwiper={setSwiperInstance}
            modules={[Navigation, Pagination, EffectCards, Autoplay, Mousewheel]}
            effect="cards"
            grabCursor={true}
            mousewheel={{
              releaseOnEdges: true,
              sensitivity: 1,
            }}
            navigation={{
              nextEl: '.activity-swiper-button-next',
              prevEl: '.activity-swiper-button-prev',
            }}
            cardsEffect={{
              perSlideOffset: 14,
              perSlideRotate: 3,
              slideShadows: false,
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: true,
              pauseOnMouseEnter: true
            }}
            pagination={{ clickable: true, el: '.activity-custom-pagination' }}
            centeredSlides={true}
            loop={true}
            speed={800}
            resistanceRatio={0.7}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="activity-swiper"
          >
            {activitiesWithImages.map((activity, index) => (
              <SwiperSlide key={index} className="activity-slide">
                <ActivityCard 
                  activity={activity} 
                  isActive={index === activeIndex}
                  onClick={() => handleCardClick(activity)}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </SwiperReact>
        </div>
        
        <button className="activity-nav-btn activity-swiper-button-next" aria-label="Next activity">
          <ChevronRight size={24} aria-hidden="true" />
          <span className="nav-key-hint">D</span>
        </button>
      </div>
      
      <div className="activity-custom-pagination" />
      
      <div className="activity-progress-indicator">
        <span className="activity-current">{activeIndex + 1}</span>
        <span className="activity-separator">/</span>
        <span className="activity-total">{activitiesWithImages.length}</span>
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