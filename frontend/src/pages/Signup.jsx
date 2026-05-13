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
    { key: 'name',     placeholder: 'Full name',        type: 'text',     Icon: User },
    { key: 'email',    placeholder: 'Email address',    type: 'email',    Icon: Mail },
    { key: 'password', placeholder: 'Password',         type: 'password', Icon: Lock },
    { key: 'confirm',  placeholder: 'Confirm password', type: 'password', Icon: Lock },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: 'linear-gradient(135deg, #020c06 0%, #041a0e 50%, #020c06 100%)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-15"
             style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10"
             style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}>

          <div className="absolute -inset-px rounded-3xl blur-xl opacity-30"
               style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} />

          <div className="relative rounded-3xl p-8 border"
               style={{
                 background: 'rgba(2,12,6,0.8)',
                 backdropFilter: 'blur(32px)',
                 borderColor: 'rgba(16,185,129,0.15)',
               }}>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border"
                   style={{
                     background: 'rgba(16,185,129,0.1)',
                     borderColor: 'rgba(16,185,129,0.25)',
                     boxShadow: '0 0 30px rgba(16,185,129,0.15)',
                   }}>
                <Leaf size={28} style={{ color: '#34d399' }} />
              </div>
              <h1 className="text-3xl font-bold text-white">Join <span style={{ color: '#34d399' }}>GreenGuide</span></h1>
              <p className="text-white/40 text-sm mt-2">Start your green journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(({ key, placeholder, type, Icon }, i) => (
                <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }} className="relative">
                  <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                       style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <input type={type} required placeholder={placeholder} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      caretColor: '#10b981',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
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
                ) : (
                  <> Join GreenGuide <ArrowRight size={16} /> </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-white/30 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#34d399' }} className="font-medium hover:text-emerald-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
