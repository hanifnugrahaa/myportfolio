// src/components/ProjectCard.jsx
import React from 'react';
import './ProjectCard.css';
import { Project } from '../data';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive, onClick }) => {
  const isVideo = project.imageUrl?.endsWith('.mp4');

  return (
    <div 
      className={`card-container ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
    >
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

      {/* Panel Liquid Glass di bagian bawah */}
      <div className="glass-panel">
        <h2 className="project-title">{project.name}</h2>
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
    </div>
  );
};

export default React.memo(ProjectCard);