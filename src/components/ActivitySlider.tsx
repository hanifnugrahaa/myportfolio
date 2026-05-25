// src/components/ActivitySlider.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ActivityCard from './ActivityCard';
import { myActivities } from '../data';
import './ActivitySlider.css';

const ActivitySlider = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter activities yang memiliki imageUrl
  const activitiesWithImages = myActivities.filter(activity => activity.imageUrl);

  return (
    <div className="activity-carousel-section">
      <div className="activity-section-header">
        <h2 className="section-title">{t('activities.title')}</h2>
      </div>
      
      <div className="activity-carousel-container">
        <button className="activity-nav-btn activity-swiper-button-prev" aria-label="Previous activity">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        
        <div className="activity-swiper-container">
          <Swiper
            modules={[Navigation, Pagination, EffectCards]}
            effect="cards"
            grabCursor={true}
            navigation={{
              nextEl: '.activity-swiper-button-next',
              prevEl: '.activity-swiper-button-prev',
            }}
            cardsEffect={{
              perSlideOffset: 15,
              perSlideRotate: 2,
            }}
            pagination={{ clickable: true, el: '.activity-custom-pagination' }}
            centeredSlides={true}
            loop={true}
            speed={600}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}

            className="activity-swiper"
          >
            {activitiesWithImages.map((activity, index) => (
              <SwiperSlide key={index} className="activity-slide">
                <ActivityCard 
                  activity={activity} 
                  isActive={index === activeIndex}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <button className="activity-nav-btn activity-swiper-button-next" aria-label="Next activity">
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
      
      <div className="activity-custom-pagination" />
      
      <div className="activity-progress-indicator">
        <span className="activity-current">{activeIndex + 1}</span>
        <span className="activity-separator">/</span>
        <span className="activity-total">{activitiesWithImages.length}</span>
      </div>
    </div>
  );
};

export default ActivitySlider;