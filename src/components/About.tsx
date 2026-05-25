import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import DocumentModal from './DocumentModal';

function About() {
  const { t } = useTranslation();
  const [activeDoc, setActiveDoc] = useState<{url: string, title: string} | null>(null);

  return (
    <>
      <h2 className="section-title">{t('about.title')}</h2>
      <p>
        {t('about.description')}
      </p>
      <div className="button-container">
        <button 
          onClick={() => setActiveDoc({ url: '/assets/docs/CV_Hanif Nugraha.pdf', title: 'Curriculum Vitae' })}
          className="btn"
        >
          {t('about.view_cv')}
        </button>
        <button 
          onClick={() => setActiveDoc({ url: '/assets/docs/Shokumukeirekisho_Hanif_Ardiyanta_Nugraha.pdf', title: 'Shokumukeirekisho (Resume)' })}
          className="btn"
        >
          {t('about.view_shokumukeirekisho')}
        </button>
      </div>

      {/* Modern Cinematic Document Viewer */}
      <DocumentModal 
        isOpen={activeDoc !== null} 
        onClose={() => setActiveDoc(null)} 
        pdfUrl={activeDoc?.url || ''} 
        title={activeDoc?.title || ''} 
      />
    </>
  );
}

export default About;