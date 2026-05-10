import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match.");
    if (form.password.length < 8)
      return toast.error("Password must be at least 8 characters.");
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success("Account created! Welcome aboard.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed.");
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    { key: "name", label: "Full Name", type: "text", ph: "John Doe" },
    { key: "email", label: "Email", type: "email", ph: "you@example.com" },
    { key: "password", label: "Password", type: "password", ph: "••••••••" },
    {
      key: "confirm",
      label: "Confirm Password",
      type: "password",
      ph: "••••••••",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold">Create an account</h1>
          <p className="text-white/60 text-sm mt-1">Join us today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type, ph }) => (
            <div key={key}>
              <label className="text-white/80 text-sm font-medium block mb-1">
                {label}
              </label>
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder={ph}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-white text-brand-700 font-semibold py-3 rounded-xl hover:bg-brand-50 transition disabled:opacity-50 mt-2"
          >
            {busy ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="text-center text-white/60 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
