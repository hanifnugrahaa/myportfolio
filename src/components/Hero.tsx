import React from 'react';
import { useTranslation } from 'react-i18next';



function Hero() {
  const { t } = useTranslation();
  
  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="hero__content" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="hero__title">{t('hero.greeting')} Hanif Nugraha.</h1>
        <p className="hero__subtitle">{t('hero.role')}</p>
        <p className="hero__description">
          {t('hero.description')}
        </p>
        <a href="#projects" className="btn btn--hero">{t('hero.cta')}</a>
      </div>
    </section>
  );
}

export default Hero;