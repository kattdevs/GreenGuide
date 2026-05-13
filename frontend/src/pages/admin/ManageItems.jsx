import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil, Trash2, Leaf } from 'lucide-react';
import { itemsService } from '../../services/items.service.js';

const EMPTY = { title: '', description: '', category: 'Eco Tips', image_url: '' };
const CATEGORIES = ['Eco Tips', 'Recyclable Items', 'General'];

const inputClass = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(16,185,129,0.12)',
  color: 'white',
  caretColor: '#10b981',
};

export default function ManageItems() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busy,      setBusy]      = useState(false);

  function fetchItems() {
    setLoading(true);
    itemsService.getAll()
      .then(({ data }) => setItems(data))
      .catch(() => toast.error('Failed to load items.'))
      .finally(() => setLoading(false));
  }
  useEffect(fetchItems, []);

  function openCreate() { setForm(EMPTY); setEditingId(null); setShowModal(true); }
  function openEdit(item) {
    setForm({ title: item.title, description: item.description || '',
              category: item.category || 'Eco Tips', image_url: item.image_url || '' });
    setEditingId(item.id);
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required.');
    setBusy(true);
    try {
      if (editingId) { await itemsService.update(editingId, form); toast.success('Item updated!'); }
      else           { await itemsService.create(form);            toast.success('Item created!'); }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save.');
    } finally { setBusy(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try { await itemsService.delete(id); toast.success('Deleted.'); fetchItems(); }
    catch { toast.error('Delete failed.'); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tips & Items</h1>
          <p className="text-white/30 text-sm mt-0.5">{items.length} items published</p>
        </div>
        <motion.button onClick={openCreate}
          whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
          <Plus size={16} /> Add New Item
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-3xl p-7 border"
              style={{
                background: 'rgba(4,26,14,0.95)',
                backdropFilter: 'blur(32px)',
                borderColor: 'rgba(16,185,129,0.2)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Item' : 'New Eco Tip'}</h2>
                <motion.button onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  <X size={16} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'title',     label: 'Title *',   placeholder: 'e.g. How to Compost at Home',   type: 'text' },
                  { key: 'image_url', label: 'Image URL', placeholder: 'https://images.unsplash.com/…', type: 'url'  },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                           style={{ color: 'rgba(255,255,255,0.3)' }}>{f.label}</label>
                    <input type={f.type} required={f.key === 'title'} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={inputClass}
                      onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.12)'}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                         style={{ color: 'rgba(255,255,255,0.3)' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                    style={{ ...inputClass, background: 'rgba(4,26,14,0.9)' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#041a0e' }}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                         style={{ color: 'rgba(255,255,255,0.3)' }}>Description</label>
                  <textarea rows={4} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the tip in detail…"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                    style={inputClass}
                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.12)'}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <motion.button type="submit" disabled={busy}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.25)' }}>
                    {busy ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                    ) : 'Save Item'}
                  </motion.button>
                  <motion.button type="button" onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl text-white/50 font-semibold text-sm transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden border"
        style={{ background: 'rgba(4,26,14,0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(16,185,129,0.1)' }}>
        {loading ? (
          <div className="p-12 text-center text-white/30">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center">
            <Leaf size={48} className="mx-auto mb-3 opacity-20" style={{ color: '#10b981' }} />
            <p className="text-white/30 font-medium">No items yet</p>
            <p className="text-white/15 text-sm mt-1">Click "Add New Item" to get started</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
                {['Title', 'Category', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4"
                      style={{ color: 'rgba(255,255,255,0.2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.tr key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.04 }}
                    className="group transition-colors"
                    style={{ borderBottom: '1px solid rgba(16,185,129,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-6 py-4 font-medium text-white/80">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button onClick={() => openEdit(item)}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                          <Pencil size={13} />
                        </motion.button>
                        <motion.button onClick={() => handleDelete(item.id)}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
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