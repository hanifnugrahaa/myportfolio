import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypewriter } from '../hooks/useTypewriter';
import HankoStamp from './HankoStamp';

function Hero() {
  const { t } = useTranslation();
  
  // Efek Typewriter 2 bahasa
  const typedName = useTypewriter(["Hanif Nugraha", "ハニフ ヌグラハ"], 120, 60, 3000);
  
  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Tategaki Watermark */}
      <div className="hero-tategaki">
        ソフトウェアエンジニア
      </div>

      <div className="hero__content" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="hero__title">
          {t('hero.greeting')} <span className="hero-name-typewriter">{typedName}</span><span className="typewriter-cursor">|</span>.
        </h1>
        <p className="hero__subtitle">{t('hero.role')}</p>
        <p className="hero__description">
          {t('hero.description')}
        </p>
        <a href="#projects" className="btn btn--hero">{t('hero.cta')}</a>
      </div>

      {/* Hanko Stamp Badge */}
      <HankoStamp />
    </section>
  );
}

export default Hero;