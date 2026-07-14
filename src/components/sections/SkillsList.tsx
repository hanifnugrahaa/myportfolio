import React, { useRef } from 'react';
import { skillCategories } from '../../data';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SkillIcon from '../ui/SkillIcon';
import './SkillsList.css';

const SkillsList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useGSAP(() => {
    if (!containerRef.current || !layersRef.current) return;

    const layers = gsap.utils.toArray('.skill-layer') as HTMLElement[];
    let mm = gsap.matchMedia();

    // Desktop Animation (2x2 Grid)
    mm.add("(min-width: 768px)", () => {
      // Set initial state for the layers (3D Stack)
      gsap.set(layers, {
        z: (i) => i * -60,
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'center 55%', // Pinned at 55% from the top
          end: '+=235%', // 200% / 0.85 to account for scroll lock
          scrub: 1,
          pin: true,
        }
      });

      tl.to(layers, {
        x: (i) => (i % 2 === 0 ? -250 : 250), // 20px horizontal gap
        y: (i) => (i < 2 ? -185 : 185), // 20px vertical gap
        z: 0,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0);

      tl.to(layersRef.current, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1, // Change from 0.95 to 1 to fix rasterization blurriness
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0);

      // Add a dummy tween at the end for the scroll lock (15% of the total pin distance)
      tl.to({}, { duration: 0.15 });
    });

    // Mobile Animation (Normal Flow)
    mm.add("(max-width: 767px)", () => {
      // Reset any desktop 3D properties explicitly just in case
      gsap.set(layersRef.current, {
        clearProps: "all"
      });
      
      gsap.set(layers, {
        clearProps: "all"
      });

      // Simple fade up as they scroll into view
      layers.forEach((layer) => {
        gsap.fromTo(layer, 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: layer,
              start: "top bottom-=50px",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="skills-stack-container bg-background py-16 md:py-20 min-h-0 md:min-h-[100vh] flex flex-col items-center overflow-hidden">

      {/* Header - Normal Document Flow (Mencegah tumpang tindih) */}
      <div className="w-full text-center z-10 shrink-0 mb-8">
        <h2 className="text-4xl font-bold mb-2">{t('skills.title')}</h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto px-4">
          Scroll down to unpack the technology stack
        </p>
      </div>

      {/* Grid Container dengan Safe Margins */}
      <div className="w-full flex justify-center items-start md:perspective-1000 mt-4 md:mt-[180px] mb-8 md:mb-[180px] px-4 md:px-0">
        <div ref={layersRef} className="relative flex flex-col gap-6 md:block w-full max-w-[90vw] md:max-w-[480px] md:h-[350px] md:transform-style-3d">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="skill-layer md:absolute md:top-0 md:left-0 w-full h-auto md:h-full bg-card/90 border border-primary/30 rounded-xl p-5 flex flex-col shadow-lg md:shadow-none"
            >
              <div className="text-xs md:text-sm font-mono mb-4 border-b pb-2 flex justify-between items-center" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                <span>[LAYER_0{index + 1}]</span>
                <span className="font-bold">{category.title.toUpperCase()}</span>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {category.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base font-medium border flex items-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <SkillIcon skill={skill} />
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