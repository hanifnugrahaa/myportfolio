import { ArrowRight, CalendarDays, FileText, FolderKanban, ImageOff, Layers, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../data';
import type { ManagedActivity } from '../lib/portfolioActivities';
import { getActivityText } from '../lib/portfolioActivities';
import { getPortfolioMedia } from '../lib/portfolioMedia';
import type { PortfolioEditor } from '../components/ui/PortfolioPostForm';

export type LoadStatus = 'loading' | 'ready' | 'error';
const panel = 'min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900';
const link = 'inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white';
const statusText = { loading: 'Memuat…', error: 'Data tidak tersedia', ready: 'Belum ada posting' };

export default function AdminOverview({
  projects, activities, projectsStatus, activitiesStatus, onEdit, onOpenTab,
}: {
  projects: (Project & { id: string })[];
  activities: ManagedActivity[];
  projectsStatus: LoadStatus;
  activitiesStatus: LoadStatus;
  onEdit: (editor: PortfolioEditor) => void;
  onOpenTab: (tab: 'projects' | 'activities' | 'cv') => void;
}) {
  const groups = [
    { label: 'Projects', status: projectsStatus, tab: 'projects', Icon: FolderKanban, color: 'bg-sky-400/10 text-sky-300',
      posts: projects.map(post => ({ title: post.name, editor: { kind: 'projects', post } as const, media: getPortfolioMedia(post) })) },
    { label: 'Activities', status: activitiesStatus, tab: 'activities', Icon: CalendarDays, color: 'bg-emerald-400/10 text-emerald-300',
      posts: activities.map(post => ({ title: getActivityText(post).title, editor: { kind: 'activities', post } as const, media: getPortfolioMedia(post) })) },
  ] as const;
  const loaded = groups.flatMap(group => group.status === 'ready' ? [...group.posts] : []);
  const needsCover = loaded.filter(post => !post.media.length);
  const media = loaded.flatMap(post => post.media);
  const videos = media.filter(slide => slide.type === 'video').length;
  const allLoaded = groups.every(group => group.status === 'ready');
  const hasError = groups.some(group => group.status === 'error');

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <header className="flex flex-wrap items-end justify-between gap-5 rounded-2xl border border-slate-700/70 bg-linear-to-br from-slate-800/80 to-neutral-900 p-5 sm:p-7">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ringkasan portofolio</h1>
          <Link to="/" className={`${link} mt-2 -ml-2 !text-slate-300 hover:!text-white`}>Lihat portofolio <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onEdit({ kind: 'projects' })}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-neutral-200">
            <Plus size={16} aria-hidden="true" /> Tambah proyek
          </button>
          <button type="button" onClick={() => onEdit({ kind: 'activities' })} disabled={activitiesStatus !== 'ready'}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50">
            <Plus size={16} aria-hidden="true" /> Tambah aktivitas
          </button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map(({ label, posts, status, tab, Icon, color }) => (
          <button key={tab} type="button" onClick={() => onOpenTab(tab)}
            className={`${panel} grid gap-3 p-4 text-left hover:border-neutral-600`}>
            <span className="flex items-center gap-3 text-sm font-medium text-neutral-300">
              <span className={`rounded-lg p-2 ${color}`}><Icon size={17} aria-hidden="true" /></span>
              {label}
              <ArrowRight size={16} aria-hidden="true" className="ml-auto shrink-0 text-neutral-400" />
            </span>
            <span className="text-3xl font-semibold tabular-nums">{status === 'ready' ? posts.length : '—'}</span>
            <span className="text-xs text-neutral-400">{status === 'ready' ? `${posts.filter(post => post.media.length).length} dengan cover` : statusText[status]}</span>
          </button>
        ))}
        <div className={`${panel} grid gap-3 p-4 sm:col-span-2 xl:col-span-1`}>
          <span className="flex items-center gap-3 text-sm font-medium text-neutral-300">
            <span className="rounded-lg bg-violet-400/10 p-2 text-violet-300"><Layers size={17} aria-hidden="true" /></span> Media posting
          </span>
          <span className="text-3xl font-semibold tabular-nums">{allLoaded ? media.length : '—'}</span>
          <span className="text-xs text-neutral-400">{allLoaded ? `${media.length - videos} foto · ${videos} video` : statusText[hasError ? 'error' : 'loading']}</span>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="cover-heading" className={panel}>
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-4 py-3">
            <h2 id="cover-heading" className="flex items-center gap-2 font-semibold">
              <ImageOff size={17} className="text-amber-300" aria-hidden="true" /> Perlu cover
            </h2>
            {needsCover.length > 0 && <span className="text-sm text-neutral-400">{needsCover.length} posting</span>}
          </header>
          {hasError && (
            <p className="px-4 py-3 text-sm text-neutral-400">Sebagian konten gagal dimuat. Daftar ini mungkin belum lengkap.</p>
          )}
          {needsCover.length === 0 && allLoaded && (
            <p className="p-4 text-sm text-neutral-400">{loaded.length ? 'Semua posting punya cover.' : 'Belum ada posting untuk diperiksa.'}</p>
          )}
          {needsCover.length === 0 && (projectsStatus === 'loading' || activitiesStatus === 'loading') && (
            <p role="status" className="p-4 text-sm text-neutral-400">Memeriksa cover…</p>
          )}
          <ul className="divide-y divide-neutral-800">
            {needsCover.map(({ title, editor }) => (
              <li key={`${editor.kind}/${editor.post.id}`} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium wrap-anywhere">{title}</p>
                  <p className="text-xs text-neutral-400">{editor.kind === 'projects' ? 'Project' : 'Activity'}</p>
                </div>
                <button type="button" className={link} onClick={() => onEdit(editor)} aria-label={`Edit ${title}`}>Edit <ArrowRight size={14} aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="dashboard-cv-heading" className={`${panel} p-4`}>
          <h2 id="dashboard-cv-heading" className="flex items-center gap-2 font-semibold"><FileText size={17} className="text-sky-300" aria-hidden="true" /> Dokumen CV</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">Kelola English CV dan Shokumukeirekisho yang bisa dibuka pengunjung.</p>
          <button type="button" onClick={() => onOpenTab('cv')} className={`${link} mt-3 border border-neutral-700`}>Kelola versi CV <ArrowRight size={15} aria-hidden="true" /></button>
        </section>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {groups.map(({ label, tab, posts, status, Icon, color }) => (
          <section key={tab} aria-labelledby={`overview-${tab}`} className={panel}>
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 p-4">
              <h2 id={`overview-${tab}`} className="flex items-center gap-2 font-semibold">
                <span className={`rounded-lg p-2 ${color}`}><Icon size={17} aria-hidden="true" /></span> {label}
              </h2>
              <button type="button" onClick={() => onOpenTab(tab)} className={link}>Lihat semua <ArrowRight size={15} aria-hidden="true" /></button>
            </header>
            {status !== 'ready' || posts.length === 0 ? (
              <p className="p-4 text-sm text-neutral-400">{statusText[status]}</p>
            ) : (
              <ul className="divide-y divide-neutral-800">
                {posts.slice(0, 4).map(({ title, editor, media: slides }) => (
                  <li key={editor.post.id}>
                    <button type="button" onClick={() => onEdit(editor)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-neutral-800/60">
                      <span className="min-w-0">
                        <span className="block text-sm font-medium wrap-anywhere">{title}</span>
                        <span className="text-xs text-neutral-400">{slides.length ? `${slides.length} media` : 'Belum punya cover'}</span>
                      </span>
                      <ArrowRight size={15} className="shrink-0 text-neutral-400" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
