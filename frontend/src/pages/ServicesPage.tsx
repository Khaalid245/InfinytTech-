import ServicesHeroSection from '../sections/ServicesHeroSection';
import ServiceExplorer from '../sections/ServiceExplorer';
import IndustriesSection from '../sections/IndustriesSection';
import WorkflowTimeline from '../sections/WorkflowTimeline';
import WhyInfinytTechSection from '../sections/WhyInfinytTechSection';
import ServicesFaqSection from '../sections/ServicesFaqSection';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';

interface ServicesPageProps {
  theme: 'dark' | 'light';
}

export default function ServicesPage({ theme }: ServicesPageProps) {
  return (
    <div className="animate-fade-in">
      {/* 1. Hero */}
      <ServicesHeroSection theme={theme} />

      {/* 2. Interactive Service Explorer */}
      <div id="capabilities">
        <ServiceExplorer theme={theme} />
      </div>

      {/* 3. Industries We Serve */}
      <div id="industries">
        <IndustriesSection theme={theme} />
      </div>

      {/* 4. Our Delivery Process */}
      <div id="process">
        <WorkflowTimeline theme={theme} />
      </div>

      {/* 5. Why Choose Us */}
      <div id="why-infinyttech">
        <WhyInfinytTechSection theme={theme} />
      </div>

      {/* 6. Frequently Asked Questions */}
      <div id="faq">
        <ServicesFaqSection theme={theme} />
      </div>

      {/* 7. Final Call To Action */}
      <InteractiveCtaSection theme={theme} />
    </div>
  );
}
