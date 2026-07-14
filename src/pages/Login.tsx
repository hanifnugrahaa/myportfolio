import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ShimmerButton } from '../components/magicui/shimmer-button';
import { RetroGrid } from '../components/magicui/retro-grid';
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
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 overflow-hidden selection:bg-white/20">
      
      <RetroGrid className="z-0 opacity-20 mix-blend-screen" angle={60} cellSize={50} lightLineColor="#ffffff" darkLineColor="#ffffff" />

      {/* Solid Minimalist Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl p-px bg-neutral-800 shadow-2xl">
          <form onSubmit={handleLogin} className="relative z-10 p-8 sm:p-10 flex flex-col gap-6 bg-neutral-900 rounded-3xl">
            
            <div className="text-center mb-4">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Admin Workspace
              </h2>
              <p className="text-neutral-300 text-sm mt-2 font-medium">Exclusive access. Kendali penuh di tanganmu.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm p-3 bg-red-950 border border-red-500 rounded-lg text-center font-medium"
              >
                {error}
              </motion.div>
            )}
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white ml-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="nama@email.com"
                  className="w-full px-5 py-4 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white ml-1">Kata Sandi</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>
            </div>

            <div className="mt-6">
              <ShimmerButton 
                type="submit" 
                className="w-full text-lg font-bold tracking-wide h-14 bg-white text-black"
                shimmerColor="rgba(0,0,0,0.2)"
                background="#ffffff"
                disabled={loading}
              >
                <span className="text-neutral-900">{loading ? 'Processing...' : 'Secure Login'}</span>
              </ShimmerButton>
            </div>
            
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 text-neutral-400 hover:text-white text-sm text-center transition-colors font-medium underline-offset-4 hover:underline"
            >
              Kembali ke Beranda
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
