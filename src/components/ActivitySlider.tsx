// src/components/ActivitySlider.jsx
import React, { useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ActivityCard from './ActivityCard';
import { myActivities } from '../data';
import './ActivitySlider.css';

const ActivitySlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter activities yang memiliki imageUrl
  const activitiesWithImages = myActivities.filter(activity => activity.imageUrl);

  return (
    <div className="activity-carousel-section">
      <div className="activity-section-header">
        <h2 className="section-title">My Activities</h2>
      </div>
      
      <div className="activity-carousel-container">
        <button className="activity-nav-btn activity-swiper-button-prev" aria-label="Previous activity">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        
        <div className="activity-swiper-container">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.activity-swiper-button-next',
              prevEl: '.activity-swiper-button-prev',
            }}
            pagination={{ clickable: true, el: '.activity-custom-pagination' }}
            spaceBetween={0}
            slidesPerView="auto"
            centeredSlides={true}
            loop={true}
            speed={600}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              320: { slidesPerView: "auto", spaceBetween: 0 },
              640: { slidesPerView: "auto", spaceBetween: 0 },
              768: { slidesPerView: "auto", spaceBetween: 0 },
              1024: { slidesPerView: "auto", spaceBetween: 0 },
            }}
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