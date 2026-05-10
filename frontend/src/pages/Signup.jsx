import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Welcome to GreenGuide!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #14532D 0%, #16A34A 50%, #22C55E 100%)'}}
         className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-white text-3xl font-bold">GreenGuide</h1>
          <p className="text-green-200 text-sm mt-2">Join the green movement</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-gray-800 text-xl font-bold mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',     label: 'Full Name',        type: 'text',     ph: 'John Doe'       },
              { key: 'email',    label: 'Email',            type: 'email',    ph: 'you@example.com'},
              { key: 'password', label: 'Password',         type: 'password', ph: '••••••••'        },
              { key: 'confirm',  label: 'Confirm Password', type: 'password', ph: '••••••••'        },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="text-gray-700 text-sm font-medium block mb-1">{label}</label>
                <input type={type} required value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder={ph} />
              </div>
            ))}
            <button type="submit" disabled={busy}
              style={{backgroundColor: '#16A34A'}}
              className="w-full text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-2">
              {busy ? 'Creating account…' : 'Join GreenGuide'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" style={{color: '#16A34A'}} className="font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
