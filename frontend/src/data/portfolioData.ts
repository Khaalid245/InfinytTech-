export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  category: 'all' | 'ai' | 'saas' | 'web' | 'mobile';
  metric: string;
  challenge: string;
  architecture: string;
  outcome: string;
  stack: string[];
  accentIcon: string;
  imageUrl: string;
}

export interface LibraryProject {
  id: string;
  title: string;
  industry: string;
  type: 'web' | 'mobile' | 'ai' | 'enterprise' | 'uiux' | 'cloud';
  categoryLabel: string;
  description: string;
  challenge: string;
  solution: string;
  stack: string[];
  imageUrl: string;
  accentIcon: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'healthcare',
    title: 'Healthcare Management Platform',
    industry: 'Healthcare Technology',
    category: 'mobile',
    metric: '92% Intake Speedup',
    challenge:
      'Manual paper logging delayed emergency intake processes, while unstable power grids caused data loss at clinics serving 50k+ patients annually.',
    architecture:
      'Designed a secure mobile client using Flutter and SQLite local sync nodes, employing conflict-free replicated data types (CRDT) for offline database coordination.',
    outcome:
      'Eliminated intake bottlenecks and data losses by synchronizing clinic databases automatically, securing 32,000+ patient identities across 14 remote sites.',
    stack: ['Flutter', 'SQLite', 'Node.js', 'Docker', 'Azure'],
    accentIcon: '🏥',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'real-estate',
    title: 'Real Estate Management System',
    industry: 'PropTech & Real Estate',
    category: 'web',
    metric: '$4M+ Volume Managed',
    challenge:
      'Lack of centralized spatial data led to boundary verification disputes and slow, manual property listing checks for municipal corridors.',
    architecture:
      'Built a spatial indexing engine using Next.js and PostgreSQL PostGIS coordinates cache, executing sub-50ms regional proximity queries.',
    outcome:
      'Automated boundary verification checks and accelerated deal closures, facilitating over $4M in commercial real estate sales within 8 months.',
    stack: ['Next.js', 'PostGIS', 'Node.js', 'TailwindCSS', 'Vercel'],
    accentIcon: '🏙️',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ai-assistant',
    title: 'AI Customer Support Assistant',
    industry: 'Artificial Intelligence',
    category: 'ai',
    metric: '350% Retention Growth',
    challenge:
      'High support ticket volume and slow connectivity caused delayed user replies, leading to cart abandonments and customer churn.',
    architecture:
      'Developed a WebAssembly-compiled ONNX neural network running natively inside client browsers, providing local dialect-aware voice translation.',
    outcome:
      'Automated instant responses to dialect queries locally on the user device, scaling active session capacity and improving user retention by 350%.',
    stack: ['Python', 'ONNX Runtime', 'WebAssembly', 'React', 'MongoDB'],
    accentIcon: '🧠',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'saas-dashboard',
    title: 'Enterprise SaaS Dashboard',
    industry: 'Financial Technology',
    category: 'saas',
    metric: '$14M Vol Settled',
    challenge:
      'Slow manual compliance audits and high network latency delayed cross-border payments, causing transaction drops during peak settlement hours.',
    architecture:
      'Constructed a Go microservices architecture using gRPC schemas and a distributed Saga pattern to manage multi-step cross-border transfers.',
    outcome:
      'Secured compliance validations in sub-second timelines and reduced transaction failure rates to <0.02%, settling over $14M in remittance volume.',
    stack: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'AWS'],
    accentIcon: '💳',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
];

