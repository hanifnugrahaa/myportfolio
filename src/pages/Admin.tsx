import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, setDoc, updateDoc, deleteDoc, doc, runTransaction } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import type { Activity, Project } from '../data';
import { RetroGrid } from '../components/magicui/retro-grid';
import PortfolioPostForm, { type PortfolioEditor } from '../components/ui/PortfolioPostForm';
import { usePortfolioActivities } from '../hooks/usePortfolioActivities';
import { getActivityText, isLegacyActivity } from '../lib/portfolioActivities';
import AdminOverview from './AdminOverview';
import AdminPostCard from './AdminPostCard';
import AdminCv from './AdminCv';
import AdminSidebar, { type AdminTab } from './AdminSidebar';
import { Dock, DockIcon } from '../components/magicui/dock';

import { Particles } from '../components/magicui/particles';
import { ShinyButton } from '../components/magicui/shiny-button';
import { motion, AnimatePresence } from 'framer-motion';

const postGrid = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-4 lg:gap-6';

const Admin: React.FC = () => {
  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsFailed, setProjectsFailed] = useState(false);
  const [editor, setEditor] = useState<PortfolioEditor | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      setProjectsFailed(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectsFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
      {activeTab !== 'dashboard' && <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={200} ease={80} color="#ffffff" refresh />}
      {activeTab !== 'dashboard' && <RetroGrid className="z-0 opacity-20 mix-blend-screen pointer-events-none" angle={65} cellSize={50} lightLineColor="#ffffff" darkLineColor="#ffffff" />}
      
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(collapsed => !collapsed)} />

      <div className="relative z-10 min-h-0 min-w-0 flex-1 px-4 py-8 sm:px-8 overflow-y-auto pb-32" data-lenis-prevent>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <AdminOverview projects={projects} activities={activities}
                projectsStatus={loading ? 'loading' : projectsFailed ? 'error' : 'ready'}
                activitiesStatus={activitiesStatus}
                onEdit={setEditor} onOpenTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
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
            <div className={`${postGrid} relative z-10`}>
              {projects.map(project => (
                <AdminPostCard key={project.id} post={project} title={project.name} description={project.description}
                  tags={project.techStack} onEdit={() => setEditor({ kind: 'projects', post: project })}
                  onDelete={() => void handleDelete(project.id)} deleting={loading} />
              ))}
              
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
              {activitiesStatus === 'ready' && (
                <div className={postGrid}>
                  {activities.map(activity => {
                    const { title, description } = getActivityText(activity);
                    return (
                      <AdminPostCard key={activity.id} post={activity} title={title} description={description}
                        onEdit={() => setEditor({ kind: 'activities', post: activity })}
                        onDelete={() => void deleteActivity(activity.id)} deleting={deletingActivity} />
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === 'cv' && <AdminCv key="cv" />}

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
