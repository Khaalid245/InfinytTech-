import { Sparkles, Code, Shield } from 'lucide-react';
import type { ServiceItem, ProjectItem, TestimonialItem, WorkflowStep } from '../types';

export const dummyServices: ServiceItem[] = [
  {
    icon: Sparkles,
    title: 'Experience Design',
    description: 'We design high-fidelity, premium user interfaces that convey trust, credibility, and brand longevity.',
    href: '#',
    linkText: 'Explore design'
  },
  {
    icon: Code,
    title: 'Systems Engineering',
    description: 'We develop clean, modular react architectures and scalable design systems that accelerate development cycles.',
    href: '#',
    linkText: 'Explore engineering'
  },
  {
    icon: Shield,
    title: 'Enterprise Scalability',
    description: 'Our software structures comply with industry-grade reliability standards, loading speeds, and strict code practices.',
    href: '#',
    linkText: 'Explore systems'
  },
];

export const dummyCaseStudies: ProjectItem[] = [
  {
    title: 'Next-Generation Design System for Acme Corp',
    category: 'Design Systems',
    description: 'Rebuilding the UI foundations of a global fintech firm to unify product lines and scale frontend efficiency.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    metric: '2.5x',
    metricLabel: 'Dev Velocity',
    href: '#',
  },
  {
    title: 'Cloud Orchestration Platform Frontend',
    category: 'Systems Engineering',
    description: 'Engineering the complex interactive interface and dashboards for a secure enterprise cloud hosting provider.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    metric: '-40%',
    metricLabel: 'Load Time',
    href: '#',
  },
];

export const dummySteps: WorkflowStep[] = [
  { number: '01', title: 'Strategy & Discovery', description: 'Aligning business goals, user needs, and defining the product vision.' },
  { number: '02', title: 'Architecture & Planning', description: 'Designing secure, scalable system topology and planning clear development milestones.' },
  { number: '03', title: 'Design & Development', description: 'Designing high-fidelity interfaces in Figma and building them with modern React/backend code.' },
  { number: '04', title: 'Testing & Optimization', description: 'Ensuring your product is exceptionally fast, secure, and ready for launch.' },
  { number: '05', title: 'Launch & Growth', description: 'Deploying seamlessly to cloud environments and supporting strategic long-term scale.' },
];

export const dummyTestimonials: TestimonialItem[] = [
  {
    quote: "InfinytTech's architectural design patterns helped us standardise our global dashboards, shortening feature deployment from weeks to days.",
    author: "Sarah Jenkins",
    role: "VP of Engineering",
    company: "Acme Corporation",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    quote: "The rigor they bring to type-safety, spacing systems, and performance tuning set a new standard for our external frontend vendor projects.",
    author: "Marcus Vance",
    role: "Staff Product Architect",
    company: "Veloce Financial",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
  }
];
