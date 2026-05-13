import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
         style={{ background: 'linear-gradient(135deg, #020c06 0%, #041a0e 100%)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Leaf size={64} className="mx-auto mb-6 opacity-20" style={{ color: '#10b981' }} />
        <p className="text-8xl font-black mb-4" style={{ color: 'rgba(16,185,129,0.15)' }}>404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/30 mb-8">The page you are looking for doesn't exist.</p>
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
            <ArrowLeft size={16} /> Go Home
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
