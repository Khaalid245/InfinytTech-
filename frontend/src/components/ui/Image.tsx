import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  skeletonClassName,
  fallbackSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {/* Skeleton / Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className={cn(
            "absolute inset-0 bg-surface-light animate-pulse", 
            skeletonClassName
          )} 
        />
      )}
      
      {/* Actual Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "transition-opacity duration-700 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}

      {/* Fallback Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-surface-light flex items-center justify-center border border-border-primary/50 text-secondary-text text-sm p-4 text-center">
          Failed to load image
        </div>
      )}
    </div>
  );
};
