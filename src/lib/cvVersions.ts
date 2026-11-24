import { parseMediaUrl } from './portfolioMedia';

export const cvDocuments = {
  en: { title: 'English CV', url: '/assets/docs/CV_Hanif Nugraha.pdf' },
  ja: { title: 'Shokumukeirekisho', url: '/assets/docs/Shokumukeirekisho_Hanif_Ardiyanta_Nugraha.pdf' },
} as const;

export type CvLanguage = keyof typeof cvDocuments;
export const cvLanguages = ['en', 'ja'] as const;
export type CvVersion = { id: string; label: string } & ({ url: string; content?: never } | { content: string; url?: never });
export type CvCatalog = { activeId: string; versions: CvVersion[] };
export type CvChange = { type: 'save'; version: CvVersion } | { type: 'publish' | 'delete'; id: string };

export function defaultCvCatalog(language: CvLanguage): CvCatalog {
  return { activeId: 'original', versions: [{ id: 'original', label: 'Versi bawaan', url: cvDocuments[language].url }] };
}

export function cvUrl(language: CvLanguage, value: string) {
  return value === cvDocuments[language].url ? value : parseMediaUrl(value);
}

export function changeCvCatalog(catalog: CvCatalog, change: CvChange): CvCatalog {
  if (change.type === 'save') {
    const exists = catalog.versions.some(version => version.id === change.version.id);
    return {
      ...catalog,
      versions: exists ? catalog.versions.map(version => version.id === change.version.id ? change.version : version)
        : [...catalog.versions, change.version],
    };
  }
  if (!catalog.versions.some(version => version.id === change.id)) throw new Error('Versi CV sudah tidak tersedia.');
  if (change.type === 'publish') return { ...catalog, activeId: change.id };
  if (catalog.activeId === change.id) throw new Error('Pilih versi lain untuk ditampilkan sebelum menghapus versi aktif.');
  return { ...catalog, versions: catalog.versions.filter(version => version.id !== change.id) };
}
