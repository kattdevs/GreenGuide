import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav style={{backgroundColor: '#14532D'}} className="text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-xl text-green-100">GreenGuide</span>
          </div>
          <div className="flex items-center gap-6">
            <NavLink to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-green-300' : 'text-green-100 hover:text-white'}`}>
              Browse
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin"
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-green-300' : 'text-green-100 hover:text-white'}`}>
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-200">
            {user?.name}
            <span style={{backgroundColor: '#16A34A'}} className="ml-2 text-white text-xs px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </span>
          <button onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition border border-white/20">
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer style={{backgroundColor: '#14532D'}} className="text-center text-xs text-green-300 py-4">
        🌍 GreenGuide — Making South Africa greener, one tip at a time.
      </footer>
    </div>
  );
}
