import React from 'react';
import { motion } from 'framer-motion';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration, delay, ease: 'easeOut' } 
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants as any}
      className={className}
    >
      {children}
    </motion.div>
  );
};
