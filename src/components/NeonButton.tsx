import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'pink' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const NeonButton = ({ 
  children, 
  className, 
  variant = 'cyan', 
  size = 'md', 
  glow = true,
  ...props 
}: NeonButtonProps) => {
  const variants = {
    cyan: "border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_10px_rgba(0,245,255,0.3)] hover:shadow-[0_0_20px_rgba(0,245,255,0.6)]",
    pink: "border-secondary text-secondary hover:bg-secondary hover:text-black shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]",
    purple: "border-accent text-accent hover:bg-accent hover:text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)]",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg font-bold",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg border-2 bg-transparent font-medium transition-all duration-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;