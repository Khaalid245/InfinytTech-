import React from 'react';
import { cn } from '../utils/cn';
import {
  HeartPulse,
  Landmark,
  GraduationCap,
  ShoppingCart,
  Truck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface IndustryCard {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tags: string[];
}

const INDUSTRIES: IndustryCard[] = [
  {
    id: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare',
    description: 'Secure digital health platforms, patient management systems, telemedicine solutions, and healthcare automation.',
    tags: ['Telemedicine', 'Hospital Systems', 'Patient Portals'],
  },
  {
    id: 'fintech',
    icon: Landmark,
    title: 'FinTech',
    description: 'Modern financial platforms, payment solutions, digital banking applications, and secure transaction systems.',
    tags: ['Payments', 'Digital Banking', 'Finance Automation'],
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education',
    description: 'Interactive learning platforms, student management systems, and AI-powered educational experiences.',
    tags: ['E-Learning', 'LMS', 'Student Portals'],
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce',
    description: 'Scalable online stores, marketplace platforms, inventory management, and customer experience solutions.',
    tags: ['Online Store', 'Marketplace', 'Inventory'],
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Logistics',
    description: 'Supply chain management, fleet tracking, logistics automation, and operational dashboards.',
    tags: ['Fleet Tracking', 'Supply Chain', 'Operations'],
  },
  {
    id: 'enterprise',
    icon: Building2,
    title: 'Enterprise',
    description: 'Internal business systems, workflow automation, enterprise software, and digital transformation initiatives.',
    tags: ['ERP', 'Automation', 'Business Intelligence'],
  },
];

interface IndustriesSectionProps {
  theme: 'dark' | 'light';
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  // Theme-specific styling tokens
  const bg = isDark ? 'bg-[#0B0D0F]' : 'bg-[#FAFAFA]';
  const textPrimary = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const cardBg = isDark ? 'bg-[#121417]/80 backdrop-blur-md' : 'bg-white';
  const cardBorder = isDark ? 'border-[#23262D]' : 'border-slate-200';
  const goldAccent = '#D4A017';

  const handleScrollToCapabilities = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const capabilitiesSec = document.getElementById('capabilities');
    if (capabilitiesSec) {
      capabilitiesSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className={cn("w-full py-24 transition-colors duration-300 relative overflow-hidden", bg)} 
      aria-label="Industries We Serve"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div>
            <span
              className={cn(
                'inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-300',
                isDark 
                  ? 'border-[#23262D] bg-[#121417]' 
                  : 'border-slate-200 bg-slate-100'
              )}
              style={{ color: goldAccent }}
            >
              OUR INDUSTRIES
            </span>
          </div>

          <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mt-2", textPrimary)}>
            Technology Solutions Across Every Industry
          </h2>

          <p className={cn("text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto", textSecondary)}>
            We partner with startups, enterprises, and organizations to design, build, and scale digital products that solve real business challenges across diverse industries.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES.map((industry) => {
            const IconComponent = industry.icon;
            return (
              <div
                key={industry.id}
                className={cn(
                  "rounded-2xl border p-8 flex flex-col justify-between transition-all duration-500 ease-out group hover:-translate-y-1",
                  cardBg,
                  cardBorder,
                  isDark
                    ? "hover:border-[#D4A017] hover:shadow-[0_12px_30px_-5px_rgba(212,160,23,0.12)]"
                    : "hover:border-[#B8860B] hover:shadow-[0_12px_30px_-5px_rgba(184,134,11,0.08)]"
                )}
                style={{
                  boxShadow: isDark
                    ? '0 4px 20px -2px rgba(15,15,16,0.5)'
                    : '0 4px 20px -2px rgba(17,17,17,0.02)',
                }}
              >
                <div className="space-y-6">
                  {/* Icon Container with subtle hover animation */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300",
                      isDark
                        ? "bg-[#181B1F] border-[#23262D] text-[#D4A017] group-hover:border-[#E6B325] group-hover:bg-[#E6B325]/5 group-hover:text-[#E6B325]"
                        : "bg-slate-50 border-slate-200 text-[#B8860B] group-hover:border-[#B8860B] group-hover:bg-[#B8860B]/5 group-hover:text-[#B8860B]"
                    )}
                  >
                    <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Industry Title */}
                  <h3 className={cn("text-xl font-bold tracking-tight", textPrimary)}>
                    {industry.title}
                  </h3>

                  {/* Short professional description */}
                  <p className={cn("text-base font-light leading-relaxed min-h-[48px]", textSecondary)}>
                    {industry.description}
                  </p>
                </div>

                {/* Solution Tags */}
                <div className="pt-6 border-t mt-6" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider block mb-3", isDark ? "text-zinc-500" : "text-slate-400")}>
                    Typical Solutions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {industry.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "text-[11px] font-medium tracking-wide px-3 py-1 rounded-full border transition-all duration-300",
                          isDark
                            ? "bg-[#181B1F]/40 border-[#23262D] text-[#94A3B8] group-hover:text-[#D4A017] group-hover:border-[#D4A017]/30 group-hover:bg-[#D4A017]/5"
                            : "bg-slate-50 border-slate-100 text-slate-600 group-hover:text-[#B8860B] group-hover:border-[#B8860B]/30 group-hover:bg-[#B8860B]/5"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Centered Section */}
        <div className="text-center space-y-12 pt-12 max-w-4xl mx-auto border-t" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
          {/* Trust Quote — replaced with specific outcome statement */}
          <div className="max-w-2xl mx-auto">
            <p className={cn("text-lg sm:text-xl font-medium italic leading-relaxed", textPrimary)}>
              "From a healthcare startup to an enterprise logistics platform — our process adapts, our standards don't."
            </p>
          </div>

          {/* Banner CTA Box */}
          <div 
            className={cn(
              "rounded-2xl border p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left transition-all duration-300",
              isDark 
                ? "bg-[#121417]/40 border-[#23262D] hover:border-[#D4A017]/30" 
                : "bg-slate-50/50 border-slate-200 hover:border-[#B8860B]/30"
            )}
          >
            <div className="space-y-1.5 max-w-md">
              <h4 className={cn("text-lg font-bold tracking-tight", textPrimary)}>
                Don't see your industry?
              </h4>
              <p className={cn("text-sm font-light leading-relaxed", textSecondary)}>
                Our team builds custom digital solutions for organizations of all sizes.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <a
                href="#capabilities"
                onClick={handleScrollToCapabilities}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:pr-5 group cursor-pointer",
                  isDark 
                    ? "bg-[#181B1F] border-[#23262D] text-[#F8FAFC] hover:border-[#D4A017] hover:text-[#D4A017]" 
                    : "bg-white border-slate-200 text-slate-900 hover:border-[#B8860B] hover:text-[#B8860B]"
                )}
              >
                <span>Explore Our Services</span>
                <ArrowRight
                  className="w-4 h-4 transition-all duration-300 transform group-hover:translate-x-1"
                  style={{ color: goldAccent }}
                />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustriesSection;
