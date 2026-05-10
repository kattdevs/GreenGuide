import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-brand-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-6">
          <span className="font-bold text-xl text-brand-100">AppName</span>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? "text-brand-100" : "text-slate-300 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>
          {/* Admin link is only visible to admins */}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-brand-100"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            {user?.name}
            <span className="ml-2 bg-brand-500 text-white text-xs x-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Page content */}
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
        &copy; {new Date().getFullYear()} FullStack App
      </footer>
    </div>
  );
}
