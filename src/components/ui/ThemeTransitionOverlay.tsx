import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeTransitionOverlayProps {
  isActive: boolean;
}

const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden">
          {/* 
            Rotated massive container. 
            -35deg makes the X-axis point from bottom-left to top-right.
          */}
          <div 
            className="absolute flex items-center justify-center" 
            style={{ width: '250vmax', height: '250vmax', transform: 'rotate(-35deg)' }}
          >
             {/* The sweeping Katana blade (Now with Glassmorphism) */}
             <motion.div
               initial={{ x: '-100%' }}
               animate={{ x: '0%' }}
               exit={{ x: '100%' }}
               transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.3 }}
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
             </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeTransitionOverlay;
