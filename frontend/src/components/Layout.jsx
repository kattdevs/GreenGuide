import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #020c06 0%, #041a0e 50%, #020c06 100%)', minHeight: '100vh' }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
             style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
             style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          background: 'rgba(2, 12, 6, 0.8)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
        }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <Leaf size={18} className="text-white" />
            </motion.div>
            <span className="font-bold text-lg text-white tracking-tight">
              Green<span style={{ color: '#34d399' }}>Guide</span>
            </span>
          </NavLink>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[{ to: '/', label: 'Browse' },
              ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: LayoutDashboard }] : [])
            ].map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                   ${isActive ? 'text-emerald-400' : 'text-white/50 hover:text-white'}`}>
                {({ isActive }) => (
                  <>
                    {Icon && <Icon size={14} />}
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(16,185,129,0.15)',
              }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                   style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white/80 text-sm font-medium hidden sm:block">{user?.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                    style={{
                      background: user?.role === 'admin' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                      color: user?.role === 'admin' ? '#34d399' : '#94a3b8',
                    }}>
                {user?.role}
              </span>
              <ChevronDown size={14} className="text-white/40" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl p-1 border shadow-2xl z-50"
                  style={{
                    background: 'rgba(4,26,14,0.95)',
                    backdropFilter: 'blur(24px)',
                    borderColor: 'rgba(16,185,129,0.15)',
                  }}>
                  <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
                    <p className="text-xs text-white/40">Signed in as</p>
                    <p className="text-sm font-medium text-white/80 truncate">{user?.email}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={14} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Main */}
      <main className="relative z-10 pt-24 px-4 pb-12 max-w-7xl mx-auto w-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t"
              style={{ borderColor: 'rgba(16,185,129,0.08)' }}>
        <p className="text-white/20 text-xs">🌍 GreenGuide — Making South Africa greener, one tip at a time.</p>
      </footer>
    </div>
  );
}