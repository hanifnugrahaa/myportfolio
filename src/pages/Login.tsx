import { useRef, useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import styles from './Login.module.css';

const field = `${styles.field} mt-2 block w-full rounded-xl px-3.5 py-3 text-base text-white`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const navigate = useNavigate();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setError(false);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/admin', { replace: true });
    } catch {
      setError(true);
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <main className={`${styles.scene} grid min-h-dvh place-items-center px-4 py-8 text-white sm:px-8 sm:py-12`}>
      <div aria-hidden="true" className={styles.bubbles}>
        <span /><span /><span />
      </div>
      <div className="relative z-10 w-full max-w-[56rem]">
        <Link to="/" className={`${styles.back} mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium !text-slate-200 hover:!text-white`}>
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke portofolio
        </Link>

        <div className={`${styles.shell} grid overflow-hidden rounded-[1.75rem] md:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)]`}>
          <div className={`${styles.identity} relative flex min-w-0 items-end overflow-hidden px-6 py-6 sm:px-9 md:py-10`}>
            <p className={`${styles.heading} relative z-10 text-2xl leading-[.95] font-semibold tracking-tight md:text-6xl`}>Hanif Nugraha</p>
          </div>
          <section aria-labelledby="login-heading" className={`${styles.formPane} flex min-w-0 flex-col justify-center px-5 py-8 sm:px-9 sm:py-10`}>
            <header className="mb-7">
              <h1 id="login-heading" className={`${styles.heading} text-3xl font-semibold tracking-tight sm:text-4xl`}>Masuk ke dashboard</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Selamat datang kembali, Hanif.</p>
            </header>

            <form onSubmit={handleLogin} aria-busy={loading} className="grid gap-5">
              <div>
                <label htmlFor="login-email" className="text-sm font-medium text-neutral-200">Email</label>
                <input id="login-email" name="email" type="email" value={email} onChange={event => setEmail(event.target.value)}
                  autoComplete="username" spellCheck={false} required className={field} />
              </div>

              <div>
                <label htmlFor="login-password" className="text-sm font-medium text-neutral-200">Kata sandi</label>
                <div className="relative">
                  <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={event => setPassword(event.target.value)} autoComplete="current-password" required className={`${field} pr-12`} />
                  <button type="button" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-controls="login-password" onClick={() => setShowPassword(visible => !visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-slate-300 hover:text-white">
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-red-900 bg-red-950/45 px-3.5 py-2.5 text-sm text-red-200">
                  Gagal masuk. Periksa email dan kata sandi, lalu coba lagi.
                </p>
              )}

              <button type="submit" disabled={loading}
                className={`${styles.submit} flex min-h-12 items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60`}>
                {loading ? 'Sedang masuk...' : 'Masuk'}
                {!loading && <ArrowRight size={16} aria-hidden="true" />}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
