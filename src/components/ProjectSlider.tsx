// src/components/ProjectSlider.jsx
import React, { useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { projects, Project } from '../data';
import './ProjectSlider.css';

const ProjectSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  // useCallback(() => {}, [])

  return (
    <div className="curved-carousel-section">
      <div className="section-header">
        <h2 className="section-title">Featured Projects</h2>
      </div>
      
      <div className="carousel-container">
        {/* Tombol navigasi kini langsung di-bind ke class Swiper tanpa useRef manual */}
        <button className="carousel-nav-btn swiper-button-prev-custom" aria-label="Previous project">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        
        <div className="curved-swiper-container">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ clickable: true, el: '.custom-pagination' }}
            spaceBetween={0}
            slidesPerView="auto"
            centeredSlides={true}
            loop={true}
            speed={600} // Kembalikan ke 600 agar animasinya lebih smooth
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              // Semua spaceBetween dijadikan 0
              320: { slidesPerView: "auto", spaceBetween: 0 }, 
              640: { slidesPerView: "auto", spaceBetween: 0 },
              768: { slidesPerView: "auto", spaceBetween: 0 },
              1024: { slidesPerView: "auto", spaceBetween: 0 },
            }}
            className="curved-swiper"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={index} className="curved-slide">
                <ProjectCard 
                  project={project} 
                  isActive={index === activeIndex}
                  onClick={() => handleCardClick(project)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <button className="carousel-nav-btn swiper-button-next-custom" aria-label="Next project">
          <ChevronRight size={24} aria-hidden="true" />
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