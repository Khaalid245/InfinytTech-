import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  viewportAmount?: number;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  viewportAmount = 0.2,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
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
      viewport={{ once: true, amount: viewportAmount }}
      variants={variants as any}
      className={className}
    >
      {children}
    </motion.div>
  );
};
