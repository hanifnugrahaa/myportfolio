import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface ThemeTransitionOverlayProps {
  isActive: boolean;
}

const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bladeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !bladeRef.current) return;

    if (isActive) {
      // Animate sweep in
      gsap.set(containerRef.current, { display: 'flex' });
      gsap.fromTo(
        bladeRef.current,
        { xPercent: -100 },
        {
          xPercent: 0,
          duration: 0.3,
          ease: 'power3.inOut'
        }
      );
    } else {
      // Animate sweep out, then hide
      gsap.to(bladeRef.current, {
        xPercent: 100,
        duration: 0.3,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(containerRef.current, { display: 'none' });
          gsap.set(bladeRef.current, { xPercent: -100 }); // reset for next time
        }
      });
    }
  }, [isActive]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none items-center justify-center overflow-hidden hidden"
    >
      {/* 
        Rotated massive container. 
        -35deg makes the X-axis point from bottom-left to top-right.
      */}
      <div 
        className="absolute flex items-center justify-center" 
        style={{ width: '250vmax', height: '250vmax', transform: 'rotate(-35deg)' }}
      >
          {/* The sweeping Katana blade (Now with Glassmorphism) */}
          <div
            ref={bladeRef}
            className="w-full h-full bg-black/40 dark:bg-white/20 relative shadow-2xl"
            style={{
              backdropFilter: 'blur(40px) saturate(150%)',
              WebkitBackdropFilter: 'blur(40px) saturate(150%)'
            }}
          >
            {/* Entry Katana Spark (Right Edge) - Sweeps in */}
            <div 
              className="absolute top-0 right-0 h-full w-[4px] bg-[var(--accent-color)] shadow-[0_0_40px_var(--accent-color)]"
            />
            <div 
              className="absolute top-0 right-0 h-full w-[1px] bg-white shadow-[0_0_10px_#ffffff]"
            />

            {/* Exit Katana Spark (Left Edge) - Sweeps out */}
            <div 
              className="absolute top-0 left-0 h-full w-[4px] bg-[var(--accent-color)] shadow-[0_0_40px_var(--accent-color)]"
            />
            <div 
              className="absolute top-0 left-0 h-full w-[1px] bg-white shadow-[0_0_10px_#ffffff]"
            />
          </div>
      </div>
    </div>
  );
};

export default ThemeTransitionOverlay;
