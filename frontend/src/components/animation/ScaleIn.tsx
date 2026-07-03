import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      } 
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
