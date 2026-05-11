import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { itemsService } from '../../services/items.service.js';

const EMPTY = { title: '', description: '', category: 'Eco Tips', image_url: '' };
const CATEGORIES = ['Eco Tips', 'Recyclable Items', 'General'];

export default function ManageItems() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY);
  const [editingId,setEditingId]= useState(null);
  const [showModal,setShowModal]= useState(false);
  const [busy,     setBusy]     = useState(false);

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
      if (editingId) {
        await itemsService.update(editingId, form);
        toast.success('Item updated!');
      } else {
        await itemsService.create(form);
        toast.success('Item created!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save item.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await itemsService.delete(id);
      toast.success('Item deleted.');
      fetchItems();
    } catch { toast.error('Delete failed.'); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tips & Items</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} items published</p>
        </div>
        <button onClick={openCreate}
          style={{backgroundColor: '#16A34A'}}
          className="text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">
          + Add New Item
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Item' : 'New Eco Tip / Item'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                <input type="text" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2"
                  placeholder="e.g. How to Compost at Home" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                <select value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea rows={4} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 resize-none"
                  placeholder="Describe the tip or item in detail..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label>
                <input type="url" value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2"
                  placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={busy}
                  style={{backgroundColor: '#16A34A'}}
                  className="flex-1 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                  {busy ? 'Saving…' : 'Save Item'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-gray-400">No items yet. Click "+ Add New Item" to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Title', 'Category', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{item.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{backgroundColor: '#DCFCE7', color: '#15803D'}}>
                      {item.category || 'General'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 flex gap-3">
                    <button onClick={() => openEdit(item)}
                      className="text-sm font-medium hover:underline" style={{color: '#16A34A'}}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline">
                      Delete
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
