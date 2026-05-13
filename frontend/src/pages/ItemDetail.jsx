import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Recycle, Globe, Calendar } from 'lucide-react';
import { itemsService } from '../services/items.service.js';

const CATEGORIES = {
  'Eco Tips':        { icon: Zap,     color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  'Recyclable Items':{ icon: Recycle, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)'  },
  'General':         { icon: Globe,   color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)' },
};

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemsService.getById(id)
      .then(({ data }) => setItem(data))
      .catch(() => toast.error('Could not load this tip.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto">
      <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
        className="rounded-3xl h-96 border"
        style={{ background: 'rgba(4,26,14,0.6)', borderColor: 'rgba(16,185,129,0.08)' }} />
    </div>
  );
  if (!item) return <p className="text-center text-white/30 py-20">Tip not found.</p>;

  const cat = CATEGORIES[item.category] || CATEGORIES['General'];
  const Icon = cat.icon;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <ArrowLeft size={16} />
          Back to Browse
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-3xl overflow-hidden border"
        style={{
          background: 'rgba(4,26,14,0.7)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(16,185,129,0.15)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>

        {/* Image */}
        <div className="relative h-80 overflow-hidden">
          {item.image_url ? (
            <motion.img
              src={item.image_url} alt={item.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
                 style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)` }}>
              <Icon size={80} style={{ color: cat.color, opacity: 0.3 }} />
            </div>
          )}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to top, rgba(2,12,6,0.9) 0%, rgba(2,12,6,0.2) 60%, transparent 100%)' }} />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-white leading-tight max-w-lg">
              {item.title}
            </motion.h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm flex-shrink-0"
                  style={{ background: 'rgba(2,12,6,0.8)', color: cat.color, borderColor: `${cat.color}40` }}>
              <Icon size={11} />
              {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-8">
          <p className="text-white/60 leading-relaxed text-base">{item.description}</p>

          <div className="flex items-center gap-2 mt-8 pt-6 border-t"
               style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
            <Calendar size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-white/25 text-xs">
              Added {new Date(item.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 p-6 rounded-2xl border flex items-start gap-4"
        style={{
          background: 'rgba(16,185,129,0.05)',
          borderColor: 'rgba(16,185,129,0.15)',
          backdropFilter: 'blur(12px)',
        }}>
        <span className="text-2xl">🌍</span>
        <div>
          <p className="font-semibold text-emerald-400 text-sm">Every small action counts</p>
          <p className="text-white/30 text-sm mt-0.5">Share this tip and help make South Africa greener.</p>
        </div>
      </motion.div>
    </div>
  );
}
