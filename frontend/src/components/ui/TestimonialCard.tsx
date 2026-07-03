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
      className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-primary/5 border-border-primary/60 hover:border-border-primary bg-surface-light hover:bg-[#15171A] ${className || ''}`}
    >
      {/* Decorative large quotation mark */}
      <svg 
        className="absolute top-4 left-4 w-24 h-24 text-accent-primary opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div>
          {/* Header containing rating and optional client logo */}
          <div className="flex justify-between items-start mb-8">
            {rating > 0 && (
              <div className="flex gap-1 text-amber-400" aria-label={`Rating: ${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 md:w-5 md:h-5 transform transition-all duration-700 ${i < rating ? 'fill-current opacity-0 animate-fade-in' : 'fill-transparent stroke-current opacity-20'}`}
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
              <Image 
                src={clientLogoUrl} 
                alt={`${company} logo`}
                title={company}
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-out"
              />
            )}
          </div>
          <div className="relative">
            <Text
              variant="body-large"
              className="mb-10 text-primary-text font-serif italic text-lg md:text-xl leading-relaxed line-clamp-4 transition-all duration-300 group-hover:text-white"
            >
              "{quote}"
            </Text>
            {/* Elegant fade for truncated text */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface-light group-hover:from-[#15171A] to-transparent pointer-events-none transition-colors duration-500" />
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-border-primary/50 group-hover:border-border-primary transition-colors duration-500 pt-6 mt-auto">
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Photo of ${author}`}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-border-primary/50 group-hover:border-border-primary transition-colors duration-500"
              />
            ) : (
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-light border-2 border-border-primary/50 group-hover:border-border-primary transition-colors duration-500 flex items-center justify-center font-medium text-primary-text text-lg">
                {author.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="block text-body font-semibold text-primary-text leading-tight capitalize tracking-tight group-hover:text-white transition-colors duration-300">{author}</span>
              <span className="text-sm text-secondary-text leading-tight block mt-1">
                <span className="capitalize">{role}</span>
                <span className="mx-1.5 opacity-50">•</span>
                <span className="font-medium text-neutral-400 capitalize">{company}</span>
              </span>
            </div>
          </div>
          {projectUrl && (
            <a 
              href={projectUrl} 
              className="group/cta hidden sm:flex text-[11px] font-bold uppercase tracking-widest text-accent-primary hover:text-white transition-colors duration-300 items-center gap-1.5"
              aria-label={`View case study for ${company}`}
            >
              View Case Study
              <svg className="w-4 h-4 transform group-hover/cta:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
      
      {/* Subtle glass reflection effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-transparent to-transparent mix-blend-overlay" />
    </Card>
  );
};
export default TestimonialCard;
