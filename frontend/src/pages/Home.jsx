import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { itemsService } from "../services/items.service.js";
export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    itemsService
      .getAll()
      .then(({ data }) => setItems(data))
      .catch(() => toast.error("Failed to load items."))
      .finally(() => setLoading(false));
  }, []);
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Items</h1>
        <p className="text-slate-500 mt-1">
          Explore all available items in the catalogue.
        </p>
      </div>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-8"
      />
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <p className="text-slate-400 text-center py-20">No items found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-4xl">
                &#128230;
              </div>
            )}
            <div className="p-5">
              <span className="text-xs bg-brand-50 text-brand-600 font-medium px-2.5 py-1 rounded-full">
                {item.category || "General"}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900 text-lg leading-tight">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
