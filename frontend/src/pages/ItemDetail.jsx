import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { itemsService } from '../services/items.service.js';

const CATEGORY_ICONS = {
  'Eco Tips':        '💡',
  'Recyclable Items':'♻️',
  'General':         '🌍',
};

export default function ItemDetail() {
  const { id } = useParams();
  const [item,    setItem]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemsService.getById(id)
      .then(({ data }) => setItem(data))
      .catch(() => toast.error('Could not load this tip.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-2xl shadow-sm" />;
  if (!item)   return <p className="text-center text-gray-400 py-20">Tip not found.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline"
            style={{color: '#16A34A'}}>
        ← Back to Browse
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {item.image_url
          ? <img src={item.image_url} alt={item.title} className="w-full h-72 object-cover" />
          : <div className="w-full h-72 flex items-center justify-center text-8xl"
                 style={{background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)'}}>
              {CATEGORY_ICONS[item.category] || '🌿'}
            </div>
        }
        <div className="p-8">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{backgroundColor: '#DCFCE7', color: '#15803D'}}>
            {CATEGORY_ICONS[item.category] || '🌿'} {item.category || 'General'}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-5 mb-4">{item.title}</h1>
          <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <p className="text-gray-400 text-xs">
              Added on {new Date(item.created_at).toLocaleDateString('en-ZA', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 rounded-2xl border border-green-100"
           style={{backgroundColor: '#F0FDF4'}}>
        <p className="text-sm font-semibold mb-1" style={{color: '#15803D'}}>
          🌍 Every small action counts
        </p>
        <p className="text-sm text-gray-500">
          Share this tip with a friend and help make South Africa greener.
        </p>
      </div>
    </div>
  );
}
