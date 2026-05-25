import React from "react";
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title">{t('about.title')}</h2>
      <p>
        {t('about.description')}
      </p>
      <div className="button-container">
        <a 
          href="/assets/docs/CV_Hanif Nugraha.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
        >
          {t('about.view_cv')}
        </a>
        <a 
          href="/assets/docs/Shokumukeirekisho_Hanif_Ardiyanta_Nugraha.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn"
        >
          {t('about.view_shokumukeirekisho')}
        </a>
      </div>
    </>
  );
}

export default About;