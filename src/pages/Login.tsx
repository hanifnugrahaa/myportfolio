import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ShimmerButton } from '../components/magicui/shimmer-button';
import { RetroGrid } from '../components/magicui/retro-grid';
import { BorderBeam } from '../components/magicui/border-beam';
import { MagicCard } from '../components/magicui/magic-card';
import { WordPullUp } from '../components/magicui/word-pull-up';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 overflow-hidden selection:bg-white/20">
      <RetroGrid className="z-0 opacity-20 mix-blend-screen" angle={60} cellSize={50} lightLineColor="#ffffff" darkLineColor="#ffffff" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4 sm:px-0"
      >
        <MagicCard 
          className="relative overflow-hidden rounded-3xl bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 shadow-2xl"
          gradientColor="rgba(255,255,255,0.05)"
        >
          <BorderBeam size={250} duration={12} delay={9} colorFrom="#ffffff" colorTo="#a3a3a3" />
          
          <form onSubmit={handleLogin} className="relative z-10 p-8 sm:p-10 flex flex-col gap-6">
            <div className="text-center mb-2">
              <WordPullUp
                className="text-3xl font-extrabold text-white tracking-tight"
                words="Command Center"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-neutral-400 text-sm mt-3 font-medium"
              >
                Enter your credentials to access the secure portal.
              </motion.p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm p-3 bg-red-950/50 border border-red-500/50 backdrop-blur-md rounded-lg text-center font-medium"
              >
                {error}
              </motion.div>
            )}
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="admin@system.local"
                  className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider ml-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <ShimmerButton 
                type="submit" 
                className="w-full text-sm font-bold tracking-widest uppercase h-14 bg-white text-black"
                shimmerColor="rgba(0,0,0,0.2)"
                background="#ffffff"
                disabled={loading}
              >
                <span className="text-neutral-900">{loading ? 'Authenticating...' : 'Authorize Access'}</span>
              </ShimmerButton>
            </div>
            
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 text-neutral-500 hover:text-white text-sm text-center transition-colors font-medium underline-offset-4 hover:underline"
            >
              Return to Public Site
            </button>
          </form>
        </MagicCard>
      </motion.div>
    </div>
  );
};

export default Login;

