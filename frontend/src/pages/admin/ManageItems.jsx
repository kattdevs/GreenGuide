import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemsService } from "../../services/items.service.js";
const EMPTY_FORM = { title: "", description: "", category: "", image_url: "" };
export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  function fetchItems() {
    setLoading(true);
    itemsService
      .getAll()
      .then(({ data }) => setItems(data))
      .catch(() => toast.error("Failed to load items."))
      .finally(() => setLoading(false));
  }
  useEffect(fetchItems, []);
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  }
  function openEdit(item) {
    setForm({
      title: item.title,
      description: item.description || "",
      category: item.category || "",
      image_url: item.image_url || "",
    });
    setEditingId(item.id);
    setShowModal(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await itemsService.update(editingId, form);
        toast.success("Item updated.");
      } else {
        await itemsService.create(form);
        toast.success("Item created.");
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed.");
    } finally {
      setBusy(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await itemsService.delete(id);
      toast.success("Item deleted.");
      fetchItems();
    } catch {
      toast.error("Delete failed.");
    }
  }
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Items</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {items.length} items in catalogue
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          + New Item
        </button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              {editingId ? "Edit Item" : "New Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "title", label: "Title *", type: "text" },
                { key: "category", label: "Category", type: "text" },
                { key: "image_url", label: "Image URL", type: "url" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    required={key === "title"}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-focus:ring-brand-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No items yet. Click "+ New Item" to create one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Title", "Category", "Created", "Actions"].map((h) => (
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
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {item.title}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {item.category || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 flex gap-3">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600 font-medium hover:underline"
                    >
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
