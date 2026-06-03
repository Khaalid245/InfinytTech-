import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  theme: 'dark' | 'light';
}

interface LogEntry {
  id: number;
  type: 'info' | 'success' | 'warn' | 'cmd';
  text: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
const TRUST_METRICS = [
  { label: 'AI Ready Integration', value: 'Agentic Flow' },
  { label: 'Latency to Hub',       value: '< 45ms Local' },
  { label: 'Talent Network',       value: 'Somalia & Global' },
  { label: 'Standards Capable',    value: 'Enterprise-grade' },
] as const;

const CLUSTER_NODES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  latency: Math.floor(Math.random() * 12) + 1,
}));

const QUICK_COMMANDS = ['Deploy', 'Scale Up', 'Check Status', 'Flush Cache'] as const;

const CMD_RESPONSES: Record<string, string[]> = {
  Deploy:       ['⚙️  [SYSTEM]: Initialising deployment pipeline...', '📦  [BUILD]: Compiling 47 modules... done', '🚀  [DEPLOY]: Pushing to 3 edge regions... SUCCESS'],
  'Scale Up':   ['⚙️  [SYSTEM]: Scaling active cluster to 12 edge nodes...', '🔄  [ORCHESTRATOR]: Provisioning 4 additional containers...', '✅  [SYSTEM]: Scale-up complete. Capacity: 95%'],
  'Check Status':['📡  [MONITOR]: Querying 20 cluster nodes...', '🟢  [STATUS]: 18/20 nodes healthy  •  2 warming up', '⚡  [LATENCY]: Avg 38ms  •  P99 61ms'],
  'Flush Cache': ['🗑️  [CACHE]: Invalidating CDN layer across 6 PoPs...', '🔁  [REBUILD]: Regenerating static assets...', '✅  [CACHE]: Flushed. New TTL: 3600s'],
};

// ─── Telemetry bar heights (7-day API call spike data) ───────────────────────
const TELEMETRY = [42, 68, 55, 80, 63, 91, 74];

