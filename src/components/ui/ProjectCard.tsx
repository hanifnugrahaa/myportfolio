// src/components/ProjectCard.jsx
import React from 'react';
import './ProjectCard.css';
import { Project } from '../../data';
import { useCyberAudio } from '../../hooks/useCyberAudio';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive, onClick, index }) => {
  const { playHover, playClick } = useCyberAudio();
  const isVideo = project.imageUrl?.endsWith('.mp4');

  return (
    <motion.div 
      className={`card-container ${isActive ? 'active' : ''}`}
      onClick={() => { playClick(); onClick(); }}
      onMouseEnter={playHover}
      whileHover={{ y: -5 }}
    >
      {/* Neon Edge Glow (Scanline) */}
      <div className="neon-edge-glow"></div>
      
      {/* HUD Micro-Interactions (Corners) */}
      <div className="hud-corners top-left"></div>
      <div className="hud-corners top-right"></div>
      <div className="hud-corners bottom-left"></div>
      <div className="hud-corners bottom-right"></div>

      {/* Gambar / Video Background Proyek */}
      {isVideo ? (
        <video 
          className="project-image"
          autoPlay={isActive}
          loop 
          muted 
          playsInline
        >
          <source src={project.imageUrl} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={project.imageUrl} 
          alt={project.name}
          className="project-image"
          loading="lazy"
        />
      )}
      
      {/* Overlay gradien agar teks lebih terbaca */}
      <div className="image-overlay"></div>

      {/* Neo-Tokyo Editorial Badge */}
      <div className="japan-badge">
        作品 — {String(index + 1).padStart(2, '0')}
      </div>

      {/* Floating Liquid Glass HUD */}
      <div className="glass-panel floating-hud">
        {/* Micro-Interaction: System Header */}
        <div className="hud-header">
          <span className="hud-sys-text">SYS_ID: {project.name.substring(0,3).toUpperCase()}-{String(index + 1).padStart(2, '0')}</span>
          <span className="hud-blinking-dot"></span>
        </div>

        <h2 className="project-title cyberpunk-type">{project.name}</h2>
        <p className="project-desc">{project.description}</p>
        
        {/* Tech Stack Pills */}
        <div className="tech-stack">
          {project.techStack?.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="tech-pill">{tech}</span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="tech-pill">+{project.techStack.length - 3}</span>
          )}
        </div>

        {/* Tombol CTA */}
        <button className="cta-button" aria-label="View project details">
          View Details
          <svg className="cta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectCard);