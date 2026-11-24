import { useEffect, useRef, useState, type FormEvent } from 'react';
import { getPortfolioMedia, maxMediaCount, moveMedia, parseMediaUrl } from '../../lib/portfolioMedia';
import { getActivityText } from '../../lib/portfolioActivities';
import type { Activity, PortfolioMedia, Project } from '../../data';

type DraftSlide = PortfolioMedia & { id: string };
export type PortfolioEditor = { kind: 'projects'; post?: Project & { id: string } }
  | { kind: 'activities'; post?: Activity & { id: string } };

const fieldStyle = 'w-full rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-white';
const buttonStyle = 'rounded-lg bg-neutral-700 px-3 py-2 text-white disabled:opacity-40';

function SlidePreview({ slide }: { slide: PortfolioMedia }) {
  return slide.type === 'video'
    ? <video src={slide.url} preload="metadata" className="h-12 w-16 object-cover" />
    : <img src={slide.url} alt="" className="h-12 w-16 object-cover" />;
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
    <dialog ref={dialog} className="m-auto max-h-[90vh] w-[min(95vw,42rem)] overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-900 p-6 text-white backdrop:bg-black/70"
      aria-labelledby="portfolio-editor-title" onCancel={event => {
        event.preventDefault();
        if (!pending.current) onClose();
      }}>
      <h2 id="portfolio-editor-title" className="mb-4 text-xl font-bold">
        {editor.post ? 'Edit' : 'Tambah'} {editor.kind === 'projects' ? 'Project' : 'Activity'}
      </h2>
      <form onSubmit={save}>
        <fieldset disabled={saving} className="grid gap-4">
          <label>Judul<input name="name" className={fieldStyle} required maxLength={180} defaultValue={activity?.title ?? project?.name} /></label>
          <label>Deskripsi<textarea name="description" className={fieldStyle} rows={3} maxLength={5000}
            defaultValue={activity?.description ?? project?.description} required={editor.kind === 'projects'} /></label>
          {editor.kind === 'projects' && <>
            <label>Metrics<input name="metrics" className={fieldStyle} required defaultValue={project?.metrics} /></label>
            <label>Tech stack (pisahkan dengan koma)<input name="techStack" className={fieldStyle} required defaultValue={project?.techStack.join(', ')} /></label>
            <label>Tautan demo atau GitHub<input name="githubUrl" className={fieldStyle} type="url" pattern="https?://.+" defaultValue={project?.githubUrl} /></label>
          </>}
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <label>URL media
              <input type="text" inputMode="url" maxLength={2048} placeholder="https://…" value={mediaUrl}
                onChange={event => setMediaUrl(event.target.value)} className={fieldStyle} />
            </label>
            <label>Jenis media
              <select value={mediaType} className={fieldStyle} onChange={event => setMediaType(event.target.value === 'video' ? 'video' : 'image')}>
                <option value="image">Foto</option>
                <option value="video">Video</option>
              </select>
            </label>
            <button type="button" className={buttonStyle} onClick={() => {
              const slide = makeSlide();
              if (!slide) return;
              setSlides([...slides, slide]);
              setMediaUrl('');
            }}>Tambah media</button>
          </div>
          <p className="text-sm text-neutral-400">Gunakan URL langsung yang bisa dibuka tanpa login. Maksimal 10 media.</p>
          <ol className="grid gap-2">
            {slides.map((slide, index) => (
              <li key={slide.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-neutral-800 p-2">
                <SlidePreview slide={slide} />
                <div className="min-w-0 flex-1">
                  <p>{index + 1}. {slide.type === 'video' ? 'Video' : 'Foto'}{index === 0 && ' (cover)'}</p>
                  <p title={slide.url} className="truncate text-sm text-neutral-400">{slide.url.startsWith('data:') ? 'Media lama' : slide.url}</p>
                </div>
                <button type="button" aria-label={`Geser media ${index + 1} ke atas`} className={buttonStyle} disabled={index === 0}
                  onClick={() => setSlides(moveMedia(slides, index, -1))}>↑</button>
                <button type="button" aria-label={`Geser media ${index + 1} ke bawah`} className={buttonStyle} disabled={index === slides.length - 1}
                  onClick={() => setSlides(moveMedia(slides, index, 1))}>↓</button>
                <button type="button" aria-label={`Hapus media ${index + 1}`} className={buttonStyle}
                  onClick={() => setSlides(slides.filter(item => item.id !== slide.id))}>Hapus</button>
              </li>
            ))}
          </ol>
          <div className="flex justify-end gap-2">
            <button type="button" className={buttonStyle} onClick={onClose}>Batal</button>
            <button type="submit" className="rounded-lg bg-white px-4 py-2 font-semibold text-black">{saving ? 'Menyimpan…' : 'Simpan'}</button>
          </div>
        </fieldset>
        {saving && <p role="status">Menyimpan posting…</p>}
        {error && <p role="alert" className="mt-2 text-red-300">{error}</p>}
      </form>
    </dialog>
  );
}
