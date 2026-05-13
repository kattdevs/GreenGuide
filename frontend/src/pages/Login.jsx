import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

function VideoBackground({ videoUrl }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 z-10"
           style={{ background: 'linear-gradient(135deg, rgba(2,12,6,0.85) 0%, rgba(4,26,14,0.75) 100%)' }} />
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🌿`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <VideoBackground videoUrl="https://wkzboknhkqskyibhlrva.supabase.co/storage/v1/object/public/assets/48873-457671829_tiny.mp4" />

      {/* Glow orbs */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
             style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
             style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
      </div>

      <div className="relative z-20 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}>

          {/* Glow behind card */}
          <div className="absolute -inset-px rounded-3xl blur-xl opacity-40"
               style={{ background: 'linear-gradient(135deg, #10b981, #059669, #14b8a6)' }} />

          <div className="relative rounded-3xl p-8 border"
               style={{
                 background: 'rgba(2,12,6,0.7)',
                 backdropFilter: 'blur(32px)',
                 borderColor: 'rgba(16,185,129,0.2)',
               }}>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border"
                   style={{
                     background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
                     borderColor: 'rgba(16,185,129,0.3)',
                     boxShadow: '0 0 30px rgba(16,185,129,0.2)',
                   }}>
                <Leaf size={28} style={{ color: '#34d399' }} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Green<span style={{ color: '#34d399' }}>Guide</span>
              </h1>
              <p className="text-white/40 text-sm mt-2">Your guide to a greener life</p>
              <div className="flex justify-center gap-3 mt-3 text-base">
                <span>🌍</span><span>♻️</span><span>🌱</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-4">

              {/* Email */}
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" required placeholder="Email address" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    caretColor: '#10b981',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type={showPassword ? 'text' : 'password'} required placeholder="Password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    caretColor: '#10b981',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={busy}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
                }}>
                {busy ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <> Sign In <ArrowRight size={16} /> </>
                )}
              </motion.button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white/30 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium transition-colors hover:text-emerald-300"
                    style={{ color: '#34d399' }}>
                Create account
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}