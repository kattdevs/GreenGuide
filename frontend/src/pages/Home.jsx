import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { itemsService } from '../services/items.service.js';

const CATEGORY_ICONS = {
  'Eco Tips':        '💡',
  'Recyclable Items':'♻️',
  'General':         '🌍',
};

export default function Home() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    itemsService.getAll()
      .then(({ data }) => setItems(data))
      .catch(() => toast.error('Failed to load tips.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || item.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Hero */}
      <div style={{background: 'linear-gradient(135deg, #14532D, #16A34A)'}}
           className="rounded-3xl p-10 mb-8 text-white text-center">
        <div className="text-5xl mb-3">🌍</div>
        <h1 className="text-3xl font-bold mb-2">Welcome to GreenGuide</h1>
        <p className="text-green-100 text-base max-w-xl mx-auto">
          Discover eco-friendly tips and learn what you can recycle to help make South Africa greener.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="🔍  Search tips and recyclables..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 bg-white shadow-sm" />
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={category === cat ? {backgroundColor: '#16A34A', color: 'white'} : {}}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition
                ${category === cat ? 'border-transparent' : 'border-gray-200 bg-white text-gray-600 hover:border-green-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
          <span className="text-xl">♻️</span>
          <div>
            <p className="text-xs text-gray-500">Total Tips</p>
            <p className="font-bold text-gray-800">{items.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <div>
            <p className="text-xs text-gray-500">Showing</p>
            <p className="font-bold text-gray-800">{filtered.length}</p>
          </div>
        </div>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse shadow-sm" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-400 text-lg">No results found.</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search or category.</p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <Link key={item.id} to={`/items/${item.id}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
            {item.image_url
              ? <img src={item.image_url} alt={item.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              : <div className="w-full h-44 flex items-center justify-center text-5xl"
                     style={{background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)'}}>
                  {CATEGORY_ICONS[item.category] || '🌿'}
                </div>
            }
            <div className="p-5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{backgroundColor: '#DCFCE7', color: '#15803D'}}>
                {CATEGORY_ICONS[item.category] || '🌿'} {item.category || 'General'}
              </span>
              <h3 className="mt-3 font-bold text-gray-900 text-base leading-tight">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
              <p className="text-xs mt-3 font-semibold" style={{color: '#16A34A'}}>Read more →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}