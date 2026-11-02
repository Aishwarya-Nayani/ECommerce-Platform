import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Heart, Sparkles } from 'lucide-react';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      if (isRegister) {
        const res = await API.post('/auth/register', { fullName, email, password });
        if (res.data.token) {
          login(res.data);
          navigate('/products');
        } else {
          setEmail(res.data.email || email);
          setMessage('Your account is ready. Sign in to start exploring.');
          navigate('/login', { replace: true });
        }
      } else {
        const res = await API.post('/auth/login', { email, password });
        login(res.data);
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegister
        ? 'We couldn’t create your account. Please check your details and try again.'
        : 'Login failed. Check your credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7.25rem)] bg-[#fbf9f7] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid min-h-[620px] max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(74,34,37,0.12)] md:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-[var(--color-cherry)] md:block">
          <img
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85"
            alt="A warm, sunlit collection of home essentials"
            className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cherry)]/95 via-[var(--color-cherry)]/70 to-[#291015]/90" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white lg:p-12">
            <Link to="/products" className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to the collection
            </Link>
            <div className="py-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> The Pulse community
              </span>
              <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.035em] lg:text-5xl">
                Good things<br />are better<br /><span className="italic text-[#edc9c7]">shared.</span>
              </h1>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">
                {isRegister
                  ? 'Create an account and keep all your considered finds in one lovely place.'
                  : 'Welcome back. Your next everyday favourite is waiting to be found.'}
              </p>
            </div>
            <p className="flex items-center gap-2 text-xs text-white/70">
              Made for everyday living <Heart className="h-3.5 w-3.5 fill-[#edc9c7] text-[#edc9c7]" />
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-sm">
            <Link to="/products" className="mb-9 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-[var(--color-cherry)] md:hidden">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to the collection
            </Link>
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-rose)] text-[var(--color-cherry)]">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cherry)]">
              {isRegister ? 'Your own little corner' : 'A lovely welcome back'}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">
              {isRegister ? 'Create an account' : 'Sign in'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isRegister
                ? 'Join us and make room for a few good things.'
                : 'Sign in to pick up right where you left off.'}
            </p>

            {message && (
              <div role="status" className="mt-5 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <Check className="mt-0.5 h-4 w-4 shrink-0" /> {message}
              </div>
            )}
            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-slate-700">Your name</label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="How should we call you?"
                    className="h-12 w-full rounded-xl border border-[#e9e1dd] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-cherry)] focus:ring-4 focus:ring-[var(--color-rose)]"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[#e9e1dd] bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-cherry)] focus:ring-4 focus:ring-[var(--color-rose)]"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#e9e1dd] bg-white px-4 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-cherry)] focus:ring-4 focus:ring-[var(--color-rose)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-[var(--color-cherry)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-cherry)] text-sm font-semibold text-white shadow-lg shadow-[var(--color-cherry)]/15 transition hover:-translate-y-0.5 hover:bg-[var(--color-cherry-light)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'One moment…' : isRegister ? 'Create my account' : 'Sign in'}
                {!submitting && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              New to Pulse?{' '}
              <Link to="/register" className="font-semibold text-[var(--color-cherry)] underline decoration-[var(--color-cherry)]/30 underline-offset-4 transition hover:decoration-[var(--color-cherry)]">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
