import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiPython, SiCplusplus, SiPostgresql, SiLaravel, SiFastapi, SiNextdotjs } from 'react-icons/si';
import HankoStamp from '../ui/HankoStamp';
import './Hero.css';

const HERO_PHOTO = '/assets/images/hero-photo.png';

function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const solidTextRef = useRef<SVGGElement>(null);
  const outlineTextRef = useRef<SVGGElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);
  const techCardRef = useRef<HTMLDivElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  const typedName = useTypewriter(["Hanif Nugraha", "ハニフ ヌグラハ"], 120, 60, 3000);

  useGSAP(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const mm = gsap.matchMedia();

    // Condition 1: User prefers animations (no-preference)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Stage entrance (photo + both text layers move together)
      tl.fromTo(stageRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );

      tl.fromTo([glassCardRef.current, techCardRef.current, ctaCardRef.current],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        '-=0.5'
      );

      // Scroll parallax — text layers move at different speed than photo
      // Both text layers must move TOGETHER to stay aligned
      const textLayers = [solidTextRef.current, outlineTextRef.current];

      textLayers.forEach(el => {
        gsap.to(el, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });
      });

      gsap.to(photoRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      gsap.to([glassCardRef.current, techCardRef.current, ctaCardRef.current], {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });


    });

    // Condition 2: User prefers reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Simple fade-in without scaling or parallax
      gsap.fromTo([stageRef.current, glassCardRef.current, techCardRef.current, ctaCardRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1, stagger: 0.2 }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="hero-section">
      {/* Tategaki Watermark */}
      <div className="hero-tategaki">
        ソフトウェアエンジニア
      </div>

      {/* Accent Lines Removed */}

      {/* ── 3-LAYER INTERLEAVE STAGE ── */}
      <div ref={stageRef} className="hero-stage">

        {/* LAYER 1: SOLID text (behind photo) */}
        <svg className="hero-text-layer hero-text-solid hero-svg-container" overflow="visible">
          <g ref={solidTextRef}>
            <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="hero-3d-text">
              HANIF NUGRAHA
            </text>
          </g>
        </svg>

        {/* LAYER 2: Photo (middle) */}
        <div className="hero-photo-layer" ref={photoRef}>
          <img
            src={HERO_PHOTO}
            alt="Hanif Nugraha - Software Engineer Portrait"
            className="hero-photo-img"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* LAYER 3: OUTLINE text (in front of photo) */}
        <svg className="hero-text-layer hero-text-outline hero-svg-container" overflow="visible">
          <g ref={outlineTextRef}>
            <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="hero-3d-text hero-svg-outline-text">
              HANIF NUGRAHA
            </text>
          </g>
        </svg>

      </div>

      {/* LAYER 4: GLASS INFO CARD */}
      <div ref={glassCardRef} className="hero-glass-card">
        <h1 className="hero-glass-greeting">
          {t('hero.greeting')} <span className="hero-name-typewriter">{typedName}</span><span className="typewriter-cursor">|</span>
        </h1>
        <p className="hero-glass-role">{t('hero.role')}</p>
        <p className="hero-glass-desc">{t('hero.description')}</p>
        <a href="#projects" className="hero-glass-cta">
          {t('hero.cta')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
          </svg>
        </a>
      </div>

      {/* LAYER 5: TECH STACK CARD (Right Side) */}
      <div ref={techCardRef} className="hero-tech-card">
        <h3 className="tech-card-title">Core Stack</h3>
        <div className="hero-tech-stack">
          <span className="tech-badge"><FaReact size={15} color="#61DAFB" /> React</span>
          <span className="tech-badge"><SiNextdotjs size={15} color="var(--text-primary)" /> Next.js</span>
          <span className="tech-badge"><SiTypescript size={15} color="#3178C6" /> TypeScript</span>
          <span className="tech-badge"><SiTailwindcss size={15} color="#06B6D4" /> Tailwind CSS</span>
          <span className="tech-badge"><SiCplusplus size={15} color="#00599C" /> IoT / C++</span>
          <span className="tech-badge"><SiPython size={15} color="#3776AB" /> Python / CV</span>
          <span className="tech-badge"><SiFastapi size={15} color="#009688" /> FastAPI</span>
          <span className="tech-badge"><SiLaravel size={15} color="#FF2D20" /> Laravel</span>
          <span className="tech-badge"><SiPostgresql size={15} color="#4169E1" /> PostgreSQL</span>
        </div>
      </div>

      {/* LAYER 6: HIRE ME CTA CARD (Left Bottom) */}
      <div ref={ctaCardRef} className="hero-cta-card">
        <div className="hero-cta-content">
          <h4 className="hero-cta-title">Need a Reliable Engineer?</h4>
          <p className="hero-cta-desc">Delivering high-impact software for operations.</p>
        </div>
        <a href="#contact" className="hero-cta-btn">
          Hire Me
          <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
          </svg>
        </a>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" />
        </svg>
      </div>

      {/* Hanko Stamp Badge */}
      <HankoStamp />
    </section>
  );
}

export default Hero;