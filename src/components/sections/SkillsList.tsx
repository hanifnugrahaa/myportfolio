import React, { useRef } from 'react';
import { skillCategories } from '../../data';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './SkillsList.css';

const SkillsList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useGSAP(() => {
    if (!containerRef.current || !layersRef.current) return;

    const layers = gsap.utils.toArray('.skill-layer') as HTMLElement[];

    // Set initial state for the layers
    gsap.set(layers, {
      z: (i) => i * -60, // Deeper stack
      y: (i) => i * -30,
      x: (i) => i * 30,
      opacity: (i) => 1 - (i * 0.2),
    });

    // Set initial state for the container (Isometric 3D)
    gsap.set(layersRef.current, {
      rotateX: 55,
      rotateZ: -40,
      rotateY: 0,
      scale: 0.9,
    });

    let mm = gsap.matchMedia();

    // Desktop Animation (2x2 Grid)
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'center center', // Pin saat kontainer tepat di tengah layar
          end: '+=200%',
          scrub: 1,
          pin: true,
        }
      });

      tl.to(layers, {
        x: (i) => (i % 2 === 0 ? -175 : 175), // Jarak dipersempit (gap ~10px)
        y: (i) => (i < 2 ? -145 : 145), // Jarak dipersempit (gap ~10px)
        z: 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        ease: 'power2.inOut'
      }, 0);

      tl.to(layersRef.current, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 0.95, // Skala dipertahankan agar tidak terpotong
        ease: 'power2.inOut'
      }, 0);
    });

    // Mobile Animation (Vertical Stack)
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'center center', // Pin saat kontainer tepat di tengah layar
          end: '+=150%',
          scrub: 1,
          pin: true,
        }
      });

      tl.to(layers, {
        y: (i) => (i - 1.5) * 160,
        x: 0,
        z: 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        ease: 'power2.inOut'
      }, 0);

      tl.to(layersRef.current, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 0.85,
        ease: 'power2.inOut'
      }, 0);
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="skills-stack-container bg-background py-20 min-h-[100vh] flex flex-col items-center overflow-hidden">

      {/* Header - Normal Document Flow (Mencegah tumpang tindih) */}
      <div className="w-full text-center z-10 shrink-0">
        <h2 className="text-4xl font-bold mb-4">{t('skills.title')}</h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto px-4">
          Scroll down to unpack the technology stack
        </p>
      </div>

      {/* Grid Container dengan Safe Margins - Memastikan jarak absolut dari teks */}
      {/* Mobile merentang 240px ke atas, Desktop 145px ke atas. Margin ini selalu lebih besar. */}
      <div className="w-full flex justify-center items-start perspective-1000 mt-[260px] md:mt-[160px] mb-[260px] md:mb-[160px]">
        <div ref={layersRef} className="relative w-full max-w-[340px] h-[280px] transform-style-3d">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="skill-layer absolute top-0 left-0 w-full h-full bg-card/90 border border-primary/30 rounded-xl p-4 md:p-5 flex flex-col"
            >
              <div className="text-xs md:text-sm text-primary font-mono mb-4 border-b border-border pb-2 flex justify-between items-center">
                <span>[LAYER_0{index + 1}]</span>
                <span className="font-bold">{category.title.toUpperCase()}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 md:px-3 md:py-1.5 bg-background rounded-full text-xs md:text-sm font-medium border border-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsList;