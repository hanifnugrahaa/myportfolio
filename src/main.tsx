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

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 0.9, smoothWheel: true }}>
      <App />
    </ReactLenis>
  </StrictMode>,
)
