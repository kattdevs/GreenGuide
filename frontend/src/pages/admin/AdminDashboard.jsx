import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemsService } from '../../services/items.service.js';
import { usersService } from '../../services/users.service.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ items: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([itemsService.getAll(), usersService.getAll()])
      .then(([itemsRes, usersRes]) =>
        setStats({ items: itemsRes.data.length, users: usersRes.data.length }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #14532D, #16A34A)'}}
           className="rounded-3xl p-8 mb-8 text-white">
        <div className="text-4xl mb-2">🌿</div>
        <h1 className="text-2xl font-bold">GreenGuide Admin Panel</h1>
        <p className="text-green-200 mt-1">Welcome back, {user?.name}. Manage your content below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
               style={{backgroundColor: '#DCFCE7'}}>♻️</div>
          <div>
            <p className="text-gray-500 text-sm">Total Tips & Items</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '…' : stats.items}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
               style={{backgroundColor: '#DCFCE7'}}>👥</div>
          <div>
            <p className="text-gray-500 text-sm">Registered Users</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '…' : stats.users}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/items"
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-bold text-gray-900 text-base">Manage Tips & Items</h3>
          <p className="text-gray-500 text-sm mt-1">Add, edit or remove eco tips and recyclable item guides.</p>
          <p className="text-xs font-semibold mt-3 group-hover:underline" style={{color: '#16A34A'}}>Go to items →</p>
        </Link>
        <Link to="/admin/users"
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold text-gray-900 text-base">Manage Users</h3>
          <p className="text-gray-500 text-sm mt-1">View registered users and manage their access roles.</p>
          <p className="text-xs font-semibold mt-3 group-hover:underline" style={{color: '#16A34A'}}>Go to users →</p>
        </Link>
      </div>
    </div>
  );
}
