// src/components/HankoStamp.tsx
import React from 'react';
import './HankoStamp.css';

const HankoStamp: React.FC = () => {
  return (
    <div className="hanko-stamp-container">
      <div className="hanko-spin-wrapper">
        <svg viewBox="0 0 100 100" width="120" height="120" className="hanko-svg">
          <defs>
            <path 
              id="circlePath" 
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" 
            />
          </defs>
          <text className="hanko-circular-text">
            <textPath href="#circlePath" startOffset="0%">
              HANIF NUGRAHA • ソフトウェア • 令和六年 • 
            </textPath>
          </text>
        </svg>
      </div>
      <div className="hanko-center-badge">
        <span className="hanko-kanji">ハ</span>
      </div>
    </div>
  );
};

export default HankoStamp;
