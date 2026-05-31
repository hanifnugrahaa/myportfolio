// src/App.jsx

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Impor komponen yang langsung terlihat
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import AnimatedSection from './components/ui/AnimatedSection';
import LoadingScreen from './components/ui/LoadingScreen';
import CustomCursor from './components/ui/CustomCursor';
import TerminalMode from './components/ui/TerminalMode';
import GiantTypography from './components/ui/GiantTypography';
import DataFlowWire from './components/ui/DataFlowWire';
import ThemeTransitionOverlay from './components/ui/ThemeTransitionOverlay';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ChatBot from './components/ui/ChatBot';
import { useSecretCode } from './hooks/useSecretCode';

// Lazy load komponen yang di bawah layar
const SkillsList = lazy(() => import('./components/sections/SkillsList'));
const ProjectSlider = lazy(() => import('./components/sections/ProjectSlider'));
const ActivitySlider = lazy(() => import('./components/sections/ActivitySlider'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/layout/Footer'));

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
  const [isTransitioningTheme, setIsTransitioningTheme] = useState(false);

  // Custom hook to trigger Terminal Mode on "hacker" typing
  const { success: isTerminalMode, setSuccess: setIsTerminalMode } = useSecretCode('hacker');

  const toggleTheme = () => {
    if (isTransitioningTheme) return; // Mencegah spam klik

    setIsTransitioningTheme(true);

    // Animasi Katana: Tunggu pisau menyapu layar (300ms)
    setTimeout(() => {
      setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));

      // Beri sedikit sekali waktu (30ms) agar DOM update sebelum pedang menyapu keluar
      setTimeout(() => {
        setIsTransitioningTheme(false);
      }, 30);
    }, 300); 
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
          <ThemeTransitionOverlay isActive={isTransitioningTheme} />
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

            <DataFlowWire />

            <ErrorBoundary>
              <Suspense fallback={<div className="loading-spinner"></div>}>
                <div className="content-wrapper w-full max-w-none px-0" id="skills">
                  <SkillsList />
                </div>

                {/* --- GIANT TYPOGRAPHY BREAK 1 --- */}
                <GiantTypography text="✦ ENGINEERING EXCELLENCE " speed={0.8} />

                <div className="content-wrapper w-full max-w-none px-0" id="projects">
                  <ProjectSlider />
                </div>

                {/* --- GIANT TYPOGRAPHY BREAK 2 --- */}
                <GiantTypography text="✦ CREATIVE VISIONARY " direction="right" speed={1.2} />

                <div className="content-wrapper w-full max-w-none px-0" id="activities">
                  <ActivitySlider />
                </div>
              </Suspense>
            </ErrorBoundary>
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
            <ErrorBoundary>
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
            </ErrorBoundary>
          </motion.div>

          <ChatBot />

          {/* === FLOATING TERMINAL BUTTON === */}
          <button 
            onClick={() => setIsTerminalMode(true)}
            className="floating-terminal-btn"
            title="Open System Terminal (or type 'hacker')"
            aria-label="Open System Terminal"
          >
            <span>&gt;_</span>
          </button>
        </>
      )}
    </>
  );
}

export default App;