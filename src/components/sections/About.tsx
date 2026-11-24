import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import DocumentModal from '../ui/DocumentModal';
import { cvDocuments } from '../../lib/cvVersions';
import { watchPublicCv, type PublicCv } from '../../lib/cvFirestore';

type CvSelection = { cv: PublicCv; title: string };

function About() {
  const { t } = useTranslation();
  const [activeDoc, setActiveDoc] = useState<CvSelection | null>(null);
  const [englishCv, setEnglishCv] = useState<PublicCv>({ url: cvDocuments.en.url });
  const [japaneseCv, setJapaneseCv] = useState<PublicCv>({ url: cvDocuments.ja.url });
  useEffect(() => {
    const stopEnglish = watchPublicCv('en', setEnglishCv, () => setEnglishCv({ url: cvDocuments.en.url }));
    const stopJapanese = watchPublicCv('ja', setJapaneseCv, () => setJapaneseCv({ url: cvDocuments.ja.url }));
    return () => { stopEnglish(); stopJapanese(); };
  }, []);

  return (
    <>
      <h2 className="text-4xl font-bold mb-8 text-center">{t('about.title')}</h2>
      <p className="text-lg leading-relaxed text-justify max-w-3xl mx-auto">
        {t('about.description')}
      </p>
      <div className="flex justify-center gap-6 mt-16 flex-wrap">
        <button 
          onClick={() => setActiveDoc({ cv: englishCv, title: 'Curriculum Vitae' })}
          className="btn"
        >
          {t('about.view_cv')}
        </button>
        <button 
          onClick={() => setActiveDoc({ cv: japaneseCv, title: 'Shokumukeirekisho (Resume)' })}
          className="btn"
        >
          {t('about.view_shokumukeirekisho')}
        </button>
      </div>

      {/* Modern Cinematic Document Viewer */}
      <DocumentModal 
        isOpen={activeDoc !== null} 
        onClose={() => setActiveDoc(null)} 
        cv={activeDoc?.cv}
        title={activeDoc?.title || ''} 
      />
    </>
  );
}

export default About;
