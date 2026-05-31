// src/components/ProjectModal.tsx
import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import './ProjectModal.css';
import { Project } from '../../data';

const parseMetrics = (metricsString?: string) => {
  if (!metricsString) return [];
  return metricsString.split('|').map(m => {
    const parts = m.split('•');
    return { value: parts[0]?.trim(), label: parts.slice(1).join(' ').trim() };
  });
};

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeUpVariant: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onExitComplete }) => {
  
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const metrics = useMemo(() => parseMetrics(project?.metrics), [project?.metrics]);
  const isVideo = project?.imageUrl?.endsWith('.mp4');

  // Prevent rendering on server side if Next.js was used, but for Vite it's fine.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
          className="modal-container"
          onClick={onClose}
          style={{ willChange: 'transform, opacity' }}
          data-lenis-prevent
        >
          <motion.div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Mencegah klik bocor ke backdrop
          >
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} aria-hidden="true" />
            </button>

            <div className="modal-grid-layout">
              {/* --- KIRI: HERO (GAMBAR/VIDEO) --- */}
              <div className="modal-left-pane">
                {isVideo ? (
                  <video className="modal-media" autoPlay loop muted playsInline>
                    <source src={project.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={project.imageUrl} alt={project.name} className="modal-media" />
                )}
              </div>
              
              {/* --- KANAN: DETAIL PROYEK (CYBERPUNK DOSSIER) --- */}
              <motion.div 
                className="modal-right-pane editorial-grid"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {/* Dossier Metadata */}
                <motion.div variants={fadeUpVariant} className="dossier-meta">
                  <span>FILE_ID: {project.name.substring(0,3).toUpperCase()}-XX</span>
                  <span>//</span>
                  <span>SEC_LEVEL: ALPHA</span>
                  <span>//</span>
                  <span className="blinking-status">DECRYPTED</span>
                </motion.div>

                <motion.h2 variants={fadeUpVariant} className="modal-title cyberpunk-type-modal">
                  {project.name}
                </motion.h2>
                
                <motion.div variants={fadeUpVariant} className="modal-section-spacing border-section">
                  <div className="section-title-bracket">[ SYSTEM_OVERVIEW ]</div>
                  <p className="modal-description">{project.description}</p>
                </motion.div>

                {metrics.length > 0 && (
                  <motion.div variants={fadeUpVariant} className="modal-section-spacing border-section">
                    <div className="section-title-bracket">[ IMPACT_METRICS ]</div>
                    <div className="metrics-bento-grid">
                      {metrics.map((metric, idx) => (
                        <div key={idx} className="metric-bento-box">
                          <div className={`metric-bento-value ${(metric.value && metric.value.length > 6) ? 'long-value' : ''}`}>
                            {metric.value}
                          </div>
                          <div className="metric-bento-label">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {project.techStack && (
                  <motion.div variants={fadeUpVariant} className="modal-section-spacing border-section">
                    <div className="section-title-bracket">[ CORE_TECHNOLOGIES ]</div>
                    <div className="tech-stack-flex">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="tech-pill">{tech}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div variants={fadeUpVariant} className="modal-action-footer">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                    >
                      <ExternalLink size={18} aria-hidden="true" /> View Project
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;