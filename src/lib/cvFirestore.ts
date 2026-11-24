import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { changeCvCatalog, cvDocuments, cvUrl, defaultCvCatalog, type CvCatalog, type CvChange, type CvLanguage } from './cvVersions';
import { parseCvDraft, type CvDraft } from './cvAuthoring';

export type PublicCv = { url: string } | { draft: CvDraft; language: CvLanguage };

export function watchCvCatalog(language: CvLanguage, onChange: (catalog: CvCatalog) => void, onError: () => void) {
  return onSnapshot(doc(db, 'cv_catalog', language), snapshot => {
    onChange(snapshot.exists() ? snapshot.data() as CvCatalog : defaultCvCatalog(language));
  }, onError);
}

export function watchPublicCv(language: CvLanguage, onChange: (document: PublicCv) => void, onError: () => void) {
  return onSnapshot(doc(db, 'cv_public', language), snapshot => {
    const data = snapshot.data();
    const draft = parseCvDraft(data?.content);
    const url: unknown = data?.url;
    onChange(draft ? { draft, language } : {
      url: (typeof url === 'string' && cvUrl(language, url)) || cvDocuments[language].url,
    });
  }, onError);
}

export async function saveCvChange(language: CvLanguage, change: CvChange) {
  const catalogRef = doc(db, 'cv_catalog', language);
  const publicRef = doc(db, 'cv_public', language);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(catalogRef);
    const current = snapshot.exists() ? snapshot.data() as CvCatalog : defaultCvCatalog(language);
    const next = changeCvCatalog(current, change);
    const selected = next.versions.find(version => version.id === next.activeId);
    if (!selected) throw new Error('Versi aktif tidak ditemukan.');
    transaction.set(catalogRef, next);
    transaction.set(publicRef, selected.content ? { content: selected.content } : { url: selected.url });
  });
}