export const PROJECTS: LibraryProject[] = [
  {
    id: 'telehealth',
    title: 'Telehealth Consultation App',
    industry: 'Healthcare',
    type: 'mobile',
    categoryLabel: 'Mobile Applications',
    description: 'HIPAA-compliant video consult portal with real-time patient queue metrics and automatic prescription routing.',
    challenge: 'High latency in remote rural locations and difficulty securing patient medical history logs.',
    solution: 'Engineered an offline-first patient record database synchronization module using local encryption protocols.',
    stack: ['React Native', 'WebRTC', 'Express', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    accentIcon: '📱',
  },
  {
    id: 'trading-engine',
    title: 'Asset Allocation & Trading Engine',
    industry: 'FinTech',
    type: 'enterprise',
    categoryLabel: 'Enterprise Systems',
    description: 'High-frequency portfolio rebalancing platform serving institutional asset managers with real-time risk gauges.',
    challenge: 'Processing peak transaction loads during high volatility markets with sub-millisecond reliability.',
    solution: 'Designed an event-driven messaging topology using Kafka and distributed state machines in Go.',
    stack: ['Go', 'Kafka', 'Redis', 'React', 'ClickHouse'],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    accentIcon: '📈',
  },
  {
    id: 'logistics',
    title: 'Smart Logistics Routing Portal',
    industry: 'Logistics',
    type: 'web',
    categoryLabel: 'Web Applications',
    description: 'Real-time fleet optimization dashboard utilizing genetic algorithms to reduce transit delays and fuel expenditure.',
    challenge: 'Solving multi-variable dispatch routes dynamically with thousands of active transport nodes.',
    solution: 'Implemented genetic optimization pathfinders run asynchronously in Python FastAPI microservices.',
    stack: ['Next.js', 'Python', 'Google Maps API', 'FastAPI'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    accentIcon: '🚚',
  },
  {
    id: 'lms',
    title: 'Interactive Learning Management Portal',
    industry: 'Education',
    type: 'web',
    categoryLabel: 'Web Applications',
    description: 'Collaborative virtual classroom environment with interactive whiteboards and offline course progress synchronization.',
    challenge: 'High student drop-off rates and slow video delivery networks across rural hubs.',
    solution: 'Engineered low-bandwidth web socket broadcast lines paired with local progress state storage.',
    stack: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    accentIcon: '🎓',
  },
  {
    id: 'ocr-classifier',
    title: 'AI Automated Document Classifier',
    industry: 'Enterprise',
    type: 'ai',
    categoryLabel: 'AI Solutions',
    description: 'Transformer-based OCR processing engine designed to classify and extract metadata from structured legal agreements.',
    challenge: 'Manual extraction errors and slow document turnarounds for corporate legal departments.',
    solution: 'Structured a bespoke NLP extraction model deployed on edge-optimized inference servers.',
    stack: ['Python', 'PyTorch', 'FastAPI', 'TailwindCSS'],
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    accentIcon: '🤖',
  },
  {
    id: 'cloud-logger',
    title: 'Cloud-Native Logging System',
    industry: 'Enterprise',
    type: 'cloud',
    categoryLabel: 'Cloud Platforms',
    description: 'Distributed log aggregator running on ClickHouse, handling 50k+ logs per second with customizable anomaly alarms.',
    challenge: 'Extremely high write loads leading to database locks and expensive hosting budgets.',
    solution: 'Built a custom buffer streaming architecture that batches queries before flushing to disk.',
    stack: ['Golang', 'ClickHouse', 'Docker', 'Grafana'],
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    accentIcon: '☁️',
  },
  {
    id: 'procurement',
    title: 'B2B SaaS Procurement Portal',
    industry: 'Logistics',
    type: 'enterprise',
    categoryLabel: 'Enterprise Systems',
    description: 'Multi-tenant vendor bidding interface with automatic invoice parsing and enterprise single sign-on (SSO) support.',
    challenge: 'Vulnerability to fraud and slow manual approvals of enterprise bidding requests.',
    solution: 'Programmed automatic vendor validation checks and automated invoice parsing via OCR workflows.',
    stack: ['Next.js', 'PostgreSQL', 'GraphQL', 'Node.js'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    accentIcon: '💼',
  },
  {
    id: 'design-system',
    title: 'E-Commerce Visual Design System',
    industry: 'Retail',
    type: 'uiux',
    categoryLabel: 'UI/UX Design',
    description: 'Framework atomic design library and component repository customized for high-conversion fashion checkouts.',
    challenge: 'Fragmented checkout branding and high shopping cart drop-off rates on mobile viewports.',
    solution: 'Designed and prototyped responsive, high-performance checkout patterns focusing on thumb reach zones.',
    stack: ['Figma', 'React', 'Storybook', 'TailwindCSS'],
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    accentIcon: '🎨',
  },
];
