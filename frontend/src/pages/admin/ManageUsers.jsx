import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User } from 'lucide-react';
import { usersService } from '../../services/users.service.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  function fetchUsers() {
    setLoading(true);
    usersService.getAll()
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false));
  }
  useEffect(fetchUsers, []);

  async function toggleRole(u) {
    if (u.id === currentUser.id) return toast.error("You can't change your own role.");
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await usersService.updateRole(u.id, newRole);
      toast.success(`${u.name} is now a ${newRole}.`);
      fetchUsers();
    } catch { toast.error('Failed to update role.'); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-white/30 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border"
        style={{ background: 'rgba(4,26,14,0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(16,185,129,0.1)' }}>
        {loading ? (
          <div className="p-12 text-center text-white/30">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                      style={{ color: 'rgba(255,255,255,0.2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((u, i) => (
                  <motion.tr key={u.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(16,185,129,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white/80">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="ml-1.5 text-xs" style={{ color: '#34d399' }}>(you)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/40 text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={u.role === 'admin'
                              ? { background: 'rgba(16,185,129,0.15)', color: '#34d399',  border: '1px solid rgba(16,185,129,0.25)' }
                              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button onClick={() => toggleRole(u)} disabled={u.id === currentUser.id}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                        Make {u.role === 'admin' ? 'User' : 'Admin'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
