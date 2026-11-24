import { Film, ImageOff, Layers, Pencil, Trash2 } from 'lucide-react';
import type { PortfolioMediaFields } from '../data';
import { getPortfolioMedia } from '../lib/portfolioMedia';

export default function AdminPostCard({ post, title, description, tags, onEdit, onDelete, deleting }: {
  post: PortfolioMediaFields;
  title: string;
  description?: string;
  tags?: string[];
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}) {
  const slides = getPortfolioMedia(post);
  const cover = slides[0];

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-600">
      <div className="relative aspect-video border-b border-neutral-800 bg-neutral-950">
        {cover?.type === 'video' ? (
          <video src={cover.url} preload="metadata" muted playsInline className="h-full w-full object-cover" />
        ) : cover ? (
          <img src={cover.url} loading="lazy" decoding="async" alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-sm text-neutral-400">
            <ImageOff size={22} aria-hidden="true" /> Belum ada cover
          </div>
        )}
        {cover && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border border-white/15 bg-black/85 px-2 py-1 text-xs font-medium text-white">
            {cover.type === 'video' && <Film size={14} aria-label="Cover video" />}
            <Layers size={14} aria-hidden="true" /> {slides.length} media
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold leading-snug wrap-anywhere">{title}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-400 wrap-anywhere">{description}</p>}
        </div>
        {tags && tags.length > 0 && (
          <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <li key={index} className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300 wrap-anywhere">{tag}</li>
            ))}
            {tags.length > 3 && <li className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">+{tags.length - 3}</li>}
          </ul>
        )}
      </div>

      <div className="flex gap-2 border-t border-neutral-800 px-4 py-3">
        <button type="button" onClick={onEdit} aria-label={`Edit ${title}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 text-sm font-medium hover:bg-neutral-700 after:absolute after:inset-0 after:cursor-pointer focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-sky-400">
          <Pencil size={15} aria-hidden="true" /> Edit
        </button>
        <button type="button" onClick={onDelete} disabled={deleting} aria-label={`Hapus ${title}`}
          className="relative z-10 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-red-300 hover:bg-red-950/60 disabled:opacity-40">
          <Trash2 size={15} aria-hidden="true" /> Hapus
        </button>
      </div>
    </article>
  );
}
