// frontend/src/pages/Login.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

function VideoBackground({ videoUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Login() {
  const [form,          setForm]         = useState({ email: '', password: '' });
  const [showPassword,  setShowPassword] = useState(false);
  const [busy,          setBusy]         = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Video Background */}
      <VideoBackground videoUrl="https://wkzboknhkqskyibhlrva.supabase.co/storage/v1/object/public/assets/48873-457671829_tiny.mp4" />

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md">
        <div className="p-8 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-5xl mb-3">🌿</div>
            <h2 className="text-3xl font-bold text-white mb-2">GreenGuide</h2>
            <p className="text-white/70 text-sm flex flex-col items-center gap-1">
              <span>Your guide to a greener life</span>
              <span className="text-white/40 text-xs">Sign in to continue</span>
              <div className="flex gap-2 mt-1 text-sm">
                <span>🌍</span>
                <span>♻️</span>
                <span>🌱</span>
              </div>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                ✉
              </div>
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                🔒
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-green-500/20 hover:shadow-green-500/40 mt-2"
            >
              {busy ? 'Signing in…' : 'Sign In to GreenGuide'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-400 font-medium hover:text-green-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
