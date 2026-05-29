// src/components/DocumentModal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import './DocumentModal.css';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, pdfUrl, title }) => {
  // Kunci scroll halaman saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="doc-modal-overlay">
          <motion.div 
            className="doc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="doc-modal-content"
            initial={{ y: '100vh', opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100vh', opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="doc-modal-header">
              <h3 className="doc-modal-title">{title}</h3>
              <div className="doc-modal-actions">
                <a 
                  href={pdfUrl} 
                  download 
                  className="doc-modal-btn download-btn"
                  title="Download Document"
                >
                  <Download size={20} />
                </a>
                <button onClick={onClose} className="doc-modal-btn close-btn">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="doc-modal-body">
              <iframe 
                src={`${pdfUrl}#view=FitH`} 
                className="doc-iframe"
                title={title}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default DocumentModal;
