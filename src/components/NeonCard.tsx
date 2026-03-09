import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'pink' | 'purple';
  delay?: number;
}

const NeonCard = ({ children, className, variant = 'cyan', delay = 0 }: NeonCardProps) => {
  const glowColors = {
    cyan: "rgba(0,245,255,0.15)",
    pink: "rgba(255,0,255,0.15)",
    purple: "rgba(124,58,237,0.15)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        boxShadow: `0 0 25px ${glowColors[variant]}`,
        borderColor: variant === 'cyan' ? '#00F5FF' : variant === 'pink' ? '#FF00FF' : '#7C3AED'
      }}
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300 border-white/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default NeonCard;