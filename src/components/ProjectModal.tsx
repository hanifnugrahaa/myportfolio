// src/components/ProjectModal.jsx
import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Zap, Code } from 'lucide-react';
import './ProjectModal.css';

const getTechIcon = (tech: string) => {
  const techIcons: Record<string, string> = {
    'React': '⚛️', 'Next.js': '▲', 'Node.js': '⬢', 'TypeScript': 'TS',
    'Python': '🐍', 'Java': '☕', 'Docker': '🐳', 'PostgreSQL': '🐘',
    'Firebase': '🔥', 'Arduino': '⚡', 'IoT': '📡', 'WebSockets': '🔌',
    'FastAPI': '🚀', 'Tailwind': '🎨', 'Framer Motion': '✨',
  };
  return techIcons[tech] || '💻';
};

const parseMetrics = (metricsString?: string) => {
  if (!metricsString) return [];
  return metricsString.split('|').map(m => {
    const parts = m.split('•');
    return { value: parts[0]?.trim(), label: parts.slice(1).join(' ').trim() };
  });
};

import { Project } from '../data';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onExitComplete }) => {
  
useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const metrics = useMemo(() => parseMetrics(project?.metrics), [project?.metrics]);
  const isVideo = project?.imageUrl?.endsWith('.mp4');

  return (
    // onExitComplete akan berjalan setelah animasi exit selesai
    <AnimatePresence onExitComplete={onExitComplete}>
      {}
      {isOpen && project && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="modal-backdrop"
          onClick={onClose}
          style={{ willChange: 'opacity' }}
        />
      )}

      {isOpen && project && (
        <motion.div
          key="modal-container"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.5 }}
          className="modal-container"
          onClick={onClose}
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Mencegah klik bocor ke backdrop
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} aria-hidden="true" />
            </button>

            {/* --- KONTEN HERO (GAMBAR/VIDEO) --- */}
            <div className="modal-hero">
              {isVideo ? (
                <video className="modal-video" autoPlay loop muted playsInline>
                  <source src={project.imageUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={project.imageUrl} alt={project.name} className="modal-image" />
              )}
            </div>
            
            {/* --- KONTEN DETAIL PROYEK --- */}
            <div className="modal-details">
              <h2 className="modal-title">{project.name}</h2>
              
              <div className="section-title">
                Overview
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {project.description}
              </p>

              {/* Tampilkan Metrics jika ada */}
              {metrics.length > 0 && (
                <>
                  <div className="section-title">
                    <Zap size={18} aria-hidden="true" style={{ color: 'var(--accent-color)' }} /> Impact Metrics
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '1.5rem' }}>
                    {metrics.map((metric, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metric.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tampilkan Tech Stack */}
              {project.techStack && (
                <>
                  <div className="section-title">
                     <Code size={18} aria-hidden="true" style={{ color: 'var(--accent-color)' }} /> Tech Stack
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} style={{ background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/*getTechIcon(tech)*/} {tech}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* --- KONTEN FOOTER (TOMBOL) --- */}
            <div className="modal-footer">
              <button 
                className="btn" 
                style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px' }} 
                onClick={onClose}
              >
                Close
              </button>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn"
                  style={{ background: 'var(--accent-color)', color: 'var(--bg-primary)', border: '1px solid var(--accent-color)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ExternalLink size={18} aria-hidden="true" /> View Full Project
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;