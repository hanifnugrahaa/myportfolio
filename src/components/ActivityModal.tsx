// src/components/ActivityModal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './ActivityModal.css';
import { Activity } from '../data';

interface ActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}

const parseActivityName = (nameString?: string) => {
  if (!nameString) return { title: '', description: '' };
  const parts = nameString.split('|');
  return {
    title: parts[0]?.trim(),
    description: parts.slice(1).join(' ').trim()
  };
};

const ActivityModal: React.FC<ActivityModalProps> = ({ activity, isOpen, onClose, onExitComplete }) => {
  
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

  if (typeof document === 'undefined') return null;

  const { title, description } = parseActivityName(activity?.name);

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && activity && (
        <motion.div
          key="activity-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="activity-modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            key="activity-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 200, duration: 0.6 }}
            className="activity-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="activity-modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={24} aria-hidden="true" />
            </button>

            {/* FULL BLEED BACKGROUND IMAGE */}
            <motion.div 
              className="activity-modal-bg-wrapper"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }} /* Parallax slow effect */
            >
              <img src={activity.imageUrl} alt={title} className="activity-modal-bg-image" />
            </motion.div>

            {/* DARK GRADIENT OVERLAY */}
            <div className="activity-modal-overlay"></div>

            {/* HEROIC CONTENT */}
            <div className="activity-modal-content">
              <motion.div 
                className="activity-modal-text-wrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="activity-modal-label">ACTIVITY HIGHLIGHT</div>
                <h2 className="activity-modal-hero-title">{title}</h2>
                
                {description && (
                  <motion.div 
                    className="activity-modal-divider"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "anticipate" }}
                  />
                )}
                
                {description && (
                  <motion.p 
                    className="activity-modal-description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    {description}
                  </motion.p>
                )}
              </motion.div>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ActivityModal;
