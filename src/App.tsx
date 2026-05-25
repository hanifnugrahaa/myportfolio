// src/App.jsx

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Impor komponen yang langsung terlihat
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import AnimatedSection from './components/AnimatedSection';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import TerminalMode from './components/TerminalMode';
import GiantTypography from './components/GiantTypography';
import { useSecretCode } from './hooks/useSecretCode';

// Lazy load komponen yang di bawah layar
const SkillsList = lazy(() => import('./components/SkillsList'));
const ProjectSlider = lazy(() => import('./components/ProjectSlider'));
const ActivitySlider = lazy(() => import('./components/ActivitySlider'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Cek localStorage terlebih dahulu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    
    // Fallback ke preferensi sistem jika ada
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    
    return 'light';
  });
  const [isBooting, setIsBooting] = useState(true);

  // Custom hook to trigger Terminal Mode on "hacker" typing
  const { success: isTerminalMode, setSuccess: setIsTerminalMode } = useSecretCode('hacker');

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
    // Simpan ke localStorage setiap kali tema berubah
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      {isTerminalMode && <TerminalMode onClose={() => setIsTerminalMode(false)} />}
      
      {!isTerminalMode && (
        <>
          <CustomCursor />
          {isBooting && <LoadingScreen onComplete={() => setIsBooting(false)} />}
          
          <Header toggleTheme={toggleTheme} theme={theme} />
          
          <main className="main-content-layer">
            <section id="home">
              <Hero />
            </section>
            <div className="content-wrapper">
              <AnimatedSection id="about">
                <About />
              </AnimatedSection>
            </div>
            
            <Suspense fallback={<div className="loading-spinner"></div>}>
              <div className="content-wrapper">
                <AnimatedSection id="skills">
                  <SkillsList />
                </AnimatedSection>
              </div>

              {/* --- GIANT TYPOGRAPHY BREAK 1 --- */}
              <GiantTypography text="✦ ENGINEERING EXCELLENCE " speed={0.8} />

              <div className="content-wrapper">
                <AnimatedSection id="projects">
                  <ProjectSlider />
                </AnimatedSection>
              </div>

              {/* --- GIANT TYPOGRAPHY BREAK 2 --- */}
              <GiantTypography text="✦ CREATIVE VISIONARY " direction="right" speed={1.2} />

              <div className="content-wrapper">
                <AnimatedSection id="activities">
                  <ActivitySlider />
                </AnimatedSection>
              </div>
            </Suspense>
          </main>

          {/* --- FOOTER REVEAL LAYER (3D MOTION) --- */}
          <motion.div 
            className="footer-reveal-layer"
            initial={{ opacity: 0, y: 150, rotateX: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{ transformOrigin: "top center", perspective: 1000 }}
          >
            <Suspense fallback={<div className="loading-spinner"></div>}>
              <div className="content-wrapper">
                <AnimatedSection id="contact">
                  <Contact />
                </AnimatedSection>
              </div>
            </Suspense>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </motion.div>
        </>
      )}
    </>
  );
}

export default App;