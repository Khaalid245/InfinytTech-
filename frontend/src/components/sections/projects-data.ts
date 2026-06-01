import { Icons, IconComponent } from "@/components/icons/Icons";

export interface StatWidget {
  label: string;
  value: string;
  change?: string;
}

export interface Metric {
  label: string;
  value: string;
  pct: number;
}

export type ProjectCategory = "Web" | "Mobile" | "Design";

export interface Challenge {
  problem: string;
  solution: string;
}

export interface ProjectCardProps {
  tagIcon: IconComponent;
  title: string;
  body: string;
  accent: string;
  accentBg: string;
  num: string;
  image: string;
  category: ProjectCategory;
  industry: string;
  stats: [StatWidget, StatWidget, StatWidget, StatWidget];
  client: string;
  overview: string;
  metrics: [Metric, Metric, Metric];
  challenges: [Challenge, Challenge];
  stack: string[];
  liveUrl?: string;
}

export const PROJECTS: ProjectCardProps[] = [
  {
    num: "01", tagIcon: Icons.trending, category: "Web", industry: "Fintech",
    title: "Northwind Pay",
    body: "Real-time payments infrastructure processing millions of transactions daily with sub-100ms settlement, full PCI-DSS compliance, and zero-downtime deployments.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card1.png",
    client: "Northwind Financial",
    overview: "Real-time payments infrastructure with sub-100ms settlement, full PCI-DSS compliance, and zero-downtime deployments at scale.",
    metrics: [
      { label: "Transaction Success", value: "98.7%", pct: 99 },
      { label: "Settlement Time",     value: "1.2s",  pct: 82 },
      { label: "Daily Users",         value: "24.7K", pct: 74 },
    ],
    challenges: [
      { problem: "Sub-100ms settlement across distributed payment nodes at scale.", solution: "Built an event-driven processing engine with optimistic settlement and atomic rollback guarantees." },
      { problem: "Achieving PCI-DSS compliance without slowing down the engineering team.", solution: "Embedded automated compliance gates into the CI/CD pipeline with real-time audit logging." },
    ],
    stack: ["Node.js", "PostgreSQL", "React", "AWS"],
    stats: [
      { label: "Transaction Volume", value: "$8.24M", change: "+16.3%" },
      { label: "Success Rate",       value: "98.7%",  change: "+2.1%"  },
      { label: "Daily Users",        value: "24,691", change: "+8.7%"  },
      { label: "Settlement Time",    value: "1.2s",   change: "−31%"   },
    ],
  },
  {
    num: "02", tagIcon: Icons.heartPulse, category: "Mobile", industry: "Healthcare",
    title: "CareSync EHR",
    body: "HIPAA-compliant electronic health record system deployed across 400+ clinics, unifying patient data, appointment workflows, and clinical documentation at scale.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card2.png",
    client: "CareSync Health",
    overview: "HIPAA-compliant EHR system deployed across 400+ clinics, unifying patient data, appointment workflows, and clinical documentation.",
    metrics: [
      { label: "Compliance",        value: "100%",  pct: 100 },
      { label: "Data Accuracy",     value: "99.9%", pct: 100 },
      { label: "Clinics Connected", value: "400+",  pct: 78  },
    ],
    challenges: [
      { problem: "Fragmented patient records spread across 400+ independent clinics with no shared schema.", solution: "Designed a unified EHR data model with real-time sync and automated conflict resolution." },
      { problem: "HIPAA compliance for sensitive health data across a distributed cloud infrastructure.", solution: "Implemented end-to-end AES-256 encryption, role-based access controls, and a full audit trail." },
    ],
    stack: ["React Native", "Node.js", "MongoDB", "Azure"],
    stats: [
      { label: "Patient Records",   value: "1.2M+",  change: "+24%"  },
      { label: "Compliance",        value: "HIPAA",  change: "100%"  },
      { label: "Connected Clinics", value: "400+",   change: "+18%"  },
      { label: "Data Accuracy",     value: "99.9%",  change: "+1.3%" },
    ],
  },
  {
    num: "03", tagIcon: Icons.chartCombo, category: "Web", industry: "AI Analytics",
    title: "Atlas Analytics",
    body: "Self-serve business intelligence platform that replaced a 3-week reporting cycle with real-time dashboards, cutting data-to-decision time by 60% across all departments.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card3.png",
    client: "Atlas Corp",
    overview: "Self-serve BI platform replacing a 3-week reporting cycle with real-time dashboards, cutting data-to-decision time by 60% across all departments.",
    metrics: [
      { label: "Time to Decision", value: "−60%",   pct: 60 },
      { label: "Model Accuracy",   value: "94.3%",  pct: 94 },
      { label: "Data Processed",   value: "2.4TB/d",pct: 70 },
    ],
    challenges: [
      { problem: "A 3-week manual reporting cycle that made data-driven decisions impossible at speed.", solution: "Replaced batch reports with a real-time streaming dashboard that refreshes on every data event." },
      { problem: "Non-technical teams blocked from accessing data without SQL knowledge.", solution: "Built a natural language query interface that auto-generates and explains SQL behind the scenes." },
    ],
    stack: ["Python", "React", "PostgreSQL", "TensorFlow"],
    stats: [
      { label: "Decisions Automated", value: "68%",      change: "+22%"  },
      { label: "Model Accuracy",      value: "94.3%",    change: "+2%"   },
      { label: "Data Processed",      value: "2.4TB/day",change: "+3%"   },
      { label: "Time to Decision",    value: "−60%",     change: "+35%"  },
    ],
  },
  {
    num: "04", tagIcon: Icons.brainCircuit, category: "Design", industry: "Artificial Intelligence",
    title: "Flint AI",
    body: "Production-grade LLM pipeline powering enterprise AI conversations with fine-tuned models, context memory, and a 0.8s average response time across 120K active users.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card4.png",
    client: "Flint Systems",
    overview: "Production-grade LLM pipeline powering enterprise AI conversations with fine-tuned models and 0.8s average response time across 120K active users.",
    metrics: [
      { label: "Response Time",  value: "0.8s",  pct: 88 },
      { label: "Accuracy Rate",  value: "96.2%", pct: 96 },
      { label: "Active Users",   value: "120K+", pct: 90 },
    ],
    challenges: [
      { problem: "LLM response latency averaging 4s+ made real-time conversation feel broken.", solution: "Implemented response streaming with an intelligent caching layer, cutting perceived latency to 0.8s." },
      { problem: "Context loss in long enterprise conversations leading to inaccurate responses.", solution: "Built a sliding-window memory system with semantic compression to retain relevant context." },
    ],
    stack: ["Python", "FastAPI", "React", "OpenAI"],
    stats: [
      { label: "Active Users",    value: "120K+", change: "+34%"  },
      { label: "Response Time",   value: "0.8s",  change: "−42%"  },
      { label: "Accuracy Rate",   value: "96.2%", change: "+4.1%" },
      { label: "Cost Reduction",  value: "54%",   change: "+12%"  },
    ],
  },
  {
    num: "05", tagIcon: Icons.car, category: "Mobile", industry: "Fleet Management",
    title: "FleetOS",
    body: "Live vehicle tracking and operations platform managing 12,400 assets across 12 countries, delivering 99.8% uptime with real-time alerts and predictive maintenance.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card5.png",
    client: "FleetOS Inc",
    overview: "Live vehicle tracking platform managing 12,400 assets across 12 countries with 99.8% uptime, real-time alerts, and predictive maintenance.",
    metrics: [
      { label: "System Uptime",     value: "99.8%", pct: 100 },
      { label: "Vehicles Tracked",  value: "12.4K", pct: 80  },
      { label: "Fuel Savings",      value: "23%",   pct: 62  },
    ],
    challenges: [
      { problem: "GPS signal gaps in remote regions caused tracking blackouts for hours at a time.", solution: "Deployed an offline-first sync model with edge computing nodes to buffer and reconcile data." },
      { problem: "Fuel waste from suboptimal routing across 12 countries with different traffic patterns.", solution: "Built a dynamic route optimizer using real-time traffic feeds and ML-based demand forecasting." },
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Maps API"],
    stats: [
      { label: "Vehicles Tracked", value: "12,400", change: "+28%"  },
      { label: "Uptime",           value: "99.8%",  change: "+0.6%" },
      { label: "Countries",        value: "12",     change: "+4"    },
      { label: "Fuel Savings",     value: "23%",    change: "+7%"   },
    ],
  },
  {
    num: "06", tagIcon: Icons.briefcase, category: "Web", industry: "Enterprise",
    title: "Veritas Portal",
    body: "End-to-end enterprise workflow modernization eliminating manual processing across 340+ business processes, reducing error rates by 94% and delivering 4.2× ROI in year one.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/card6.png",
    client: "Veritas Group",
    overview: "End-to-end enterprise workflow automation eliminating manual processing across 340+ processes, reducing error rates by 94% and delivering 4.2× ROI.",
    metrics: [
      { label: "Error Rate Reduction", value: "−94%", pct: 94 },
      { label: "Time Saved",           value: "68%",  pct: 68 },
      { label: "ROI Year One",         value: "4.2×", pct: 86 },
    ],
    challenges: [
      { problem: "340+ manual processes with no standardisation, causing a 94% error rate in critical workflows.", solution: "Modelled every process in BPMN, then automated execution with exception handling and escalation paths." },
      { problem: "Legacy Oracle systems unable to communicate with the new cloud-native services.", solution: "Built a middleware abstraction layer using the adapter pattern to bridge old and new without a big-bang migration." },
    ],
    stack: ["React", "Java", "Oracle DB", "Azure"],
    stats: [
      { label: "Processes Automated", value: "340+",  change: "+45%"  },
      { label: "Time Saved",          value: "68%",   change: "+12%"  },
      { label: "Error Rate",          value: "0.02%", change: "−94%"  },
      { label: "ROI",                 value: "4.2×",  change: "+1.1×" },
    ],
  },
  {
    num: "07", tagIcon: Icons.bag, category: "Web", industry: "E-Commerce",
    title: "Kova Commerce",
    body: "Headless DTC storefront with AI-driven product recommendations and a rebuilt checkout flow that reduced cart abandonment by 60% and lifted conversions by 2.8×.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/Service.png",
    client: "Kova Brand",
    overview: "Headless DTC storefront with AI product recommendations that reduced cart abandonment by 60% and lifted conversions 2.8×.",
    metrics: [
      { label: "Conversion Rate",  value: "+180%",  pct: 90 },
      { label: "Page Speed",       value: "98/100", pct: 98 },
      { label: "Cart Abandonment", value: "−60%",   pct: 60 },
    ],
    challenges: [
      { problem: "A complex, multi-step checkout flow causing 60% of customers to abandon before payment.", solution: "Redesigned to a single-page checkout with persistent cart state and one-tap payment options." },
      { problem: "Generic product recommendations failing to drive upsells or repeat purchases.", solution: "Trained an ML model on purchase history and browsing signals to deliver personalised suggestions in real time." },
    ],
    stack: ["Next.js", "Shopify", "Tailwind", "Vercel"],
    stats: [
      { label: "Conversion Rate",  value: "2.8×",   change: "+180%" },
      { label: "Avg Order Value",  value: "+34%",   change: "+34%"  },
      { label: "Cart Abandonment", value: "−60%",   change: "−60%"  },
      { label: "Page Speed",       value: "98/100", change: "+41pts"},
    ],
  },
  {
    num: "08", tagIcon: Icons.brainCircuit, category: "Design", industry: "AI Automation",
    title: "Nexus AI Suite",
    body: "Internal AI agent platform that automates lead qualification, CRM updates, and competitive research — saving each team 14 hours per week without adding headcount.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/Blog.png",
    client: "Nexus Technologies",
    overview: "Internal AI agent platform automating lead qualification, CRM updates, and competitive research — saving each team 14 hours per week.",
    metrics: [
      { label: "Leads Qualified",    value: "94%",   pct: 94 },
      { label: "CRM Accuracy",       value: "99.1%", pct: 99 },
      { label: "Ops Cost Reduction", value: "41%",   pct: 72 },
    ],
    challenges: [
      { problem: "Sales reps spending 14+ hours per week manually qualifying leads against ICP criteria.", solution: "Deployed an NLP agent that scores inbound leads automatically and routes only qualified ones to reps." },
      { problem: "CRM data decaying from inconsistent manual entry across the sales team.", solution: "Automated CRM updates by parsing emails and meeting transcripts, keeping records accurate without manual effort." },
    ],
    stack: ["Python", "LangChain", "React", "Postgres"],
    stats: [
      { label: "Hours Saved / Week", value: "14h",   change: "per team" },
      { label: "Leads Qualified",    value: "94%",   change: "auto"     },
      { label: "CRM Accuracy",       value: "99.1%", change: "+18%"     },
      { label: "Ops Cost Reduction", value: "41%",   change: "+9%"      },
    ],
  },
  {
    num: "09", tagIcon: Icons.smartphone, category: "Mobile", industry: "EdTech",
    title: "Lumio Learn",
    body: "Mobile-first learning platform serving 80K+ students with adaptive lesson paths, live tutoring sessions, and progress analytics that increased course completion by 31%.",
    accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)", image: "/About.png",
    client: "Lumio Education",
    overview: "Mobile-first learning platform serving 80K+ students with adaptive lesson paths and analytics that increased course completion by 31%.",
    metrics: [
      { label: "Course Completion", value: "78%",  pct: 78  },
      { label: "Active Students",   value: "80K+", pct: 85  },
      { label: "Tutor Rating",      value: "4.9★", pct: 98  },
    ],
    challenges: [
      { problem: "A one-size-fits-all curriculum that lost student engagement after the first few lessons.", solution: "Built adaptive learning paths that adjust difficulty and topic sequencing based on live performance data." },
      { problem: "High drop-off rates as students lost motivation without accountability mechanisms.", solution: "Introduced streaks, peer challenges, and social progress sharing to sustain long-term engagement." },
    ],
    stack: ["React Native", "Node.js", "MongoDB", "AWS"],
    stats: [
      { label: "Active Students",   value: "80K+",  change: "+62%"  },
      { label: "Course Completion", value: "78%",   change: "+31%"  },
      { label: "Avg Session Time",  value: "42min", change: "+18%"  },
      { label: "Tutor Rating",      value: "4.9★",  change: "+0.4"  },
    ],
  },
];
