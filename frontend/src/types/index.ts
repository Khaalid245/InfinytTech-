import type { LucideIcon } from 'lucide-react';
import type { ButtonProps } from '../components/ui/Button';

// Navigation Link Interface
export interface NavLinkItem {
  label: string;
  href: string;
}

// Service Item Interface
export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}

// Case Study/Project Interface
export interface ProjectItem {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  metric?: string;
  metricLabel?: string;
  href?: string;
}

// Testimonial Interface
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl?: string;
}

// Blog Post Interface
export interface BlogPostItem {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  category?: string;
  href?: string;
}

// Process Step Interface
export interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

// Hero Call To Action Interface
export interface HeroAction extends Omit<ButtonProps, 'children'> {
  label: string;
  href?: string;
}

// Service Explorer Item Interface
export interface ServiceExplorerItem {
  category: string;
  whatWeBuild: string[];
  techEcosystem: string[];
  typicalEngagements: string[];
  caseStudyHook: string;
  businessImpact: string[];
  timeline: string;
  engagementModel: string;
  support: string;
}

export * from './siteSettings.types';
export * from './dashboard.types';
