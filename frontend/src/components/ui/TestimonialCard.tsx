import React from 'react';
import { Card } from './Card';
import { Text } from './Text';
import { Image } from './Image';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl?: string;
  clientLogoUrl?: string;
  projectUrl?: string;
  rating?: number;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  imageUrl,
  clientLogoUrl,
  projectUrl,
  rating = 5,
  className,
}) => {
  return (
    <Card
      variant="outline"
      padding="lg"
      className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 border-border-primary hover:border-accent-primary/40 bg-surface-light flex flex-col justify-between ${className || ''}`}
    >
      {/* Decorative large quotation mark */}
      <svg 
        className="absolute -top-4 -right-4 w-32 h-32 text-accent-primary opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none -rotate-12" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <div className="flex flex-col h-full relative z-10">
        {/* Header containing rating and optional client logo */}
        <div className="flex justify-between items-start mb-6 shrink-0">
          {rating > 0 && (
            <div className="flex gap-1 text-amber-400 mt-2" aria-label={`Rating: ${rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 transform transition-all duration-700 ${i < rating ? 'fill-current opacity-0 animate-fade-in' : 'fill-transparent stroke-current opacity-20'}`}
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ))}
            </div>
          )}
          {clientLogoUrl && (
            <div className="w-12 h-12 rounded-xl bg-white border border-border-primary flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-sm">
              <Image 
                src={clientLogoUrl} 
                alt={`${company} logo`}
                title={company}
                className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-out"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 mb-8">
          <Text
            variant="body-large"
            className="text-primary-text font-serif italic text-lg md:text-xl leading-relaxed transition-all duration-300"
          >
            "{quote}"
          </Text>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col mt-auto pt-6 border-t border-border-primary/50 group-hover:border-border-primary transition-colors duration-500 shrink-0">
          
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Photo of ${author}`}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-border-primary/50 group-hover:border-border-primary transition-colors duration-500 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-light border-2 border-border-primary/50 group-hover:border-border-primary transition-colors duration-500 flex items-center justify-center font-medium text-primary-text text-lg shrink-0">
                {author.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex flex-col min-w-0">
              <span className="block text-base font-bold text-primary-text leading-tight tracking-tight transition-colors duration-300 truncate">{author}</span>
              <span className="text-sm text-secondary-text leading-tight block mt-1.5 truncate">
                <span>{role}</span>
                <span className="mx-1.5 opacity-40 text-xs">•</span>
                <span className="font-medium text-primary-text/80">{company}</span>
              </span>
            </div>
          </div>

          {projectUrl && (
            <div className="mt-5 pt-5 border-t border-dashed border-border-primary/30">
              <a 
                href={projectUrl} 
                className="group/cta inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-primary hover:text-white transition-colors duration-300"
                aria-label={`View case study for ${company}`}
              >
                View Case Study
                <svg className="w-4 h-4 transform group-hover/cta:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}

        </div>
      </div>
      
      {/* Subtle glass reflection effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-transparent to-transparent mix-blend-overlay" />
    </Card>
  );
};

export default TestimonialCard;
