// src/components/GiantTypography.tsx
import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from 'framer-motion';
import './GiantTypography.css';

interface GiantTypographyProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number;
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const GiantTypography: React.FC<GiantTypographyProps> = ({ 
  text, 
  direction = 'left',
  speed = 1
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [3, 0, 3], {
    clamp: false
  });

  const directionFactor = useRef<number>(direction === 'left' ? -1 : 1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * speed * (delta / 16); // normalize delta to 60fps (16.6ms)

    const currentVelocity = smoothVelocity.get();
    
    // Reverse direction if scrolling up
    if (currentVelocity < 0) {
      directionFactor.current = direction === 'left' ? 1 : -1;
    } else if (currentVelocity > 0) {
      directionFactor.current = direction === 'left' ? -1 : 1;
    }

    // Adjust speed based on absolute velocity
    moveBy += Math.sign(moveBy) * Math.abs(moveBy) * velocityFactor.get();

    baseX.set(baseX.get() + moveBy * 0.025); // Set a very slow, elegant base speed (0.025)
  });

  // Wrap base X between -50% and 0% for seamless infinite loop
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div className="giant-typography-container">
      <motion.div 
        className="giant-typography-wrapper"
        style={{ x }}
      >
        {/* Render 4 times to ensure it covers the screen and wraps perfectly at -50% */}
        <span className="giant-text outline-text">{text}</span>
        <span className="giant-text solid-text">{text}</span>
        <span className="giant-text outline-text">{text}</span>
        <span className="giant-text solid-text">{text}</span>
      </motion.div>
    </div>
  );
};

export default GiantTypography;