// ─── Component ────────────────────────────────────────────────────────────────
export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [cpuLoad, setCpuLoad]       = useState(52);
  const [logs, setLogs]             = useState<LogEntry[]>([
    { id: 0, type: 'info',    text: '🟢  [SYSTEM]: All services operational' },
    { id: 1, type: 'success', text: '✅  [DEPLOY]: v2.4.1 deployed to prod' },
  ]);
  const [cmdInput, setCmdInput]     = useState('');
  const [isRunning, setIsRunning]   = useState(false);
  const [mounted, setMounted]       = useState(false);
  const logEndRef                   = useRef<HTMLDivElement>(null);
  const logId                       = useRef(10);

  // Entry animation trigger
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  // CPU load fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setCpuLoad(prev => Math.max(20, Math.min(95, prev + Math.floor(Math.random() * 11) - 5)));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll terminal log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const pushLog = (entries: LogEntry[]) =>
    setLogs(prev => [...prev.slice(-12), ...entries]);

  const runCommand = (cmd: string) => {
    if (isRunning) return;
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setIsRunning(true);
    setCmdInput('');

    const cmdLog: LogEntry = { id: logId.current++, type: 'cmd', text: `$ ${trimmed}` };
    const responses = CMD_RESPONSES[trimmed as keyof typeof CMD_RESPONSES] ?? [
      `⚠️  [SYSTEM]: Unknown command "${trimmed}"`,
      '   Run "Check Status" to verify system health.',
    ];

    pushLog([cmdLog]);
    responses.forEach((text, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev.slice(-12), { id: logId.current++, type: i === responses.length - 1 ? 'success' : 'info', text }]);
        if (i === responses.length - 1) setIsRunning(false);
      }, (i + 1) * 600);
    });
  };

  // ── Colour shortcuts ──────────────────────────────────────────────────────
  const accent     = isDark ? '#FACC15' : '#CA8A04';
  const accentHov  = isDark ? '#EAB308' : '#B45309';
  const borderCol  = isDark ? '#2A2A2A' : '#E2E8F0';
  const surfaceCol = isDark ? '#1F1F1F' : '#FFFFFF';
  const subText    = isDark ? '#D4D4D4' : '#475569';
  const dimText    = isDark ? '#6B7280' : '#94A3B8';

  const cpuColor = cpuLoad > 80 ? '#EF4444' : cpuLoad > 60 ? '#F59E0B' : '#22C55E';

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden pt-16 pb-24 md:pt-32 md:pb-36',
        isDark ? 'bg-[#0F0F10]' : 'bg-[#FAFAFA]'
      )}
      aria-label="Hero"
    >
      {/* ── Backdrop glow bubbles ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        style={{ background: isDark ? '#EAB308' : '#CA8A04', opacity: 0.025, filter: 'blur(150px)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full"
        style={{ background: isDark ? '#EAB308' : '#CA8A04', opacity: 0.02, filter: 'blur(120px)' }}
      />

      {/* ── 12-column grid ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ════════════════════════════════════════════════════════════════
              LEFT — Content & Conversion
          ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-7">

            {/* Badge */}
            <div
              className={cn(
                'self-start opacity-0 transition-all duration-700',
                mounted && 'opacity-100 translate-y-0 animate-fade-in-up delay-75'
              )}
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
                style={{ borderColor: borderCol, color: accent, background: isDark ? '#171717' : '#FFFBEB' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: accent }}
                />
                East Africa's Global Tech Gateway
              </span>
            </div>

            {/* Headline */}
            <h1
              className={cn(
                'text-4xl sm:text-5xl lg:text-[3.6rem] font-black leading-[1.1] tracking-tight opacity-0 transition-all duration-700',
                mounted && 'opacity-100 animate-fade-in-up delay-150',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Building Intelligent{' '}
              <span
                className="inline bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${isDark ? '#FFFFFF' : '#0F172A'} 0%, ${accent} 60%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Digital Products
              </span>{' '}
              for the Future.
            </h1>

            {/* Value proposition */}
            <p
              className={cn(
                'text-lg sm:text-xl font-light leading-relaxed max-w-xl opacity-0 transition-all duration-700',
                mounted && 'opacity-100 animate-fade-in-up delay-300'
              )}
              style={{ color: subText }}
            >
              We help startups, enterprises, and innovators transform ideas into
              scalable digital products through design, engineering, AI, and cloud
              technologies.
            </p>

            {/* CTA Row */}
            <div
              className={cn(
                'flex flex-wrap gap-4 items-center opacity-0 transition-all duration-700',
                mounted && 'opacity-100 animate-fade-in-up delay-500'
              )}
            >
              {/* Primary CTA */}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 active:scale-95 shadow-lg"
                style={{
                  background: accent,
                  color: '#0F0F10',
                  boxShadow: `0 8px 24px -4px ${accent}30`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = accentHov)}
                onMouseLeave={e => (e.currentTarget.style.background = accent)}
              >
                Start Your Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer"
                style={{
                  background: isDark ? '#171717' : '#FFFFFF',
                  color: isDark ? '#FFFFFF' : '#334155',
                  borderColor: borderCol,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = isDark ? `${accent}50` : '#CBD5E1';
                  e.currentTarget.style.background  = isDark ? '#1F1F1F' : '#F8FAFC';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = borderCol;
                  e.currentTarget.style.background  = isDark ? '#171717' : '#FFFFFF';
                }}
              >
                Book a Discovery Call
              </button>
            </div>

            {/* Trust metrics strip */}
            <div
              className={cn(
                'grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 opacity-0 transition-all duration-700',
                mounted && 'opacity-100 animate-fade-in-up delay-500'
              )}
            >
              {TRUST_METRICS.map(m => (
                <div
                  key={m.label}
                  className="flex flex-col gap-0.5 p-3 rounded-xl border"
                  style={{ borderColor: borderCol, background: surfaceCol }}
                >
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: dimText }}>
                    {m.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: accent }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT — Interactive SaaS Dashboard
          ════════════════════════════════════════════════════════════════ */}
          <div
            className={cn(
              'lg:col-span-5 flex flex-col gap-4 opacity-0 transition-all duration-700',
              mounted && 'opacity-100 animate-fade-in-right delay-700'
            )}
          >
            {/* Dashboard card wrapper */}
            <div
              className="rounded-2xl border overflow-hidden shadow-2xl"
              style={{ borderColor: borderCol, background: isDark ? '#171717' : '#FFFFFF' }}
            >
              {/* Window chrome bar */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: borderCol, background: isDark ? '#1F1F1F' : '#F8FAFC' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: dimText }}>
                  infinyttech — system console
                </span>
                <span
                  className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: '#22C55E' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Live
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* ── Row 1: CPU gauge + cluster grid ─────────────────── */}
                <div className="grid grid-cols-2 gap-3">
                  {/* CPU Load gauge */}
                  <div
                    className="rounded-xl p-3 border"
                    style={{ borderColor: borderCol, background: isDark ? '#0F0F10' : '#F8FAFC' }}
                  >
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: dimText }}>
                      CPU Load
                    </p>
                    {/* Bar */}
                    <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: isDark ? '#2A2A2A' : '#E2E8F0' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${cpuLoad}%`, background: cpuColor }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-mono" style={{ color: cpuColor }}>
                        {cpuLoad}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: dimText }}>
                        {cpuLoad > 80 ? 'High' : cpuLoad > 60 ? 'Moderate' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  {/* Cluster node grid */}
                  <div
                    className="rounded-xl p-3 border"
                    style={{ borderColor: borderCol, background: isDark ? '#0F0F10' : '#F8FAFC' }}
                  >
                    <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: dimText }}>
                      Cluster Nodes
                    </p>
                    <div className="grid grid-cols-5 gap-1">
                      {CLUSTER_NODES.map(node => (
                        <div
                          key={node.id}
                          title={`Node ${node.id + 1} • Online • ${node.latency}ms`}
                          className="w-full aspect-square rounded-sm cursor-pointer transition-all duration-150 hover:scale-110"
                          style={{ background: node.latency < 8 ? '#22C55E' : '#F59E0B', opacity: 0.75 }}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] mt-1.5 font-semibold" style={{ color: '#22C55E' }}>
                      20/20 nodes online
                    </p>
                  </div>
                </div>

                {/* ── Row 2: Telemetry bar chart ─────────────────────── */}
                <div
                  className="rounded-xl p-3 border"
                  style={{ borderColor: borderCol, background: isDark ? '#0F0F10' : '#F8FAFC' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: dimText }}>
                      API Calls — 7d
                    </p>
                    <span className="text-[10px] font-bold" style={{ color: accent }}>+14.2%</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                    {TELEMETRY.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all duration-700" style={{
                        height: `${h}%`,
                        background: i === TELEMETRY.length - 1 ? accent : isDark ? '#2A2A2A' : '#E2E8F0',
                        opacity: i === TELEMETRY.length - 1 ? 1 : 0.6 + i * 0.06,
                      }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <span key={d} className="text-[8px] font-semibold" style={{ color: dimText }}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* ── Row 3: Live terminal console ──────────────────────*/}
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: borderCol }}
                >
                  {/* Terminal header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 border-b"
                    style={{ borderColor: borderCol, background: isDark ? '#0F0F10' : '#F1F5F9' }}
                  >
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: dimText }}>
                      Terminal
                    </span>
                    {/* Quick command pills */}
                    <div className="flex gap-1">
                      {QUICK_COMMANDS.map(cmd => (
                        <button
                          key={cmd}
                          onClick={() => runCommand(cmd)}
                          disabled={isRunning}
                          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border transition-all duration-150 active:scale-95 disabled:opacity-40 cursor-pointer"
                          style={{
                            borderColor: borderCol,
                            color: accent,
                            background: isDark ? '#1F1F1F' : '#FFFFFF',
                          }}
                        >
                          {cmd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log output */}
                  <div
                    className="h-28 overflow-y-auto p-3 font-mono text-[10px] space-y-1"
                    style={{ background: isDark ? '#0A0A0A' : '#F8FAFC' }}
                  >
                    {logs.map(log => (
                      <div
                        key={log.id}
                        className="leading-relaxed"
                        style={{
                          color: log.type === 'cmd'     ? accent
                               : log.type === 'success' ? '#22C55E'
                               : log.type === 'warn'    ? '#F59E0B'
                               : isDark ? '#D4D4D4' : '#475569',
                        }}
                      >
                        {log.text}
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>

                  {/* Command input */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 border-t"
                    style={{ borderColor: borderCol, background: isDark ? '#0F0F10' : '#F1F5F9' }}
                  >
                    <span className="font-mono text-[10px] font-bold" style={{ color: accent }}>$</span>
                    <input
                      type="text"
                      value={cmdInput}
                      onChange={e => setCmdInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && runCommand(cmdInput)}
                      disabled={isRunning}
                      placeholder="Type a command or click above…"
                      className="flex-1 bg-transparent outline-none font-mono text-[10px] placeholder:opacity-40 disabled:opacity-40"
                      style={{ color: isDark ? '#D4D4D4' : '#475569' }}
                      aria-label="Terminal command input"
                    />
                    {isRunning && (
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
