import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext.jsx';
import Login          from './pages/Login.jsx';
import Signup         from './pages/Signup.jsx';
import Home           from './pages/Home.jsx';
import ItemDetail     from './pages/ItemDetail.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageItems    from './pages/admin/ManageItems.jsx';
import ManageUsers    from './pages/admin/ManageUsers.jsx';
import Layout         from './components/Layout.jsx';
import NotFound       from './pages/NotFound.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen text-green-600 font-semibold">
      Loading GreenGuide…
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen text-green-600 font-semibold">
      Loading…
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"  element={<Login  />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/items" element={<AdminRoute><ManageItems /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
