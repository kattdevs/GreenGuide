import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Leaf, Recycle, Globe, Zap, ArrowRight, Filter } from 'lucide-react';
import { itemsService } from '../services/items.service.js';

const CATEGORIES = {
  'Eco Tips':        { icon: Zap,     color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  'Recyclable Items':{ icon: Recycle, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.2)'  },
  'General':         { icon: Globe,   color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)', border: 'rgba(110,231,183,0.2)' },
};

function ItemCard({ item, index }) {
  const cat = CATEGORIES[item.category] || CATEGORIES['General'];
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}>
      <Link to={`/items/${item.id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative h-full rounded-2xl overflow-hidden border"
          style={{
            background: 'rgba(4,26,14,0.6)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(16,185,129,0.12)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>

          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
               style={{ boxShadow: `inset 0 0 60px ${cat.color}18` }} />

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {item.image_url ? (
              <motion.img
                src={item.image_url} alt={item.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl"
                   style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)` }}>
                <Icon size={48} style={{ color: cat.color, opacity: 0.5 }} />
              </div>
            )}
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(to top, rgba(2,12,6,0.8) 0%, transparent 60%)' }} />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm"
                style={{ background: 'rgba(2,12,6,0.8)', color: cat.color, borderColor: `${cat.color}40` }}>
                <Icon size={10} />
                {item.category || 'General'}
              </motion.span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-emerald-300 transition-colors duration-200">
              {item.title}
            </h3>
            <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
                 style={{ color: cat.color }}>
              Read more
              <motion.span
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                <ArrowRight size={12} />
              </motion.span>
            </div>
          </div>

          {/* Bottom border glow on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative rounded-3xl overflow-hidden mb-10 p-12 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(4,26,14,0.9) 0%, rgba(6,55,37,0.8) 50%, rgba(4,26,14,0.9) 100%)', border: '1px solid rgba(16,185,129,0.15)' }}>

        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ background: '#10b981' }} />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl"
            style={{ background: '#14b8a6' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', borderColor: 'rgba(16,185,129,0.2)' }}>
            <Leaf size={12} />
            Making South Africa Greener
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Welcome to{' '}
            <span style={{ background: 'linear-gradient(135deg, #34d399, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GreenGuide
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Discover eco-friendly tips and learn what you can recycle to build a more sustainable future for South Africa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center gap-8 mt-10">
            {[
              { icon: '🌱', label: 'Eco Tips',     value: items.filter(i => i.category === 'Eco Tips').length        },
              { icon: '♻️', label: 'Recyclables',  value: items.filter(i => i.category === 'Recyclable Items').length },
              { icon: '🌍', label: 'Total Guides', value: items.length                                               },
            ].map(({ icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-white/30 text-xs font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.25)' }} />
          <input type="text" placeholder="Search tips and recyclables..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
            style={{
              background: 'rgba(4,26,14,0.8)',
              border: '1px solid rgba(16,185,129,0.12)',
              backdropFilter: 'blur(12px)',
              caretColor: '#10b981',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.12)'}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
          {categories.map(cat => (
            <motion.button key={cat} onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-3 rounded-xl text-sm font-medium border transition-all"
              style={category === cat
                ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }
                : { background: 'rgba(4,26,14,0.6)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(16,185,129,0.1)' }}>
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
              className="rounded-2xl h-72 border"
              style={{ background: 'rgba(4,26,14,0.6)', borderColor: 'rgba(16,185,129,0.08)' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-24">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-white/50 text-lg font-medium">No results found</p>
            <p className="text-white/25 text-sm mt-1">Try a different search or category</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}