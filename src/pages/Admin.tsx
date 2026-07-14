import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../data';
import { RetroGrid } from '../components/magicui/retro-grid';
import { ShimmerButton } from '../components/magicui/shimmer-button';
import { NumberTicker } from '../components/magicui/number-ticker';
import { BlurFade } from '../components/magicui/blur-fade';
import { BorderBeam } from '../components/magicui/border-beam';
import { Dock, DockIcon } from '../components/magicui/dock';
import { WordPullUp } from '../components/magicui/word-pull-up';
import { Particles } from '../components/magicui/particles';
import { ShinyButton } from '../components/magicui/shiny-button';
import { motion, AnimatePresence } from 'framer-motion';

const Admin: React.FC = () => {
  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [cvLogs, setCvLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techStack, setTechStack] = useState(''); 
  const [existingImageUrl, setExistingImageUrl] = useState('');

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

  const handleEdit = (project: Project & { id: string }) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setMetrics(project.metrics);
    setGithubUrl(project.githubUrl);
    setTechStack(project.techStack.join(', '));
    setExistingImageUrl(project.imageUrl);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setMetrics('');
    setGithubUrl('');
    setTechStack('');
    setExistingImageUrl('');
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData: Project = {
        name,
        description,
        metrics,
        imageUrl: existingImageUrl,
        githubUrl,
        techStack: techStack.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData as any);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }
      
      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project!");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="relative min-h-screen w-full bg-neutral-950 text-white overflow-hidden selection:bg-white/30 pb-24">
      <Particles className="absolute inset-0 z-0" quantity={200} ease={80} color="#ffffff" refresh />
      <RetroGrid className="z-0 opacity-20 mix-blend-screen" angle={65} cellSize={50} lightLineColor="#ffffff" darkLineColor="#ffffff" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6 bg-neutral-900 p-6 rounded-2xl border border-neutral-700 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-600">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <WordPullUp words="Admin Panel" className="text-2xl font-bold tracking-tight text-white leading-tight text-left drop-shadow-none" />
              <p className="text-neutral-300 text-sm font-medium">Kendali penuh portofolio, sinkronisasi instan ke seluruh jaringan.</p>
            </div>
          </div>
        </header>

        {/* Stats & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-neutral-900 px-6 py-4 rounded-2xl border border-neutral-700 flex items-center gap-4 w-full sm:w-auto">
            <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-600">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Total Proyek</p>
              <h3 className="text-2xl font-bold text-white leading-none mt-1">
                {projects.length > 0 ? <NumberTicker value={projects.length} /> : '0'}
              </h3>
            </div>
          </div>
        </div>

        {/* Project Grid List Section */}
        <div className="w-full">
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
                    <div className="group flex flex-col p-5 bg-neutral-900 rounded-3xl border border-neutral-700 transition-colors duration-300 hover:border-neutral-500 shadow-xl h-full relative overflow-hidden">
                      <BorderBeam size={150} duration={12} delay={9} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {p.imageUrl ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-5 border border-neutral-700 relative">
                          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-xl bg-neutral-800 border border-neutral-700 mb-5 flex items-center justify-center">
                          <span className="text-neutral-500 text-xs font-medium px-2">NO_IMAGE</span>
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col">
                        <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{p.name}</h4>
                        <p className="text-sm font-medium text-neutral-400 mb-4 line-clamp-2">{p.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {p.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="bg-neutral-800 text-neutral-300 text-[10px] px-2 py-1 rounded-md border border-neutral-700 uppercase tracking-wider font-semibold">
                              {tech}
                            </span>
                          ))}
                          {p.techStack.length > 3 && (
                            <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-1 rounded-md border border-neutral-700 font-semibold">
                              +{p.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-auto pt-4 border-t border-neutral-800 relative z-10">
                        <ShinyButton 
                          onClick={() => handleEdit(p)} 
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 !rounded-xl text-sm"
                        >
                          Edit
                        </ShinyButton>
                        <ShinyButton 
                          onClick={() => handleDelete(p.id)} 
                          className="flex-1 bg-red-950 hover:bg-red-900 text-red-100 border border-red-800 !rounded-xl text-sm"
                        >
                          Hapus
                        </ShinyButton>
                      </div>
                    </div>
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
        </div>

        {/* Section: CV Access Logs */}
        <div className="mt-16">
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
        </div>

        {/* Modal Overlay for Form */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-neutral-900 rounded-3xl border border-neutral-700 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              >
                <BorderBeam size={400} duration={10} delay={0} className="rounded-3xl" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      {editingId ? (
                        <><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Edit Proyek Ini</>
                      ) : (
                        <><span className="w-2.5 h-2.5 rounded-full bg-white"></span> Tambah Proyek Baru</>
                      )}
                    </h3>
                    <p className="text-neutral-400 text-sm mt-1 font-medium">Pastikan semua detail udah pas.</p>
                  </div>
                  <button 
                    onClick={resetForm}
                    className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors border border-neutral-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white uppercase tracking-wider">Project Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white uppercase tracking-wider">Metrics</label>
                      <input 
                        type="text" 
                        value={metrics} 
                        onChange={e => setMetrics(e.target.value)} 
                        required 
                        placeholder="e.g. 50+ users | High Perf."
                        className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider">Description</label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      required 
                      rows={3} 
                      className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider">Tech Stack</label>
                    <input 
                      type="text" 
                      value={techStack} 
                      onChange={e => setTechStack(e.target.value)} 
                      required 
                      placeholder="React, Tailwind, Node (comma separated)"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white uppercase tracking-wider">GitHub Link</label>
                      <input 
                        type="text" 
                        value={githubUrl} 
                        onChange={e => setGithubUrl(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-white uppercase tracking-wider">Image File</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 800;
                                const MAX_HEIGHT = 800;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                  if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                  }
                                } else {
                                  if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                  }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);
                                
                                // Compress to JPEG with 0.7 quality
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                setExistingImageUrl(dataUrl);
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200"
                      />
                      {existingImageUrl && existingImageUrl.startsWith('data:image') && (
                        <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-neutral-700">
                          <img src={existingImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-800">
                    <button 
                      type="button" 
                      onClick={resetForm} 
                      className="flex-1 h-12 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-sm font-bold tracking-wide transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <ShimmerButton 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 h-12 text-sm font-bold tracking-wide bg-white text-black"
                      shimmerColor="rgba(0,0,0,0.2)"
                      background="#ffffff"
                    >
                      <span className="text-neutral-900">{loading ? 'Processing...' : (editingId ? 'Save Changes' : 'Deploy Project')}</span>
                    </ShimmerButton>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Floating Mac-style Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max">
        <Dock>
          <DockIcon onClick={() => navigate('/')} className="hover:text-neutral-300 text-white" title="Lihat Web">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </DockIcon>
          <DockIcon onClick={() => setIsModalOpen(true)} className="hover:text-neutral-300 text-white" title="Tambah Proyek">
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
