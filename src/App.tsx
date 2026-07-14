// src/App.jsx

import { useState, Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
import { useAppTheme } from './hooks/useAppTheme';

import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Lazy load komponen yang di bawah layar
const SkillsList = lazy(() => import('./components/sections/SkillsList'));
const ProjectSlider = lazy(() => import('./components/sections/ProjectSlider'));
const ActivitySlider = lazy(() => import('./components/sections/ActivitySlider'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/layout/Footer'));

function Portfolio() {
  const { theme, isTransitioningTheme, toggleTheme } = useAppTheme();
  const [isBooting, setIsBooting] = useState(true);

  // Custom hook to trigger Terminal Mode on "hacker" typing
  const { success: isTerminalMode, setSuccess: setIsTerminalMode } = useSecretCode('hacker');

  // Ultimate fix for GSAP teleporting bug: observe height changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    const main = document.querySelector('.main-content-layer');
    if (main) resizeObserver.observe(main);
    
    // Also refresh periodically just in case images are very slow
    const interval = setInterval(() => {
      ScrollTrigger.refresh();
    }, 1500);
    
    return () => {
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

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
                <div className="w-full px-6 md:px-12 lg:px-24" id="skills">
                  <SkillsList />
                </div>

                {/* --- GIANT TYPOGRAPHY BREAK 1 --- */}
                <GiantTypography text="✦ ENGINEERING EXCELLENCE " speed={0.8} />

                <div className="w-full px-6 md:px-12 lg:px-24" id="projects">
                  <ProjectSlider />
                </div>

                {/* --- GIANT TYPOGRAPHY BREAK 2 --- */}
                <GiantTypography text="✦ CREATIVE VISIONARY " direction="right" speed={1.2} />

                <div className="w-full px-6 md:px-12 lg:px-24" id="activities">
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;