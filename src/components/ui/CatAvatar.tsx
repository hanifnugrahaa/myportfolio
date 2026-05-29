import React from 'react';
import './CatAvatar.css';

interface CatAvatarProps {
  isThinking: boolean;
}

const CatAvatar: React.FC<CatAvatarProps> = ({ isThinking }) => {
  const stateClass = isThinking ? 'cat-thinking' : 'cat-idle';

  return (
    <div className={`cat-avatar-container ${stateClass}`}>
      {/* SVG Cat Mascot */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" aria-hidden="true">
        <g className="cat-head">
          {/* Outer Ears */}
          <path d="M 20 55 L 10 15 L 45 35 Z" fill="#f97316" className="cat-ear-left" style={{ transformOrigin: '20px 55px' }} />
          <path d="M 80 55 L 90 15 L 55 35 Z" fill="#f97316" className="cat-ear-right" style={{ transformOrigin: '80px 55px' }} />
          
          {/* Inner Ears */}
          <path d="M 22 50 L 16 25 L 38 37 Z" fill="#fdba74" className="cat-ear-left" style={{ transformOrigin: '20px 55px' }} />
          <path d="M 78 50 L 84 25 L 62 37 Z" fill="#fdba74" className="cat-ear-right" style={{ transformOrigin: '80px 55px' }} />

          {/* Main Head Shape (Ellipse) */}
          <ellipse cx="50" cy="55" rx="42" ry="36" fill="#f97316" />
          <ellipse cx="50" cy="65" rx="46" ry="26" fill="#f97316" />

          {/* Tabby Stripes (Forehead) */}
          <path d="M 50 20 L 50 35 M 38 24 L 43 35 M 62 24 L 57 35" stroke="#c2410c" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
          
          {/* Cheeks Blush */}
          <circle cx="26" cy="65" r="7" fill="#ea580c" opacity="0.3" />
          <circle cx="74" cy="65" r="7" fill="#ea580c" opacity="0.3" />

          {/* White Snout/Muzzle */}
          <ellipse cx="50" cy="72" rx="16" ry="11" fill="#ffffff" />

          {/* Nose */}
          <path d="M 46 68 L 54 68 L 50 73 Z" fill="#f472b6" />

          {/* Mouth (W shape) */}
          <path d="M 44 75 Q 47 79 50 76 Q 53 79 56 75" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Left Eye */}
          <g className="cat-eye" style={{ transformOrigin: '35px 55px' }}>
            <circle cx="35" cy="55" r="5" fill="#1f2937" />
            <circle cx="33" cy="53" r="1.5" fill="#ffffff" />
          </g>
          
          {/* Right Eye */}
          <g className="cat-eye" style={{ transformOrigin: '65px 55px' }}>
            <circle cx="65" cy="55" r="5" fill="#1f2937" />
            <circle cx="63" cy="53" r="1.5" fill="#ffffff" />
          </g>

          {/* Paws holding the panel edge */}
          <rect x="22" y="86" width="18" height="14" rx="7" fill="#f97316" />
          <rect x="60" y="86" width="18" height="14" rx="7" fill="#f97316" />
          
          {/* Paw Claws/Lines */}
          <path d="M 27 88 L 27 96 M 31 88 L 31 96 M 35 88 L 35 96" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M 65 88 L 65 96 M 69 88 L 69 96 M 73 88 L 73 96" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
};

export default CatAvatar;
