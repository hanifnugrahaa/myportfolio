import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, setDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, runTransaction } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import type { Activity, Project } from '../data';
import { RetroGrid } from '../components/magicui/retro-grid';
import PortfolioPostForm, { type PortfolioEditor } from '../components/ui/PortfolioPostForm';
import { usePortfolioActivities } from '../hooks/usePortfolioActivities';
import { getActivityText, isLegacyActivity } from '../lib/portfolioActivities';
import { getPortfolioMedia } from '../lib/portfolioMedia';
import { NumberTicker } from '../components/magicui/number-ticker';
import { BlurFade } from '../components/magicui/blur-fade';
import { BorderBeam } from '../components/magicui/border-beam';
import { Dock, DockIcon } from '../components/magicui/dock';

import { Particles } from '../components/magicui/particles';
import { ShinyButton } from '../components/magicui/shiny-button';
import { MagicCard } from '../components/magicui/magic-card';
import { motion, AnimatePresence } from 'framer-motion';

const Admin: React.FC = () => {
  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [cvLogs, setCvLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [editor, setEditor] = useState<PortfolioEditor | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'activities' | 'logs'>('dashboard');
  const { activities, status: activitiesStatus } = usePortfolioActivities();
  const [activityError, setActivityError] = useState('');
  const [deletingActivity, setDeletingActivity] = useState(false);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projs: (Project & { id: string })[] = [];
      querySnapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as (Project & { id: string }));
      });
      setProjects(projs);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const q = query(collection(db, 'cv_logs'), orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const logs: any[] = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      setCvLogs(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchLogs();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  async function savePost(post: Project | Activity) {
    if (!editor) return;
    const posts = collection(db, editor.kind);
    if (editor.post) {
      const postRef = doc(posts, editor.post.id);
      if (editor.kind === 'activities' && isLegacyActivity(editor.post.id)) {
        await runTransaction(db, async transaction => {
          const current = await transaction.get(postRef);
          if (current.data()?.deleted === true) throw new Error('This activity has been deleted.');
          transaction.set(postRef, post, { merge: true });
        });
      } else {
        await updateDoc(postRef, { ...post });
      }
    } else {
      await addDoc(posts, post);
    }
    if (editor.kind === 'projects') await fetchProjects();
  }

  async function deleteActivity(id: string) {
    if (deletingActivity || !window.confirm('Hapus aktivitas ini?')) return;
    setActivityError('');
    setDeletingActivity(true);
    try {
      const activity = doc(db, 'activities', id);
      if (isLegacyActivity(id)) await setDoc(activity, { deleted: true });
      else await deleteDoc(activity);
    } catch (error) {
      console.error('Could not delete activity', error);
      setActivityError('Aktivitas gagal dihapus. Coba lagi.');
    } finally {
      setDeletingActivity(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, 'projects', id));
        await fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-neutral-950 text-white overflow-hidden selection:bg-white/30 flex flex-col md:flex-row">
      <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={200} ease={80} color="#ffffff" refresh />
      <RetroGrid className="z-0 opacity-20 mix-blend-screen pointer-events-none" angle={65} cellSize={50} lightLineColor="#ffffff" darkLineColor="#ffffff" />
      
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <div className="relative z-20 w-full md:w-64 flex-shrink-0 bg-neutral-900/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-neutral-800 p-6 flex flex-col gap-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-600">
            <span className="text-white font-black text-xl tracking-tighter">HN</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Admin Panel</h1>
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">CMS</p>
          </div>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-semibold text-sm whitespace-nowrap">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'projects' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-semibold text-sm whitespace-nowrap">Projects</span>
          </button>
          <button 
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'activities' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v4m8-4v4M4 10h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2zm3 10 2 2 4-4" />
            </svg>
            <span className="font-semibold text-sm whitespace-nowrap">Activities</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'logs' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-semibold text-sm whitespace-nowrap">CV Logs</span>
          </button>
        </nav>
      </div>
      
      <div className="relative z-10 flex-1 px-4 py-8 sm:px-8 h-full overflow-y-auto pb-32" data-lenis-prevent>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 relative overflow-hidden">
                <BorderBeam size={200} duration={12} delay={0} />
                <h2 className="text-2xl font-bold mb-2 text-white">Welcome back, Admin!</h2>
                <p className="text-neutral-400 text-sm">Berikut adalah ringkasan singkat dari portofoliomu.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700">
                    <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Proyek</p>
                    <h3 className="text-4xl font-bold text-white">
                      {projects.length > 0 ? <NumberTicker value={projects.length} /> : '0'}
                    </h3>
                  </div>
                  <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700">
                    <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Unduhan CV</p>
                    <h3 className="text-4xl font-bold text-white">
                      {cvLogs.length > 0 ? <NumberTicker value={cvLogs.length} /> : '0'}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  [ PROJECTS_MANAGER ]
                </h2>
                <ShinyButton onClick={() => setEditor({ kind: 'projects' })} className="bg-white text-black border-none rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  + Add Project
                </ShinyButton>
              </div>
          {loading && projects.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-neutral-400 space-y-4 bg-neutral-900 rounded-3xl border border-neutral-700">
              <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
              <p className="font-medium text-sm">Syncing data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              <AnimatePresence>
                {projects.map((p, index) => (
                  <BlurFade key={p.id} delay={0.1 * index} inView>
                    <MagicCard 
                      onClick={() => setEditor({ kind: 'projects', post: p })}
                      className="group flex flex-col p-5 bg-neutral-900/50 rounded-3xl border border-neutral-700 transition-colors duration-300 hover:border-neutral-500 shadow-xl h-full relative cursor-pointer" 
                      gradientColor="rgba(255,255,255,0.05)" 
                      gradientSize={250}
                    >
                      
                      {getPortfolioMedia(p)[0] ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 border border-neutral-700 relative">
                          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                          {getPortfolioMedia(p)[0]?.type === 'video'
                            ? <video src={getPortfolioMedia(p)[0]?.url} preload="metadata" className="w-full h-full object-cover" />
                            : <img src={getPortfolioMedia(p)[0]?.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />}
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-xl bg-neutral-800 border border-neutral-700 mb-5 flex items-center justify-center">
                          <span className="text-neutral-500 text-xs font-medium px-2">NO_IMAGE</span>
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col">
                        <h4 className="text-xl font-bold text-white mb-2 tracking-tight relative z-20 pointer-events-none">{p.name}</h4>
                        <p className="text-sm font-medium text-neutral-400 mb-4 line-clamp-2 relative z-20 pointer-events-none">{p.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6 relative z-20 pointer-events-none">
                          {p.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="bg-neutral-800/80 text-neutral-300 text-[10px] px-2 py-1 rounded-md border border-neutral-700 uppercase tracking-wider font-semibold backdrop-blur-md">
                              {tech}
                            </span>
                          ))}
                          {p.techStack.length > 3 && (
                            <span className="bg-neutral-800/80 text-neutral-400 text-[10px] px-2 py-1 rounded-md border border-neutral-700 font-semibold backdrop-blur-md">
                              +{p.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-auto pt-4 border-t border-neutral-800/50 relative z-20">
                        <ShinyButton 
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditor({ kind: 'projects', post: p }); }}
                          className="flex-1 bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-600 !rounded-xl text-sm backdrop-blur-md"
                        >
                          Edit
                        </ShinyButton>
                        <ShinyButton 
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(p.id); }} 
                          className="flex-1 bg-red-950/80 hover:bg-red-900 text-red-100 border border-red-800/50 !rounded-xl text-sm backdrop-blur-md"
                        >
                          Hapus
                        </ShinyButton>
                      </div>
                    </MagicCard>
                  </BlurFade>
                ))}
              </AnimatePresence>
              
              {projects.length === 0 && (
                <div className="col-span-full py-20 text-center border border-neutral-700 rounded-3xl bg-neutral-900">
                  <p className="text-neutral-400 font-medium text-sm">Belum ada project nih. Yuk tambah karya terbaikmu!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

          {activeTab === 'activities' && (
            <section key="activities" className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Activities</h2>
                <ShinyButton disabled={activitiesStatus !== 'ready'} onClick={() => setEditor({ kind: 'activities' })}>
                  Tambah aktivitas
                </ShinyButton>
              </div>
              {activitiesStatus === 'loading' && <p role="status">Memuat aktivitas?</p>}
              {activitiesStatus === 'error' && <p role="alert">Aktivitas gagal dimuat. Periksa izin Firestore dan muat ulang halaman.</p>}
              {activityError && <p role="alert">{activityError}</p>}
              {activitiesStatus === 'ready' && activities.length === 0 && <p>Belum ada aktivitas.</p>}
              {activitiesStatus === 'ready' && activities.map(activity => (
                <article key={activity.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{getActivityText(activity).title}</h3>
                    <p className="text-sm text-neutral-400">{getPortfolioMedia(activity).length} media</p>
                  </div>
                  <button type="button" className="rounded-lg bg-neutral-700 px-3 py-2" onClick={() => setEditor({ kind: 'activities', post: activity })}>Edit</button>
                  <button type="button" className="rounded-lg bg-red-900 px-3 py-2 disabled:opacity-40" disabled={deletingActivity}
                    onClick={() => void deleteActivity(activity.id)}>Hapus</button>
                </article>
              ))}
            </section>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                [ CV_ACCESS_LOGS ]
              </h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-6 relative">
                <BorderBeam size={200} duration={12} delay={0} />
                {loadingLogs ? (
                  <div className="flex justify-center p-8">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : cvLogs.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-sm">Belum ada yang mengakses CV.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-wider text-xs">
                          <th className="pb-4 font-semibold px-4">Waktu</th>
                          <th className="pb-4 font-semibold px-4">Dokumen</th>
                          <th className="pb-4 font-semibold px-4">Pesan / Identitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cvLogs.map((log) => (
                          <tr key={log.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/50 transition-colors">
                            <td className="py-4 px-4 text-neutral-400 font-mono text-xs">
                              {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('id-ID') : 'Baru saja'}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-xs font-mono text-neutral-300">
                                {log.document}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-medium text-white">
                              {log.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {editor && <PortfolioPostForm editor={editor} onClose={() => setEditor(null)} onSave={savePost} />}
      </div>

      {/* Floating Mac-style Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max">
        <Dock>
          <DockIcon onClick={() => navigate('/')} className="hover:text-neutral-300 text-white" title="Lihat Web">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </DockIcon>
          <DockIcon onClick={() => setEditor({ kind: 'projects' })} className="hover:text-neutral-300 text-white" title="Tambah Proyek">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </DockIcon>
          <DockIcon onClick={handleLogout} className="hover:text-red-400 text-red-500" title="Keluar">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </DockIcon>
        </Dock>
      </div>
    </div>
  );
};

export default Admin;
