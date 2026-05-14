import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Leaf, Recycle, Zap, Globe, ArrowRight, ArrowDown, Filter } from 'lucide-react';
import { itemsService } from '../services/items.service.js';

const BG_IMAGE = 'https://wkzboknhkqskyibhlrva.supabase.co/storage/v1/object/public/assets/daniel-angele-Joo3UBw789Q-unsplash.jpg';

const CATEGORIES = {
  'Eco Tips':         { icon: Zap,     color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)'  },
  'Recyclable Items': { icon: Recycle, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)'  },
  'General':          { icon: Globe,   color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)', border: 'rgba(110,231,183,0.2)' },
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
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative h-full rounded-2xl overflow-hidden border"
          style={{
            background: 'rgba(4,20,10,0.7)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(16,185,129,0.1)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
          }}>

          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
               style={{ boxShadow: `inset 0 0 60px ${cat.color}15` }} />

          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            {item.image_url ? (
              <motion.img src={item.image_url} alt={item.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: 'easeOut' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                   style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)` }}>
                <Icon size={48} style={{ color: cat.color, opacity: 0.4 }} />
              </div>
            )}
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(to top, rgba(2,12,6,0.85) 0%, transparent 60%)' }} />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm"
                    style={{ background: 'rgba(2,12,6,0.75)', color: cat.color, borderColor: `${cat.color}40` }}>
                <Icon size={10} /> {item.category || 'General'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h3>
            <p className="text-white/35 text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold" style={{ color: cat.color }}>
              Read more
              <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight size={12} />
              </motion.span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
  const heroRef = useRef(null);

  // Parallax
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale   = useTransform(scrollY, [0, 400], [1, 1.08]);

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

  function scrollToContent() {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">

        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: heroY, scale: heroScale }}>
          <img src={BG_IMAGE} alt="Green landscape"
               className="w-full h-full object-cover" />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to bottom, rgba(2,12,6,0.35) 0%, rgba(2,12,6,0.2) 40%, rgba(2,12,6,0.75) 85%, rgba(2,12,6,1) 100%)' }} />
        <div className="absolute inset-0"
             style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,12,6,0.4) 100%)' }} />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border backdrop-blur-sm"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', borderColor: 'rgba(16,185,129,0.25)' }}>
            <Leaf size={12} /> Making South Africa Greener
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-none">
            Live
            <span className="block" style={{
              background: 'linear-gradient(135deg, #34d399, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Greener.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed mb-10">
            Discover eco-friendly tips and learn what you can recycle to build a sustainable future.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center gap-6 mb-10">
            {[
              { value: items.length + '+', label: 'Guides'      },
              { value: '2',               label: 'Categories'  },
              { value: '100%',            label: 'Free'         },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center gap-3">
            <motion.button onClick={scrollToContent}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}>
              Explore Tips <ArrowRight size={15} />
            </motion.button>
            <motion.button onClick={scrollToContent}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm border backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}>
              Learn to Recycle
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToContent}>
          <p className="text-white/30 text-xs font-medium tracking-widest uppercase">Scroll</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
            <ArrowDown size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </motion.div>
        </motion.div>

        {/* Floating glass info bar at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="flex items-center justify-around px-8 py-4 rounded-2xl border backdrop-blur-xl"
               style={{
                 background: 'rgba(4,20,10,0.55)',
                 borderColor: 'rgba(255,255,255,0.1)',
                 boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
               }}>
            {[
              { icon: '🌱', label: 'Eco Tips'        },
              { icon: '♻️', label: 'Recyclables'     },
              { icon: '🌍', label: 'Sustainability'  },
              { icon: '💡', label: 'Learn & Act'     },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="text-white/50 text-xs font-medium hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CONTENT SECTION ───────────────────────────────────────────── */}
      <div id="content" className="max-w-7xl mx-auto px-4 py-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
               style={{ background: 'rgba(16,185,129,0.08)', color: '#34d399', borderColor: 'rgba(16,185,129,0.15)' }}>
            <Leaf size={11} /> All Guides
          </div>
          <h2 className="text-3xl font-bold text-white">Eco Tips & Recyclables</h2>
          <p className="text-white/35 text-sm mt-2">Browse our full library of environmental guides.</p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.2)' }} />
            <input type="text" placeholder="Search tips and recyclables..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{
                background: 'rgba(4,20,10,0.8)',
                border: '1px solid rgba(16,185,129,0.1)',
                caretColor: '#10b981',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.1)'}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
            {categories.map(cat => (
              <motion.button key={cat} onClick={() => setCategory(cat)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-3 rounded-xl text-sm font-medium border transition-all"
                style={category === cat
                  ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }
                  : { background: 'rgba(4,20,10,0.7)', color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(16,185,129,0.1)' }}>
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className="rounded-2xl h-72 border"
                style={{ background: 'rgba(4,20,10,0.6)', borderColor: 'rgba(16,185,129,0.06)' }} />
            ))}
          </div>
        )}

        {/* Empty */}
        <AnimatePresence>
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-white/40 text-lg font-medium">No results found</p>
              <p className="text-white/20 text-sm mt-1">Try a different search or category</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}