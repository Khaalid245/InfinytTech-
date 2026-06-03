import React from 'react';
import { Card } from './Card';
import { Heading } from './Heading';
import { Text } from './Text';
import { Button } from './Button';

export interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  category?: string;
  href?: string;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  date,
  readTime,
  imageUrl,
  category,
  href,
  className,
}) => {
  return (
    <div className={`group cursor-pointer ${className}`}>
      <Card
        variant="outline"
        padding="none"
        className="overflow-hidden h-full flex flex-col border border-border-primary group-hover:border-primary-text transition-all duration-300"
      >
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-surface-light border-b border-border-primary">
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-surface-light flex items-center justify-center border-b border-border-primary text-secondary-text">
            No image available
          </div>
        )}
        
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-4 text-caption text-secondary-text">
            {category && (
              <span className="uppercase font-semibold tracking-wider text-accent-primary bg-neutral-900 px-2 py-0.5 rounded-sm text-[10px]">
                {category}
              </span>
            )}
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-border-primary" />
            <span>{readTime}</span>
          </div>
          
          <Heading
            variant="h3"
            className="mb-3 text-xl font-medium leading-snug tracking-tight group-hover:text-neutral-700 transition-colors"
          >
            {title}
          </Heading>
          
          <Text
            variant="body"
            className="mb-6 text-secondary-text text-small line-clamp-3 flex-grow"
          >
            {excerpt}
          </Text>
          
          {href && (
            <Button
              variant="text"
              className="text-small mt-auto self-start"
            >
              Read Article
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
export default BlogCard;
