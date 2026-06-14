import React from 'react';
import { cn } from '../../utils/cn';
import logoSrc from '../../../docs/logo.png';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img 
      src={logoSrc} 
      alt="InfinityTech Logo" 
      className={cn("w-auto object-contain transition-opacity duration-300", className)} 
    />
  );
};
