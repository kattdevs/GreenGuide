import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Recycle, Globe, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const floatingItems = [
  { icon: '🌱', label: 'Plant a Tree',       top: '15%', left: '8%'  },
  { icon: '♻️', label: 'Recycle More',       top: '40%', left: '5%'  },
  { icon: '💧', label: 'Save Water',         top: '65%', left: '12%' },
  { icon: '⚡', label: 'Save Energy',        top: '80%', left: '6%'  },
  { icon: '🌍', label: 'Go Green',           top: '25%', right: '8%' },
  { icon: '🍃', label: 'Reduce Waste',       top: '55%', right: '5%' },
  { icon: '☀️', label: 'Solar Power',        top: '75%', right: '9%' },
];

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
    <div className="min-h-screen flex">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
           style={{ background: 'linear-gradient(145deg, #020c06 0%, #052e16 40%, #064e3b 100%)' }}>

        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} />

        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: '#10b981' }} />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: '#14b8a6' }} />

        {/* Floating eco badges */}
        {floatingItems.map((item, i) => (
          <motion.div key={i}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-white/60"
            style={{
              top: item.top, left: item.left, right: item.right,
              background: 'rgba(16,185,129,0.08)',
              borderColor: 'rgba(16,185,129,0.15)',
              backdropFilter: 'blur(8px)',
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.4 }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </motion.div>
        ))}

        {/* Center content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 border"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.1))',
              borderColor: 'rgba(16,185,129,0.3)',
              boxShadow: '0 0 60px rgba(16,185,129,0.2)',
            }}>
            <Leaf size={36} style={{ color: '#34d399' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-3 tracking-tight">
            Green<span style={{ color: '#34d399' }}>Guide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-base max-w-xs mx-auto leading-relaxed">
            Your guide to a greener, more sustainable life in South Africa.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-8 mt-10">
            {[
              { value: '10+', label: 'Eco Tips'    },
              { value: '5+',  label: 'Categories'  },
              { value: '100%',label: 'Free'         },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#34d399' }}>{s.value}</p>
                <p className="text-white/30 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
           style={{ background: '#030f07' }}>
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-10 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">Green<span style={{ color: '#34d399' }}>Guide</span></span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-white/30 text-sm mb-8">Sign in to your GreenGuide account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2"
                       style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <input type="email" required placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#10b981' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(16,185,129,0.05)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2"
                       style={{ color: 'rgba(255,255,255,0.3)' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#10b981' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(16,185,129,0.05)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit" disabled={busy}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}>
                {busy ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                ) : (<> Sign In <ArrowRight size={15} /> </>)}
              </motion.button>
            </form>

            <p className="text-center text-white/25 text-sm mt-8">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#34d399' }} className="font-medium hover:text-emerald-300 transition-colors">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}