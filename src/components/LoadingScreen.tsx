// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState("INITIALIZING AGENT PROTOCOL...");
  const [isExiting, setIsExiting] = useState(false);

  const bootSequences = [
    "DEFY THE LIMITS",
    "LOADING MAP ASSETS...",
    "ESTABLISHING CONNECTION...",
    "SYNCHRONIZING...",
    "READY."
  ];

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        // Increment progress rapidly
        const next = prev + Math.floor(Math.random() * 10) + 1;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 120);

    // Boot text sequencer
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < bootSequences.length) {
        setBootText(bootSequences[textIndex]);
        textIndex++;
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        // Trigger the diagonal split animation
        setIsExiting(true);
        setTimeout(() => {
          // Tell App.tsx to unmount after animation completes
          document.body.style.overflow = 'unset';
          onComplete();
        }, 1000); // Wait for the split animation to fully clear the screen
      }, 500); // Hold at 100% briefly
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <React.Fragment key="loading-screen-fragments">
          {/* Diagonal Background Top-Left */}
          <motion.div 
            className="val-loading-bg val-loading-bg-top-left"
            exit={{ x: '-100vw', y: '-100vh' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          
          {/* Diagonal Background Bottom-Right */}
          <motion.div 
            className="val-loading-bg val-loading-bg-bottom-right"
            exit={{ x: '100vw', y: '100vh' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Inner Content (Fades out first before split fully reveals) */}
          <motion.div 
            className="val-inner-content"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Decorative Background Elements */}
            <div className="val-bg-logo">HN</div>
            
            <div className="val-content-wrapper">
              <div className="val-tagline">
                <span className="val-red-text">//</span> {bootText}
              </div>

              <div className="val-progress-container">
                <div className="val-progress-number">
                  {progress.toString().padStart(3, '0')}
                </div>
                <div className="val-progress-bar-bg">
                  <motion.div 
                    className="val-progress-bar-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Corner Decals */}
            <div className="val-corner-decals">
              <div className="val-decal top-left"></div>
              <div className="val-decal bottom-right"></div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
