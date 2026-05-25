// src/App.jsx

import React, { useState, useEffect, Suspense, lazy } from 'react';

// Impor komponen yang langsung terlihat
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import AnimatedSection from './components/AnimatedSection';

// Lazy load komponen yang di bawah layar
const SkillsList = lazy(() => import('./components/SkillsList'));
const ProjectSlider = lazy(() => import('./components/ProjectSlider'));
const ActivitySlider = lazy(() => import('./components/ActivitySlider'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const body = document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Header toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <div className="content-wrapper">
          <AnimatedSection id="about">
            <About />
          </AnimatedSection>
          
          <Suspense fallback={<div className="loading-spinner"></div>}>
            <AnimatedSection id="skills">
              <SkillsList />
            </AnimatedSection>
            <AnimatedSection id="projects">
              <ProjectSlider />
            </AnimatedSection>
            <AnimatedSection id="activities">
              <ActivitySlider />
            </AnimatedSection>
            <AnimatedSection id="contact">
              <Contact />
            </AnimatedSection>
          </Suspense>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;