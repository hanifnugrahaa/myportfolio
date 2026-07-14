import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './CVGateModal.css';

interface CVGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  docTitle: string;
}

const CVGateModal: React.FC<CVGateModalProps> = ({ isOpen, onClose, onProceed, docTitle }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return; // Mencegah submit kosong
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'cv_logs'), {
        document: docTitle,
        message: message.trim(),
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });
    } catch (err) {
      console.error("Failed to log CV access", err);
    } finally {
      setIsSubmitting(false);
      setMessage('');
      onProceed();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="cv-gate-wrapper">
          <motion.div
            key="cv-gate-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cv-gate-backdrop"
            onClick={onClose}
          />
          <motion.div
            key="cv-gate-content"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="cv-gate-container"
          >
            <div className="cv-gate-header">
              <span className="blinking-dot"></span>
              <span className="sys-text">ACCESS_CONTROL_NODE</span>
            </div>
            
            <h3 className="cv-gate-title">DECRYPTING {docTitle.toUpperCase()}</h3>
            <p className="cv-gate-desc">
              Silakan tinggalkan pesan atau sebutkan dari perusahaan mana Anda berasal untuk mengakses <strong>{docTitle}</strong> ini.
            </p>

            <form onSubmit={handleSubmit} className="cv-gate-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Halo Hanif, saya HR dari..."
                className="cv-gate-input"
                autoFocus
                disabled={isSubmitting}
                required
              />
              
              <div className="cv-gate-actions">
                <button type="submit" disabled={isSubmitting || !message.trim()} className="cv-gate-btn primary">
                  {isSubmitting ? 'Membuka...' : 'Akses Dokumen'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CVGateModal;
