import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypewriter } from '../../hooks/useTypewriter';
import HankoStamp from '../ui/HankoStamp';

function Hero() {
  const { t } = useTranslation();
  
  // Efek Typewriter 2 bahasa
  const typedName = useTypewriter(["Hanif Nugraha", "ハニフ ヌグラハ"], 120, 60, 3000);
  
  return (
    <section className="relative overflow-hidden pt-[50px] flex items-center justify-center min-h-screen text-center px-10 md:px-16">
      {/* Tategaki Watermark */}
      <div className="hero-tategaki">
        ソフトウェアエンジニア
      </div>

      <div className="relative z-10 max-w-[700px] w-full mx-auto">
        <h1 className="font-black leading-[1.1] mb-2 text-[clamp(2.5rem,8vw,4.5rem)]">
          {t('hero.greeting')} <span className="hero-name-typewriter">{typedName}</span><span className="typewriter-cursor">|</span>.
        </h1>
        <p className="font-bold mb-6 text-text-primary text-[clamp(1.2rem,4vw,1.75rem)]">{t('hero.role')}</p>
        <p className="text-lg text-text-secondary max-w-[550px] mx-auto mb-8">
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