import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, Plus, Printer, Trash2, X } from 'lucide-react';
import { cvRowFields, emptyCvRow, parseCvDraft, renderCvHtml, type CvDraft, type CvSection } from '../../lib/cvAuthoring';
import { cvDocuments, type CvLanguage } from '../../lib/cvVersions';

const input = 'mt-1 block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white';
const button = 'inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50';

type EditorCopy = { label: string; draft: CvDraft };

const loadTemplate = (language: CvLanguage) =>
  language === 'ja' ? import('../../lib/cvTemplate.ja.json') : import('../../lib/cvTemplate.en.json');

function readCopy(key: string): EditorCopy | null {
  try {
    const copy = JSON.parse(localStorage.getItem(key) ?? 'null');
    const draft = parseCvDraft(JSON.stringify(copy?.draft));
    return draft && typeof copy?.label === 'string' ? { label: copy.label, draft } : null;
  } catch {
    return null;
  }
}

export default function CvEditor({ language, storageKey, label, content, canSave, onClose, onSave }: {
  language: CvLanguage;
  storageKey: string;
  label: string;
  content?: string;
  canSave: boolean;
  onClose: () => void;
  onSave: (label: string, content: string) => Promise<boolean>;
}) {
  const key = `portfolio-cv-draft-${language}-${storageKey}`;
  const [draft, setDraft] = useState(() => readCopy(key)?.draft ?? parseCvDraft(content));
  const [name, setName] = useState(() => readCopy(key)?.label ?? label);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [readyToPrint, setReadyToPrint] = useState(false);
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const dirty = useRef(false);
  const templateFailed = useRef(false);

  useEffect(() => {
    const modal = dialog.current;
    modal?.showModal();
    return () => modal?.close();
  }, []);

  useEffect(() => {
    if (draft || templateFailed.current) return;
    let mounted = true;
    void loadTemplate(language).then(result => {
      if (!mounted) return;
      const document = parseCvDraft(JSON.stringify(result.default));
      if (!document) throw new Error('Invalid CV template');
      setDraft(document);
    }).catch(() => {
      if (!mounted) return;
      templateFailed.current = true;
      setNotice('Template gagal dimuat. Tutup editor dan coba lagi.');
    });
    return () => { mounted = false; };
  }, [draft, language]);

  function close() {
    if (!busy && (!dirty.current || window.confirm('Tutup editor tanpa menyimpan perubahan?'))) onClose();
  }

  function update(next: CvDraft) {
    dirty.current = true;
    setDraft(next);
  }

  function updateSection(next: CvSection, index: number) {
    if (draft) update({ ...draft, sections: draft.sections.map((section, i) => i === index ? next : section) });
  }

  async function save(local: boolean) {
    const serialized = JSON.stringify(draft);
    if (!name.trim() || !parseCvDraft(serialized)) {
      setNotice('Isi nama versi dan nama lengkap. Kurangi isi dokumen jika sudah melebihi batas editor.');
      return;
    }
    setNotice('');
    if (local) {
      try {
        localStorage.setItem(key, JSON.stringify({ label: name.trim(), draft }));
        dirty.current = false;
        setNotice('Draft tersimpan di browser ini.');
      } catch {
        setNotice('Browser tidak bisa menyimpan draft lokal.');
      }
      return;
    }
    setBusy(true);
    try {
      if (await onSave(name.trim(), serialized)) {
        try { localStorage.removeItem(key); } catch { /* Cloud version is already saved. */ }
        onClose();
      } else setNotice('Draft gagal disimpan ke Firestore. Kamu masih bisa menyimpannya di browser.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog ref={dialog} aria-labelledby="cv-editor-heading" onCancel={event => { event.preventDefault(); close(); }}
      className="m-auto w-[min(96vw,68rem)] max-h-[94dvh] overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 text-white backdrop:bg-black/75">
      <div className="flex max-h-[92dvh] flex-col">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 p-4">
          <h2 id="cv-editor-heading" className="text-xl font-semibold">Editor {cvDocuments[language].title}</h2>
          <div className="flex items-center gap-2">
            {draft && <button type="button" className={button} disabled={busy} onClick={() => { setReadyToPrint(false); setPreview(!preview); }}>
              {preview ? <ArrowLeft size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />} {preview ? 'Lanjut edit' : 'Preview A4'}
            </button>}
            <button type="button" className={button} aria-label="Tutup editor CV" disabled={busy} onClick={close}><X size={18} aria-hidden="true" /></button>
          </div>
        </header>
        <div className="min-h-0 overflow-y-auto" data-lenis-prevent>
          {!draft ? <p role="status" className="p-4 text-neutral-400">Memuat template…</p> : preview ? (
            <iframe ref={frame} onLoad={() => setReadyToPrint(true)} sandbox="allow-same-origin allow-modals"
              srcDoc={renderCvHtml(draft, language)} title="Preview CV A4" className="block h-[65dvh] w-full border-0 bg-neutral-200" />
          ) : (
            <fieldset disabled={busy} className="grid gap-4 p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label>Nama versi<input className={input} maxLength={100} value={name} onChange={event => { dirty.current = true; setName(event.target.value); }} /></label>
                <label>Nama lengkap<input className={input} maxLength={160} value={draft.name} onChange={event => update({ ...draft, name: event.target.value })} /></label>
              </div>
              <label>{language === 'ja' ? 'Tanggal dokumen' : 'Kontak dan lokasi'}
                <textarea className={input} rows={2} value={draft.metadata} onChange={event => update({ ...draft, metadata: event.target.value })} />
              </label>
              <label>{language === 'ja' ? 'Ringkasan pengalaman (職務経歴)' : 'Professional summary'}
                <textarea className={input} rows={4} value={draft.intro} onChange={event => update({ ...draft, intro: event.target.value })} />
              </label>
              {draft.sections.map((section, index) => (
                <details key={index} className="rounded-xl border border-neutral-700 bg-neutral-950/40">
                  <summary className="cursor-pointer px-4 py-3 font-medium">{section.title || section.text.split('\n')[0] || `Bagian ${index + 1}`}</summary>
                  <div className="grid gap-3 border-t border-neutral-800 p-4">
                    <label>Judul bagian<input className={input} value={section.title} onChange={event => updateSection({ ...section, title: event.target.value }, index)} /></label>
                    <label>Isi bagian<textarea className={input} rows={3} value={section.text} onChange={event => updateSection({ ...section, text: event.target.value }, index)} /></label>
                    {language === 'ja' && <label>Format bagian<select className={input} value={section.style} onChange={event => {
                      const value = event.target.value;
                      updateSection({ ...section, style: value === 'table' || value === 'history' ? value : 'entries' }, index);
                    }}><option value="entries">Teks</option><option value="history">Tabel riwayat perusahaan</option><option value="table">Tabel detail pekerjaan</option></select></label>}
                    {section.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid gap-3 rounded-lg border border-neutral-800 p-3 sm:grid-cols-2">
                        {(section.style === 'history' ? cvRowFields.slice(0, 2) : cvRowFields).map(field => {
                          const labels = { title: 'Judul atau perusahaan', period: 'Periode', details: 'Detail', tools: 'Teknologi', role: 'Peran atau skala' };
                          const replace = (value: string) => updateSection({
                            ...section, rows: section.rows.map((entry, i) => i === rowIndex ? { ...entry, [field]: value } : entry),
                          }, index);
                          return field === 'details'
                            ? <label key={field} className="sm:col-span-2">{labels[field]}<textarea className={input} rows={4} value={row[field]} onChange={event => replace(event.target.value)} /></label>
                            : <label key={field}>{labels[field]}<input className={input} value={row[field]} onChange={event => replace(event.target.value)} /></label>;
                        })}
                        <button type="button" className={`${button} justify-self-start sm:col-span-2`} onClick={() =>
                          updateSection({ ...section, rows: section.rows.filter((_, i) => i !== rowIndex) }, index)}>
                          <Trash2 size={15} aria-hidden="true" /> Hapus entri
                        </button>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className={button} onClick={() => updateSection({ ...section, rows: [...section.rows, emptyCvRow] }, index)}><Plus size={16} aria-hidden="true" /> Tambah entri</button>
                      <button type="button" className={button} onClick={() => update({ ...draft, sections: draft.sections.filter((_, i) => i !== index) })}>Hapus bagian</button>
                    </div>
                  </div>
                </details>
              ))}
              <button type="button" className={`${button} justify-self-start`} onClick={() => update({
                ...draft, sections: [...draft.sections, { title: '', text: '', style: 'entries', rows: [] }],
              })}><Plus size={16} aria-hidden="true" /> Tambah bagian</button>
            </fieldset>
          )}
        </div>
        <footer className="grid shrink-0 gap-2 border-t border-neutral-800 p-4">
          {notice && <p role="status" className="text-sm text-neutral-300">{notice}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            {preview && <button type="button" className={button} disabled={!readyToPrint || busy} onClick={() => frame.current?.contentWindow?.print()}><Printer size={16} aria-hidden="true" /> Cetak / simpan PDF</button>}
            <button type="button" className={button} disabled={!draft || busy} onClick={() => void save(true)}>Simpan lokal</button>
            <button type="button" className={`${button} !bg-white !text-neutral-950`} disabled={!draft || busy || !canSave} onClick={() => void save(false)}>
              {busy ? 'Menyimpan…' : 'Simpan versi draft'}
            </button>
          </div>
          {!canSave && <p className="text-right text-xs text-neutral-400">Penyimpanan versi online memerlukan izin katalog CV.</p>}
        </footer>
      </div>
    </dialog>
  );
}
