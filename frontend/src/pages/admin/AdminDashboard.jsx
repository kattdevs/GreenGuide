import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Users, ArrowRight, BarChart3, Shield } from 'lucide-react';
import { itemsService } from '../../services/items.service.js';
import { usersService } from '../../services/users.service.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ items: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([itemsService.getAll(), usersService.getAll()])
      .then(([i, u]) => setStats({ items: i.data.length, users: u.data.length }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-8 mb-8 border"
        style={{
          background: 'linear-gradient(135deg, rgba(4,26,14,0.9), rgba(6,55,37,0.8))',
          borderColor: 'rgba(16,185,129,0.15)',
        }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
             style={{ background: '#10b981' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
                 style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', borderColor: 'rgba(16,185,129,0.2)' }}>
              <Shield size={11} />
              Admin Panel
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name} 👋</h1>
            <p className="text-white/40 text-sm mt-1">Manage GreenGuide content and users.</p>
          </div>
          <div className="opacity-10">
            <Leaf size={80} style={{ color: '#10b981' }} />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {[
          { icon: Leaf,  label: 'Tips & Items',    value: stats.items, link: '/admin/items', color: '#10b981' },
          { icon: Users, label: 'Registered Users', value: stats.users, link: '/admin/users', color: '#14b8a6' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <Link to={s.link}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="rounded-2xl p-6 border flex items-center gap-5 cursor-pointer group"
                style={{
                  background: 'rgba(4,26,14,0.7)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(16,185,129,0.12)',
                }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                     style={{ background: `${s.color}15`, borderColor: `${s.color}25` }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-sm">{s.label}</p>
                  <p className="text-3xl font-bold text-white mt-0.5">{loading ? '—' : s.value}</p>
                </div>
                <ArrowRight size={18} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <p className="text-white/20 text-xs font-semibold uppercase tracking-widest mb-4">Quick Actions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { to: '/admin/items', icon: BarChart3, title: 'Manage Tips & Items', desc: 'Add, edit or remove eco tips and recyclable guides.', color: '#10b981' },
          { to: '/admin/users', icon: Users,     title: 'Manage Users',        desc: 'View all users and manage their access roles.',     color: '#14b8a6' },
        ].map((a, i) => (
          <motion.div key={a.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <Link to={a.to}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="rounded-2xl p-6 border group cursor-pointer"
                style={{
                  background: 'rgba(4,26,14,0.5)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(16,185,129,0.1)',
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                     style={{ background: `${a.color}12`, borderColor: `${a.color}25` }}>
                  <a.icon size={18} style={{ color: a.color }} />
                </div>
                <h3 className="font-bold text-white text-base">{a.title}</h3>
                <p className="text-white/30 text-sm mt-1 leading-relaxed">{a.desc}</p>
                <p className="text-xs font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all"
                   style={{ color: a.color }}>
                  Open <ArrowRight size={11} />
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
