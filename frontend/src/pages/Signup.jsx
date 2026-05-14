import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Welcome to GreenGuide! 🌿');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed.');
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    { key: 'name',     placeholder: 'John Doe',         type: 'text',     Icon: User, label: 'Full Name'        },
    { key: 'email',    placeholder: 'you@example.com',  type: 'email',    Icon: Mail, label: 'Email'            },
    { key: 'password', placeholder: '••••••••',          type: 'password', Icon: Lock, label: 'Password'         },
    { key: 'confirm',  placeholder: '••••••••',          type: 'password', Icon: Lock, label: 'Confirm Password' },
  ];

  const perks = [
    { icon: '🌱', text: 'Access eco tips and guides'           },
    { icon: '♻️', text: 'Learn what can be recycled'           },
    { icon: '🌍', text: 'Help make South Africa greener'       },
    { icon: '💡', text: 'Get sustainability insights'          },
  ];

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
           style={{ background: 'linear-gradient(145deg, #020c06 0%, #052e16 40%, #064e3b 100%)' }}>

        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: `linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} />

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: '#10b981' }} />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 border"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.1))',
              borderColor: 'rgba(16,185,129,0.3)',
              boxShadow: '0 0 60px rgba(16,185,129,0.2)',
            }}>
            <Leaf size={36} style={{ color: '#34d399' }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-3">
            Why join <span style={{ color: '#34d399' }}>GreenGuide?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-sm mb-8 max-w-xs">
            Join thousands of South Africans making a difference every day.
          </motion.p>

          <div className="space-y-3">
            {perks.map((perk, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: 'rgba(16,185,129,0.06)',
                  borderColor: 'rgba(16,185,129,0.12)',
                }}>
                <span className="text-lg">{perk.icon}</span>
                <span className="text-white/60 text-sm">{perk.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
           style={{ background: '#030f07' }}>
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>

            <div className="flex items-center gap-2 mb-10 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">Green<span style={{ color: '#34d399' }}>Guide</span></span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
            <p className="text-white/30 text-sm mb-8">Start your green journey today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ key, placeholder, type, Icon, label }, i) => (
                <motion.div key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-2"
                         style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                         style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <input type={type} required placeholder={placeholder} value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#10b981' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; e.target.style.background = 'rgba(16,185,129,0.05)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                    />
                  </div>
                </motion.div>
              ))}

              <motion.button
                type="submit" disabled={busy}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}>
                {busy ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                ) : (<> Join GreenGuide <ArrowRight size={15} /> </>)}
              </motion.button>
            </form>

            <p className="text-center text-white/25 text-sm mt-8">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#34d399' }} className="font-medium hover:text-emerald-300 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
