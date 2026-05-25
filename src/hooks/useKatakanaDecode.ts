// src/hooks/useKatakanaDecode.ts
import { useState, useEffect } from 'react';

const KATAKANA = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";

export const useKatakanaDecode = (targetText: string, scrambleSpeed = 40, duration = 1500) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.floor(duration / scrambleSpeed);
    
    // Inisialisasi teks dengan katakana acak
    setDisplayText(
      targetText.split('').map(char => 
        char === ' ' ? ' ' : KATAKANA[Math.floor(Math.random() * KATAKANA.length)]
      ).join('')
    );

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames; // 0 to 1
      
      setDisplayText(
        targetText.split('').map((char, index) => {
          if (char === ' ') return ' ';
          
          // Threshold gabungan antara posisi index dan random untuk efek cascading
          const decodeThreshold = (index / targetText.length) * 0.4 + Math.random() * 0.6;
          
          // Jika progress sudah melampaui threshold, kunci huruf aslinya
          if (progress >= decodeThreshold || frame >= totalFrames) {
            return char;
          }
          
          // Jika belum, terus acak dengan Katakana
          return KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
        }).join('')
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [targetText, duration, scrambleSpeed]);

  return displayText;
};
