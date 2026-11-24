import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Film, ImagePlus, Trash2, X } from 'lucide-react';
import { getPortfolioMedia, maxMediaCount, moveMedia, parseMediaUrl } from '../../lib/portfolioMedia';
import { getActivityText } from '../../lib/portfolioActivities';
import type { Activity, PortfolioMedia, Project } from '../../data';

type DraftSlide = PortfolioMedia & { id: string };
export type PortfolioEditor = { kind: 'projects'; post?: Project & { id: string } }
  | { kind: 'activities'; post?: Activity & { id: string } };

const fieldStyle = 'mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm leading-5 text-white placeholder:text-neutral-500 hover:border-neutral-600';
const labelStyle = 'block text-sm font-medium text-neutral-200';
const buttonStyle = 'rounded-lg border border-neutral-700 px-3 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-800 disabled:opacity-40';
const mediaAction = 'grid size-9 shrink-0 place-items-center rounded-md text-neutral-300 hover:bg-neutral-700 disabled:opacity-30';

function SlidePreview({ slide, className }: { slide: PortfolioMedia; className: string }) {
  return slide.type === 'video'
    ? <video src={slide.url} preload="metadata" muted playsInline className={className} />
    : <img src={slide.url} alt="" className={className} />;
}

export default function PortfolioPostForm({ editor, onClose, onSave }: {
  editor: PortfolioEditor;
  onClose: () => void;
  onSave: (post: Project | Activity) => Promise<void>;
}) {
  const project = editor.kind === 'projects' ? editor.post : undefined;
  const activity = editor.kind === 'activities' && editor.post ? getActivityText(editor.post) : undefined;
  const [slides, setSlides] = useState<DraftSlide[]>(() =>
    getPortfolioMedia(editor.post ?? {}).map(slide => ({ ...slide, id: crypto.randomUUID() })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<PortfolioMedia['type']>('image');
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef(false);
  const cover = slides[0];
  const postTitle = editor.post ? (activity?.title ?? editor.post.name) : '';

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function makeSlide(): DraftSlide | null {
    setError('');
    if (slides.length >= maxMediaCount) {
      setError('Satu posting bisa berisi maksimal 10 media.');
      return null;
    }
    const url = parseMediaUrl(mediaUrl);
    if (!url) {
      setError('Masukkan URL HTTPS publik yang langsung membuka foto atau video.');
      return null;
    }
    return { id: crypto.randomUUID(), url, type: mediaType };
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    setError('');
    const fields = new FormData(event.currentTarget);
    const get = (key: string) => String(fields.get(key) ?? '').trim();
    const name = get('name');
    if (!name) {
      setError('Isi judul posting.');
      return;
    }
    const pendingSlide = mediaUrl.trim() ? makeSlide() : null;
    if (mediaUrl.trim() && !pendingSlide) return;
    const media = (pendingSlide ? [...slides, pendingSlide] : slides).map(({ type, url }) => ({ type, url }));
    if (editor.kind === 'activities' && media.length === 0 &&
      (!editor.post || getPortfolioMedia(editor.post).length > 0)) {
      setError('Tambahkan setidaknya satu foto atau video untuk cover aktivitas.');
      return;
    }
    pending.current = true;
    setSaving(true);
    try {
      // Keep legacy covers readable without storing a second copy of Base64 media.
      const imageUrl = media[0]?.url.startsWith('data:') ? '' : (media[0]?.url ?? '');
      const post = { name, description: get('description'), imageUrl, media };
      await onSave(editor.kind === 'projects' ? {
        ...post,
        metrics: get('metrics'),
        githubUrl: get('githubUrl'),
        techStack: get('techStack').split(',').map(tech => tech.trim()).filter(Boolean),
      } : post);
      onClose();
    } catch (cause) {
      console.error('Could not save portfolio post', cause);
      setError('Posting gagal disimpan. Periksa koneksi dan izin Firebase, lalu coba lagi.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return (
    <dialog ref={dialog} className="m-auto max-h-[94dvh] w-[min(95vw,68rem)] overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 text-white shadow-2xl backdrop:bg-black/75"
      aria-labelledby="portfolio-editor-title" onCancel={event => {
        event.preventDefault();
        if (!pending.current) onClose();
      }}>
      <form onSubmit={save} className="flex max-h-[92dvh] flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-800 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id="portfolio-editor-title" className="text-xl font-semibold tracking-tight">
              {editor.post ? 'Edit' : 'Tambah'} {editor.kind === 'projects' ? 'Project' : 'Activity'}
            </h2>
            {postTitle && <p className="mt-1 line-clamp-1 text-sm text-neutral-400 wrap-anywhere">{postTitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Tutup editor"
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:opacity-40">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div data-lenis-prevent className="min-h-0 min-w-0 flex-auto overflow-y-auto">
          <fieldset disabled={saving} className="min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
              <section className="grid min-w-0 grid-cols-1 content-start gap-4 p-4 sm:p-6">
                <h3 className="text-base font-semibold">Detail posting</h3>
                <label className={labelStyle}>Judul<input name="name" className={fieldStyle} required maxLength={180} defaultValue={activity?.title ?? project?.name} /></label>
                <label className={labelStyle}>Deskripsi<textarea name="description" className={`${fieldStyle} resize-y`} rows={5} maxLength={5000}
                  defaultValue={activity?.description ?? project?.description} required={editor.kind === 'projects'} /></label>
                {editor.kind === 'projects' && <>
                  <label className={labelStyle}>Metrics<input name="metrics" className={fieldStyle} required defaultValue={project?.metrics} /></label>
                  <label className={labelStyle}>Tech stack <span className="font-normal text-neutral-400">(pisahkan dengan koma)</span><input name="techStack" className={fieldStyle} required defaultValue={project?.techStack.join(', ')} /></label>
                  <label className={labelStyle}>Tautan demo atau GitHub<input name="githubUrl" className={fieldStyle} type="url" pattern="https?://.+" defaultValue={project?.githubUrl} /></label>
                </>}
              </section>
              <section className="grid min-w-0 grid-cols-1 content-start gap-4 border-t border-neutral-800 bg-neutral-950/45 p-4 sm:p-6 md:border-t-0 md:border-l">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">Media</h3>
                  <span className="text-xs tabular-nums text-neutral-400">{slides.length} / {maxMediaCount}</span>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                  {cover ? <>
                    <SlidePreview slide={cover} className="h-full w-full object-cover" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/85 px-2 py-1 text-xs font-semibold text-white">
                      {cover.type === 'video' && <Film size={13} aria-hidden="true" />} Cover
                    </span>
                  </> : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-neutral-400">
                      <ImagePlus size={24} aria-hidden="true" /> Belum ada cover
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                  <label className={`${labelStyle} col-span-full`}>URL media
                    <input type="text" inputMode="url" maxLength={2048} placeholder="https://…" value={mediaUrl}
                      onChange={event => setMediaUrl(event.target.value)} className={fieldStyle} />
                  </label>
                  <label className={labelStyle}>Jenis media
                    <select value={mediaType} className={fieldStyle} onChange={event => setMediaType(event.target.value === 'video' ? 'video' : 'image')}>
                      <option value="image">Foto</option>
                      <option value="video">Video</option>
                    </select>
                  </label>
                  <button type="button" className={`${buttonStyle} bg-neutral-800`} onClick={() => {
                    const slide = makeSlide();
                    if (!slide) return;
                    setSlides([...slides, slide]);
                    setMediaUrl('');
                  }}>Tambah media</button>
                  <p className="col-span-full text-xs text-neutral-400">Pakai URL langsung yang bisa dibuka tanpa login.</p>
                </div>
                {slides.length > 0 && <div>
                  <h4 className="mb-2 text-sm font-medium text-neutral-200">Urutan slide</h4>
                  <ol className="divide-y divide-neutral-800 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                    {slides.map((slide, index) => (
                      <li key={slide.id} className="flex items-center gap-2 p-2">
                        <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-md bg-neutral-800 text-xs tabular-nums text-neutral-300">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{slide.type === 'video' ? 'Video' : 'Foto'}{index === 0 && ' · Cover'}</p>
                          <p title={slide.url} className="truncate text-xs text-neutral-400">{slide.url.startsWith('data:') ? 'Media lama' : slide.url}</p>
                        </div>
                        <button type="button" aria-label={`Geser media ${index + 1} ke atas`} className={mediaAction} disabled={index === 0}
                          onClick={() => setSlides(moveMedia(slides, index, -1))}><ArrowUp size={16} aria-hidden="true" /></button>
                        <button type="button" aria-label={`Geser media ${index + 1} ke bawah`} className={mediaAction} disabled={index === slides.length - 1}
                          onClick={() => setSlides(moveMedia(slides, index, 1))}><ArrowDown size={16} aria-hidden="true" /></button>
                        <button type="button" aria-label={`Hapus media ${index + 1}`} className={`${mediaAction} text-red-300 hover:bg-red-950/60`}
                          onClick={() => setSlides(slides.filter(item => item.id !== slide.id))}><Trash2 size={16} aria-hidden="true" /></button>
                      </li>
                    ))}
                  </ol>
                </div>}
              </section>
            </div>
          </fieldset>
        </div>
        <footer className="shrink-0 border-t border-neutral-800 px-4 py-3 sm:px-6">
          {error && <p role="alert" className="mb-2 text-sm text-red-300">{error}</p>}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {saving && <p role="status" className="mr-auto text-sm text-neutral-400">Menyimpan posting…</p>}
            <button type="button" className={buttonStyle} disabled={saving} onClick={onClose}>Batal</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-white px-4 py-2 font-semibold text-black hover:bg-neutral-200 disabled:opacity-50">{saving ? 'Menyimpan…' : 'Simpan'}</button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
