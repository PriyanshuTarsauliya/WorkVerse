'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: AnimatedButtonProps) {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg';
  
  const variantStyles = {
    primary: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20',
    secondary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
    glass: 'bg-white/10 dark:bg-slate-900/40 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
}
