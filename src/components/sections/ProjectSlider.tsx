import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { projects, Project } from '../../data';
import './ProjectSlider.css';

const ProjectSlider: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    
    // Create a scroll trigger that translates the track horizontally
    const getScrollAmount = () => {
      const trackWidth = trackRef.current?.scrollWidth || 0;
      return -(trackWidth - window.innerWidth + window.innerWidth * 0.1); // Add some padding
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
        invalidateOnRefresh: true, // Recalculates on resize
      }
    });

    return () => tween.kill();
  }, { scope: containerRef });

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleExitComplete = () => setSelectedProject(null);

  return (
    <div ref={containerRef} className="gsap-project-section pt-24 pb-16 md:pt-32 md:pb-32 flex flex-col">
      {/* Tategaki Background Text */}
      <div className="gsap-tategaki-bg">
        プロジェクト
      </div>

      {/* Relative Title (No longer absolute to avoid overlapping) */}
      <div className="w-full z-10 px-8 pb-4 text-center md:text-left md:pl-[5vw] shrink-0">
        <h2 className="text-4xl font-bold mb-2">{t('projects.title')}</h2>
        <p className="text-muted-foreground font-mono text-sm">[ HORIZONTAL_SCROLL_ENABLED ]</p>
      </div>
      
      {/* Track wrapper takes remaining height */}
      <div className="flex-1 w-full relative">
        <div 
          ref={trackRef} 
          className="gsap-project-track"
        >
        {projects.map((project, index) => (
          <div key={index} className="gsap-project-card-wrapper">
            <ProjectCard 
              project={project} 
              isActive={true}
              onClick={() => handleCardClick(project)}
              index={index}
            />
          </div>
        ))}
        </div>
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