import ServicesHeroSection from '../sections/ServicesHeroSection';
import ServiceExplorer from '../sections/ServiceExplorer';
import WorkflowTimeline from '../sections/WorkflowTimeline';
import TechStackSection from '../sections/TechStackSection';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';

interface ServicesPageProps {
  theme: 'dark' | 'light';
}

export default function ServicesPage({ theme }: ServicesPageProps) {
  return (
    <div className="animate-fade-in">
      <ServicesHeroSection theme={theme} />
      <div id="capabilities">
        <ServiceExplorer theme={theme} />
      </div>
      <div id="process">
        <WorkflowTimeline theme={theme} />
      </div>
      <div id="tech-stack">
        <TechStackSection theme={theme} />
      </div>
      <InteractiveCtaSection theme={theme} />
    </div>
  );
}
