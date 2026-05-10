import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { itemsService } from "../services/items.service.js";
export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    itemsService
      .getById(id)
      .then(({ data }) => setItem(data))
      .catch(() => toast.error("Item not found."))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return <div className="animate-pulse h-96 bg-white rounded-2xl" />;
  if (!item)
    return <p className="text-center text-slate-400 py-20">Item not found.</p>;
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="text-brand-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to Home
      </Link>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-72 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-6xl">
            &#128230;
          </div>
        )}
        <div className="p-8">
          <span className="text-xs bg-brand-50 text-brand-600 font-medium px-2.5 py-1 rounded-full">
            {item.category || "General"}
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">
            {item.title}
          </h1>
          <p className="text-slate-600 mt-4 leading-relaxed">
            {item.description || "No description provided."}
          </p>
          <p className="text-slate-400 text-xs mt-6">
            Added on {new Date(item.created_at).toLocaleDateString("en-ZA", {})}
          </p>
        </div>
      </div>
    </div>
  );
}
