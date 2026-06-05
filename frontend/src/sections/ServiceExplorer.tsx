import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { servicesExplorerData } from '../data/servicesExplorerData';
import {
  Layers,
  BrainCircuit,
  Smartphone,
  Cloud,
  Palette,
  Database,
  RefreshCw,
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Product Engineering": Layers,
  "AI & Intelligent Systems": BrainCircuit,
  "Mobile Experiences": Smartphone,
  "Cloud & Infrastructure": Cloud,
  "Product Design & UX": Palette,
  "Data & Analytics": Database,
  "Digital Transformation": RefreshCw,
  "Technology Consulting": Compass,
};

interface ServiceExplorerProps {
  theme: 'dark' | 'light';
}

export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(0);

  const bg = isDark ? 'bg-[#0F0F10]' : 'bg-[#FAFAFA]';
  const cardBg = isDark ? 'bg-[#171717]' : 'bg-white';
  const border = isDark ? 'border-[#2A2A2A]' : 'border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-slate-500';
  const textMuted = isDark ? 'text-zinc-500' : 'text-slate-400';
  const accentText = isDark ? 'text-[#FACC15]' : 'text-[#CA8A04]';
  const activeBg = isDark ? 'bg-[#1F1F1F]' : 'bg-slate-50';

  return (
    <section 
      className={cn("py-24 transition-colors duration-300", bg)}
      aria-label="Capabilities Service Explorer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex justify-center">
            <span 
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300",
                isDark 
                  ? "bg-[#1F1F1F] border-[#2A2A2A] text-[#FACC15]" 
                  : "bg-slate-100 border-slate-200 text-[#CA8A04]"
              )}
            >
              Our Service Offerings
            </span>
          </div>

          <h2 className={cn("text-3xl sm:text-4xl font-black leading-tight tracking-tight mt-2", textPrimary)}>
            How We Help Businesses Build, Scale, and Innovate
          </h2>

          <p className={cn("text-base font-light leading-relaxed max-w-xl mx-auto mt-2", textSecondary)}>
            Select a service drawer below to review what we build, key business impacts, technical stacks, and outcome-led case studies.
          </p>
        </div>

        {/* Desktop Split-Screen Drawer Layout (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start min-h-[640px]">
          
          {/* Left Drawer Selection List */}
          <div className="lg:col-span-5 space-y-3">
            {servicesExplorerData.map((item, idx) => {
              const IconComp = categoryIcons[item.category] || Layers;
              const isActive = activeIndex === idx;

              return (
                <button
                  key={item.category}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full text-left flex items-center justify-between p-5 rounded-xl border transition-all duration-300 group cursor-pointer",
                    isActive 
                      ? cn("shadow-lg", border, activeBg)
                      : "border-transparent bg-transparent hover:bg-slate-100/50 dark:hover:bg-zinc-800/30"
                  )}
                  style={{
                    boxShadow: isActive
                      ? isDark 
                        ? '0 10px 25px -5px rgba(250,204,21,0.06)' 
                        : '0 10px 25px -5px rgba(202,138,4,0.04)'
                      : 'none'
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300",
                        isActive 
                          ? isDark 
                            ? "bg-[#2A2A2A] border-[#FACC15]/30 text-[#FACC15]" 
                            : "bg-white border-[#CA8A04]/30 text-[#CA8A04]"
                          : isDark ? "bg-[#171717] border-[#2A2A2A] text-zinc-500 group-hover:text-zinc-300" : "bg-white border-slate-200 text-slate-400 group-hover:text-slate-600"
                      )}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div>
                      <span className={cn("font-mono text-[10px] tracking-wider block leading-none mb-1.5", isActive ? accentText : textMuted)}>
                        0{idx + 1} // CAPABILITY
                      </span>
                      <h3 className={cn("text-base font-extrabold tracking-tight transition-colors duration-200", isActive ? textPrimary : isDark ? "text-zinc-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900")}>
                        {item.category}
                      </h3>
                    </div>
                  </div>

                  <ArrowRight 
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive 
                        ? cn("opacity-100 translate-x-0", accentText)
                        : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Drawer Detailed Panel */}
          <div className={cn("lg:col-span-7 rounded-2xl border p-8 space-y-6 min-h-[640px] flex flex-col justify-between transition-all duration-300", cardBg, border)}>
            
            {/* Header section of detailed panel */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: isDark ? '#2A2A2A' : '#E2E8F0' }}>
                <div className="space-y-1">
                  <span className={cn("font-mono text-[11px] uppercase tracking-wider block", accentText)}>
                    Drawer 0{activeIndex + 1} Active Details
                  </span>
                  <h2 className={cn("text-2xl font-black tracking-tight", textPrimary)}>
                    {servicesExplorerData[activeIndex].category}
                  </h2>
                </div>
                {React.createElement(categoryIcons[servicesExplorerData[activeIndex].category] || Layers, {
                  className: cn("w-8 h-8 opacity-40", accentText)
                })}
              </div>

              {/* What We Build & Business Impact Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* What We Build */}
                <div className="space-y-3">
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider", textMuted)}>
                    What We Build
                  </h4>
                  <div className="space-y-2">
                    {servicesExplorerData[activeIndex].whatWeBuild.map((deliverable) => (
                      <div 
                        key={deliverable}
                        className={cn(
                          "flex items-start gap-2.5 p-3 rounded-lg border text-xs font-semibold leading-normal transition-colors duration-200",
                          isDark ? "bg-[#1F1F1F]/40 border-[#2A2A2A]" : "bg-slate-50 border-slate-100"
                        )}
                      >
                        <span className={cn("text-xs leading-none select-none mt-0.5", accentText)}>➔</span>
                        <span className={textPrimary}>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Impact */}
                <div className="space-y-3">
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider", textMuted)}>
                    Business Impact
                  </h4>
                  <div className="space-y-2">
                    {servicesExplorerData[activeIndex].businessImpact.map((outcome) => (
                      <div 
                        key={outcome}
                        className={cn(
                          "flex items-start gap-2.5 p-3 rounded-lg border text-xs font-semibold leading-normal transition-colors duration-200",
                          isDark ? "bg-[#1F1F1F]/40 border-[#2A2A2A]" : "bg-slate-50 border-slate-100"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                        <span className={textPrimary}>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tech Ecosystem */}
              <div className="space-y-3">
                <h4 className={cn("text-xs font-bold uppercase tracking-wider", textMuted)}>
                  Technologies & Ecosystem
                </h4>
                <div className="flex flex-wrap gap-2">
                  {servicesExplorerData[activeIndex].techEcosystem.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "text-xs font-mono px-3.5 py-1.5 rounded-full border transition-all duration-300",
                        isDark 
                          ? "bg-[#1F1F1F] border-[#2A2A2A] text-zinc-300 hover:border-[#FACC15]/40 hover:text-[#FACC15]" 
                          : "bg-slate-100 border-slate-200 text-slate-700 hover:border-[#CA8A04]/40 hover:text-[#CA8A04]"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Typical Engagements */}
              <div className="space-y-3">
                <h4 className={cn("text-xs font-bold uppercase tracking-wider", textMuted)}>
                  Typical Engagements
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
                  {servicesExplorerData[activeIndex].typicalEngagements.map((scenario) => (
                    <li key={scenario} className="flex items-center gap-2 text-xs font-medium">
                      <span className={cn("w-1.5 h-1.5 rounded-full", accentText)} />
                      <span className={textSecondary}>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Credibility Metric Strip & Case Study Wrapper */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: isDark ? '#2A2A2A' : '#E2E8F0' }}>
              
              {/* Metric Strip */}
              <div 
                className={cn(
                  "grid grid-cols-3 gap-2 py-4 px-4 border rounded-xl text-center font-mono text-[9px] sm:text-[10px] uppercase tracking-wider",
                  isDark ? "bg-[#1F1F1F]/30 border-[#2A2A2A]" : "bg-slate-50 border-slate-100"
                )}
              >
                <div>
                  <span className={textMuted}>Timeline</span>
                  <span className={cn("block font-bold mt-1 text-[10px] sm:text-[11px]", textPrimary)}>
                    {servicesExplorerData[activeIndex].timeline}
                  </span>
                </div>
                <div className={cn("border-x", isDark ? "border-[#2A2A2A]" : "border-slate-200")}>
                  <span className={textMuted}>Engagement Model</span>
                  <span className={cn("block font-bold mt-1 text-[10px] sm:text-[11px] truncate px-1", textPrimary)}>
                    {servicesExplorerData[activeIndex].engagementModel}
                  </span>
                </div>
                <div>
                  <span className={textMuted}>Support</span>
                  <span className={cn("block font-bold mt-1 text-[10px] sm:text-[11px]", textPrimary)}>
                    {servicesExplorerData[activeIndex].support}
                  </span>
                </div>
              </div>

              {/* Case Study Hook */}
              <div 
                className={cn(
                  "border rounded-xl p-5 transition-all duration-300 relative overflow-hidden group cursor-pointer",
                  isDark 
                    ? "bg-gradient-to-r from-[#1E1E20] to-[#171717] hover:border-[#FACC15]/40" 
                    : "bg-gradient-to-r from-slate-50 to-white hover:border-[#CA8A04]/40"
                )}
                style={{
                  boxShadow: isDark 
                    ? '0 4px 15px -3px rgba(0,0,0,0.3)' 
                    : '0 4px 15px -3px rgba(0,0,0,0.05)'
                }}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className={cn("font-mono text-[9px] uppercase tracking-widest block leading-none mb-1.5", accentText)}>
                      Featured Case Study Hook
                    </span>
                    <h4 className={cn("text-sm font-black tracking-tight group-hover:underline", textPrimary)}>
                      {servicesExplorerData[activeIndex].caseStudyHook}
                    </h4>
                  </div>
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ml-4 flex-shrink-0",
                      isDark 
                        ? "border-[#2A2A2A] bg-[#171717] group-hover:border-[#FACC15] group-hover:text-[#FACC15]" 
                        : "border-slate-200 bg-white group-hover:border-[#CA8A04] group-hover:text-[#CA8A04]"
                    )}
                  >
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Accordion Drawer Layout (under lg) */}
        <div className="lg:hidden space-y-4">
          {servicesExplorerData.map((item, idx) => {
            const IconComp = categoryIcons[item.category] || Layers;
            const isOpen = expandedMobileIndex === idx;

            return (
              <div 
                key={item.category}
                className={cn(
                  "rounded-xl border overflow-hidden transition-all duration-300",
                  isOpen ? activeBg : "bg-transparent",
                  border
                )}
              >
                {/* Mobile Drawer Header */}
                <button
                  onClick={() => setExpandedMobileIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between p-5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-300",
                        isOpen
                          ? isDark ? "bg-[#2A2A2A] border-[#FACC15]/30 text-[#FACC15]" : "bg-white border-[#CA8A04]/30 text-[#CA8A04]"
                          : isDark ? "bg-[#171717] border-[#2A2A2A] text-zinc-500" : "bg-white border-slate-200 text-slate-400"
                      )}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                    </div>

                    <div>
                      <span className={cn("font-mono text-[9px] tracking-wider block leading-none mb-1", isOpen ? accentText : textMuted)}>
                        0{idx + 1}
                      </span>
                      <h3 className={cn("text-sm font-extrabold tracking-tight", textPrimary)}>
                        {item.category}
                      </h3>
                    </div>
                  </div>

                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      isOpen ? "rotate-180" : "rotate-0",
                      textSecondary
                    )}
                  />
                </button>

                {/* Mobile Drawer Body Content */}
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out px-5 overflow-hidden",
                    isOpen ? "max-h-[1000px] pb-5 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="space-y-6 pt-3 border-t" style={{ borderColor: isDark ? '#2A2A2A' : '#E2E8F0' }}>
                    
                    {/* What We Build */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        What We Build
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {item.whatWeBuild.map((deliverable) => (
                          <div 
                            key={deliverable}
                            className={cn(
                              "flex items-start gap-2.5 p-3 rounded-lg border text-xs font-semibold leading-normal",
                              isDark ? "bg-[#171717] border-[#2A2A2A]" : "bg-white border-slate-100"
                            )}
                          >
                            <span className={cn("text-xs leading-none select-none mt-0.5", accentText)}>➔</span>
                            <span className={textPrimary}>{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Impact */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        Business Impact
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {item.businessImpact.map((outcome) => (
                          <div 
                            key={outcome}
                            className={cn(
                              "flex items-start gap-2.5 p-3 rounded-lg border text-xs font-semibold leading-normal",
                              isDark ? "bg-[#171717] border-[#2A2A2A]" : "bg-white border-slate-100"
                            )}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-500" />
                            <span className={textPrimary}>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.techEcosystem.map((tech) => (
                          <span
                            key={tech}
                            className={cn(
                              "text-[10px] font-mono px-2.5 py-1 rounded-full border",
                              isDark 
                                ? "bg-[#171717] border-[#2A2A2A] text-zinc-300" 
                                : "bg-white border-slate-200 text-slate-700"
                            )}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Typical Engagements */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        Typical Engagements
                      </h4>
                      <ul className="space-y-1.5 list-none p-0 m-0 text-xs">
                        {item.typicalEngagements.map((scenario) => (
                          <li key={scenario} className="flex items-center gap-2 font-medium">
                            <span className={cn("w-1 h-1 rounded-full flex-shrink-0", accentText)} />
                            <span className={textSecondary}>{scenario}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Credibility Metrics */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        Engagement Specifications
                      </h4>
                      <div 
                        className={cn(
                          "grid grid-cols-3 gap-1 py-3 px-2 border rounded-lg text-center font-mono text-[9px] uppercase tracking-wider",
                          isDark ? "bg-[#171717]/50 border-[#2A2A2A]" : "bg-slate-50 border-slate-100"
                        )}
                      >
                        <div>
                          <span className={textMuted}>Timeline</span>
                          <span className={cn("block font-bold mt-0.5", textPrimary)}>{item.timeline}</span>
                        </div>
                        <div className={cn("border-x", isDark ? "border-[#2A2A2A]" : "border-slate-200")}>
                          <span className={textMuted}>Model</span>
                          <span className={cn("block font-bold mt-0.5 truncate px-0.5", textPrimary)}>{item.engagementModel}</span>
                        </div>
                        <div>
                          <span className={textMuted}>Support</span>
                          <span className={cn("block font-bold mt-0.5", textPrimary)}>{item.support}</span>
                        </div>
                      </div>
                    </div>

                    {/* Case Study */}
                    <div className="space-y-2">
                      <h4 className={cn("text-[10px] font-bold uppercase tracking-wider", textMuted)}>
                        Case Study
                      </h4>
                      <div className={cn("border rounded-lg p-4", isDark ? "bg-[#171717] border-[#2A2A2A]" : "bg-white border-slate-100")}>
                        <span className={cn("font-mono text-[8px] uppercase tracking-widest block leading-none mb-1", accentText)}>
                          Featured Case Study Hook
                        </span>
                        <h4 className={cn("text-xs font-black tracking-tight", textPrimary)}>
                          {item.caseStudyHook}
                        </h4>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ServiceExplorer;
