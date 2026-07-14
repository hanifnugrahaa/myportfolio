import { useState } from "react";
import { useTranslation } from 'react-i18next';
import DocumentModal from '../ui/DocumentModal';
import CVGateModal from '../ui/CVGateModal';

function About() {
  const { t } = useTranslation();
  const [activeDoc, setActiveDoc] = useState<{url: string, title: string} | null>(null);
  const [gateDoc, setGateDoc] = useState<{url: string, title: string} | null>(null);

  return (
    <>
      <h2 className="text-4xl font-bold mb-8 text-center">{t('about.title')}</h2>
      <p className="text-lg leading-relaxed text-justify max-w-3xl mx-auto">
        {t('about.description')}
      </p>
      <div className="flex justify-center gap-6 mt-16 flex-wrap">
        <button 
          onClick={() => setGateDoc({ url: '/assets/docs/CV_Hanif Nugraha.pdf', title: 'Curriculum Vitae' })}
          className="btn"
        >
          {t('about.view_cv')}
        </button>
        <button 
          onClick={() => setGateDoc({ url: '/assets/docs/Shokumukeirekisho_Hanif_Ardiyanta_Nugraha.pdf', title: 'Shokumukeirekisho (Resume)' })}
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

      {/* CV Security Gate / Guestbook */}
      <CVGateModal
        isOpen={gateDoc !== null}
        onClose={() => setGateDoc(null)}
        docTitle={gateDoc?.title || ''}
        onProceed={() => {
          if (gateDoc) setActiveDoc(gateDoc);
          setGateDoc(null);
        }}
      />
    </>
  );
}

export default About;