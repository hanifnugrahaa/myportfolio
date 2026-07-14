import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { Project } from '../../data';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ProjectSlider.css';

const ProjectSlider: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projs: Project[] = [];
        querySnapshot.forEach((doc) => {
          projs.push(doc.data() as Project);
        });
        setProjectsList(projs);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  
  useEffect(() => {
    if (!loading && projectsList.length > 0) {
      // Force GSAP to recalculate all trigger positions after DOM has painted the cards
      setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [loading, projectsList]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Create a scroll trigger that translates the track horizontally
      const getScrollAmount = () => {
        const trackWidth = trackRef.current?.scrollWidth || 0;
        return -(trackWidth - window.innerWidth + window.innerWidth * 0.1); // Add some padding
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // Total distance = scroll amount / 0.7 (since scrolling takes 70% of timeline)
          end: () => `+=${Math.abs(getScrollAmount()) / 0.7}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculates on resize
        }
      });

      // 1. Lock/pause at the START (15% of scroll distance)
      tl.to({}, { duration: 0.15 });

      // 2. Horizontal scroll (70% of scroll distance)
      tl.to(trackRef.current, {
        x: getScrollAmount,
        ease: "none",
        duration: 0.7
      });

      // 3. Lock/pause at the END (15% of scroll distance)
      tl.to({}, { duration: 0.15 });

      return () => tl.kill();
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Disable GSAP horizontal scroll hijacking.
      // We need to apply standard CSS for normal horizontal scrolling.
      gsap.set(trackRef.current, { clearProps: "x" });
      if (containerRef.current) {
        containerRef.current.style.overflowX = 'auto';
        containerRef.current.style.overflowY = 'hidden';
      }
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [projectsList, loading] });

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
      
      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div 
            ref={trackRef} 
            className="gsap-project-track"
          >
          {projectsList.map((project, index) => (
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
        )}
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