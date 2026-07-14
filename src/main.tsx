import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Force browser to ALWAYS start at the top on refresh
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  ScrollTrigger.clearScrollMemory('manual');
}

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 0.9, smoothWheel: true }}>
        <App />
      </ReactLenis>
    </BrowserRouter>
  </StrictMode>,
)
