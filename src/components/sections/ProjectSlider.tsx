// src/components/ProjectSlider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards, Autoplay, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { projects, Project } from '../../data';
import { getSwiperLoopSettings } from '../../lib/swiperConfig';
import './ProjectSlider.css';

const ProjectSlider = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const swiperLoop = getSwiperLoopSettings(projects.length);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gunakan useCallback untuk menjaga reference fungsi tetap stabil
  const handleCardClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Membersihkan state project HANYA setelah animasi Framer Motion selesai
  const handleExitComplete = useCallback(() => {
    setSelectedProject(null);
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
      className="curved-carousel-section relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Neo-Tokyo Tategaki Watermark */}
      <div className="slider-tategaki">
        プロジェクト
      </div>

      <div className="section-header">
        <h2 className="text-4xl font-bold mb-8 text-center">{t('projects.title')}</h2>
      </div>
      
      <div className="carousel-container">
        {/* Tombol navigasi kini langsung di-bind ke class Swiper tanpa useRef manual */}
        <button className="carousel-nav-btn swiper-button-prev-custom" aria-label="Previous project">
          <ChevronLeft size={24} aria-hidden="true" />
          <span className="nav-key-hint">A</span>
        </button>
        
        <div className="curved-swiper-container">
          <Swiper
            onSwiper={setSwiperInstance}
            modules={[Navigation, Pagination, EffectCards, Autoplay, Mousewheel]}
            effect={isMobile ? "slide" : "cards"}
            grabCursor={true}
            touchStartPreventDefault={false}
            passiveListeners={true}
            mousewheel={{
              releaseOnEdges: true,
              sensitivity: 1,
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            cardsEffect={{
              perSlideOffset: 14,
              perSlideRotate: 3,
              slideShadows: false, // Disable default shadows for cleaner look
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true
            }}
            pagination={{ clickable: true, el: '.custom-pagination' }}
            centeredSlides={true}
            loop={swiperLoop.loop}
            rewind={swiperLoop.rewind}
            speed={800} // Cinematic smooth easing
            resistanceRatio={0.7} // Premium drag tension
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="curved-swiper"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index} className="curved-slide">
                <ProjectCard 
                  project={project} 
                  isActive={index === activeIndex}
                  onClick={() => handleCardClick(project)}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <button className="carousel-nav-btn swiper-button-next-custom" aria-label="Next project">
          <ChevronRight size={24} aria-hidden="true" />
          <span className="nav-key-hint">D</span>
        </button>
      </div>
      
      <div className="custom-pagination" />
      
      <div className="progress-indicator">
        <span className="current">{activeIndex + 1}</span>
        <span className="separator">/</span>
        <span className="total">{projects.length}</span>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onExitComplete={handleExitComplete}
      />
    </div>
  );
};

export default ProjectSlider;