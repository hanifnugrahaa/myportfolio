import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { ExternalLink, FileText, Pencil, Plus } from 'lucide-react';
import { saveCvChange, watchCvCatalog } from '../lib/cvFirestore';
import { cvDocuments, cvLanguages, cvUrl, defaultCvCatalog, type CvCatalog, type CvChange, type CvLanguage, type CvVersion } from '../lib/cvVersions';

const control = 'rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50';
const input = 'mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white';
const CvEditor = lazy(() => import('../components/ui/CvEditor'));

function CvVersions({ language }: { language: CvLanguage }) {
  const [catalog, setCatalog] = useState<CvCatalog>();
  const [readError, setReadError] = useState(false);
  const [editing, setEditing] = useState<CvVersion | null>(null);
  const [authoring, setAuthoring] = useState<{ version?: CvVersion } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => watchCvCatalog(language, next => {
    setCatalog(next);
    setReadError(false);
  }, () => setReadError(true)), [language]);

  const displayedCatalog = catalog ?? (readError ? defaultCvCatalog(language) : undefined);

  async function apply(change: CvChange) {
    if (busy) return false;
    setBusy(true);
    setError('');
    try {
      await saveCvChange(language, change);
      if (change.type === 'save') setEditing(null);
      return true;
    } catch (cause) {
      console.error('Could not update CV', cause);
      setError('Perubahan gagal disimpan. Coba lagi atau periksa izin Firestore.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const fields = new FormData(event.currentTarget);
    const label = String(fields.get('label')).trim();
    const url = cvUrl(language, String(fields.get('url')).trim());
    if (!label || !url) {
      setError('Isi nama versi dan URL HTTPS yang langsung membuka PDF.');
      return;
    }
    void apply({ type: 'save', version: { id: editing.id, label, url } });
  }

  return (
    <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText size={18} className="text-sky-300" aria-hidden="true" /> {cvDocuments[language].title}</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${control} inline-flex items-center gap-2 !bg-white !text-neutral-950`}
            onClick={() => { setAuthoring({}); setError(''); }}>
            <Pencil size={16} aria-hidden="true" /> Buat CV
          </button>
          <button type="button" className={`${control} inline-flex items-center gap-2`} disabled={!catalog || busy || readError}
            onClick={() => { setEditing({ id: crypto.randomUUID(), label: '', url: '' }); setError(''); }}>
            <Plus size={16} aria-hidden="true" /> Tambah versi
          </button>
        </div>
      </header>
      {readError && (
        <p role="alert" className="border-b border-neutral-800 px-4 py-3 text-sm text-neutral-300">
          {catalog ? 'Menampilkan versi terakhir yang berhasil dimuat.' : 'Menampilkan PDF bawaan portofolio.'}{' '}
          Pengelolaan versi memerlukan akses ke katalog CV di Firestore.
        </p>
      )}
      {!displayedCatalog ? <p role="status" className="p-4 text-sm text-neutral-400">Memuat versi…</p>
        : <ul className="divide-y divide-neutral-800">
          {displayedCatalog.versions.map(version => {
            const active = version.id === displayedCatalog.activeId;
            return (
              <li key={version.id} className="grid gap-3 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium wrap-anywhere">{version.label}</span>
                  {active && <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">{readError ? 'PDF tersedia' : 'Tampil di portofolio'}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {version.url && <a href={cvUrl(language, version.url) ?? undefined} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold !text-neutral-950 hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900">
                    Buka PDF <ExternalLink size={14} aria-hidden="true" />
                  </a>}
                  {version.content ? (
                    <button type="button" className={control} disabled={busy} onClick={() => setAuthoring({ version })}>
                      {active ? 'Buat revisi' : 'Edit isi CV'}
                    </button>
                  ) : !readError && <button type="button" className={control} disabled={busy} onClick={() => { setEditing(version); setError(''); }}>Edit</button>}
                  {!active && !readError && <>
                    <button type="button" className={control} disabled={busy} onClick={() => void apply({ type: 'publish', id: version.id })}>Tampilkan</button>
                    <button type="button" className={`${control} text-red-300`} disabled={busy} onClick={() => {
                      if (window.confirm(`Hapus versi ${version.label}?`)) void apply({ type: 'delete', id: version.id });
                    }}>Hapus</button>
                  </>}
                </div>
              </li>
            );
          })}
        </ul>}
      {editing?.url !== undefined && !readError && (
        <form key={editing.id} onSubmit={submit} className="grid gap-3 border-t border-neutral-800 p-4">
          <h3 className="font-semibold">{catalog?.versions.some(version => version.id === editing.id) ? 'Edit versi' : 'Versi baru'}</h3>
          <label className="text-sm">Nama versi<input name="label" required maxLength={100} defaultValue={editing.label} className={input} /></label>
          <label className="text-sm">URL PDF publik<input name="url" required maxLength={2048} inputMode="url" defaultValue={editing.url} className={input} /></label>
          {catalog?.activeId === editing.id && <p className="text-sm text-neutral-400">Perubahan URL versi aktif langsung berlaku di portofolio.</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className={control} disabled={busy} onClick={() => { setEditing(null); setError(''); }}>Batal</button>
            <button type="submit" className={control} disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan versi'}</button>
          </div>
        </form>
      )}
      {authoring && (
        <Suspense fallback={<p role="status" className="p-4">Memuat editor…</p>}>
          <CvEditor language={language} storageKey={authoring.version?.id ?? 'new'}
            label={authoring.version
              ? authoring.version.label + (catalog?.activeId === authoring.version.id ? ' (revisi)' : '')
              : 'Versi baru'}
            content={authoring.version?.content} canSave={Boolean(catalog) && !readError}
            onClose={() => setAuthoring(null)}
            onSave={(label, content) => {
              const id = authoring.version?.id;
              return apply({ type: 'save', version: { id: id && id !== catalog?.activeId ? id : crypto.randomUUID(), label, content } });
            }} />
        </Suspense>
      )}
      {error && <p role="alert" className="px-4 pb-3 text-sm text-red-300">{error}</p>}
    </section>
  );
}

export default function AdminCv() {
  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Versi CV</h1>
        <p className="mt-1 text-sm text-neutral-400">Pilih satu PDF untuk ditampilkan di portofolio pada setiap bahasa.</p>
      </header>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        {cvLanguages.map(language => <CvVersions key={language} language={language} />)}
      </div>
    </div>
  );
}
