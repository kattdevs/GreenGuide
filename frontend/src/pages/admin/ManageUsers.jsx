import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usersService } from "../../services/users.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  function fetchUsers() {
    setLoading(true);
    usersService
      .getAll()
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  }
  useEffect(fetchUsers, []);
  async function toggleRole(u) {
    if (u.id === currentUser.id)
      return toast.error("You can't change your own role.");
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await usersService.updateRole(u.id, newRole);
      toast.success(`${u.name} is now a ${newRole}.`);
      fetchUsers();
    } catch {
      toast.error("Failed to update role.");
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage Users</h1>
      <p className="text-slate-500 text-sm mb-6">
        {users.length} registered users
      </p>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Name", "Email", "Role", "Joined", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {u.name}
                    {u.id === currentUser.id && (
                      <span className="ml-2 text-xs text-brand-500">(you)</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
${
  u.role === "admin"
    ? "bg-brand-50 text-brand-700"
    : "bg-slate-100 text-slate-600"
}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={u.id === currentUser.id}
                      className="text-brand-600 hover:text-brand-700 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Make {u.role === "admin" ? "User" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
