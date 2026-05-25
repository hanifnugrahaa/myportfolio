// src/components/GiantTypography.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './GiantTypography.css';

interface GiantTypographyProps {
  text: string;
  direction?: 'left' | 'right';
  speed?: number;
}

const GiantTypography: React.FC<GiantTypographyProps> = ({ 
  text, 
  direction = 'left',
  speed = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mengambil posisi scroll khusus untuk elemen ini
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Tentukan arah gerak parallax
  const xTransform = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'left' ? [0, -400 * speed] : [-400 * speed, 0]
  );

  return (
    <div className="giant-typography-container" ref={containerRef}>
      <motion.div 
        className="giant-typography-wrapper"
        style={{ x: xTransform }}
      >
        {/* Render text dua kali agar cukup panjang untuk digeser */}
        <span className="giant-text outline-text">{text}</span>
        <span className="giant-text solid-text">{text}</span>
        <span className="giant-text outline-text">{text}</span>
      </motion.div>
    </div>
  );
};

export default GiantTypography;
