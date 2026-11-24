// src/components/DocumentModal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer } from 'lucide-react';
import type { PublicCv } from '../../lib/cvFirestore';
import { renderCvHtml } from '../../lib/cvAuthoring';
import './DocumentModal.css';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv?: PublicCv;
  title: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, cv, title }) => {
  const frame = useRef<HTMLIFrameElement>(null);
  // Kunci scroll halaman saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !cv) return null;

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
                {'url' in cv ? <a
                  href={cv.url}
                  download 
                  target="_blank"
                  rel="noreferrer"
                  className="doc-modal-btn download-btn"
                  title="Download Document"
                  aria-label="Buka atau unduh PDF"
                >
                  <Download size={20} />
                </a> : (
                  <button type="button" className="doc-modal-btn" aria-label="Cetak atau simpan PDF"
                    onClick={() => frame.current?.contentWindow?.print()}>
                    <Printer size={20} aria-hidden="true" />
                  </button>
                )}
                <button onClick={onClose} className="doc-modal-btn close-btn" aria-label="Tutup PDF">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="doc-modal-body">
              <iframe 
                ref={frame}
                src={'url' in cv ? `${cv.url.split('#')[0]}#view=FitH` : undefined}
                srcDoc={'draft' in cv ? renderCvHtml(cv.draft, cv.language) : undefined}
                sandbox={'draft' in cv ? 'allow-same-origin allow-modals' : undefined}
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
