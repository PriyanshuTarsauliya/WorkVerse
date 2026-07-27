'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export default function ToastNotification({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-sm font-bold">
          {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
        </div>
        <p className="text-xs font-semibold text-slate-200">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white text-xs font-bold bg-slate-800/80 px-2 py-1 rounded-lg transition"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
