import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed.");
    } finally {
      setBusy(false);
    }
  }
   return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold">Welcome back</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm font-medium block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-white/80 text-sm font-medium block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-white text-brand-700 font-semibold py-3 rounded-xl hover:bg-brand-50 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
