import ServicesHeroSection from '../sections/ServicesHeroSection';
import ServiceExplorer from '../sections/ServiceExplorer';
import IndustriesSection from '../sections/IndustriesSection';
import WorkflowTimeline from '../sections/WorkflowTimeline';
import WhyInfinytTechSection from '../sections/WhyInfinytTechSection';
import ServicesFaqSection from '../sections/ServicesFaqSection';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';
import { SchemaOrg } from '../components/seo/SchemaOrg';
import Breadcrumb from '../components/ui/Breadcrumb';
import Container from '../components/layout/Container';

interface ServicesPageProps {
  theme: 'dark' | 'light';
}

export default function ServicesPage({ theme }: ServicesPageProps) {
  return (
    <div className="animate-fade-in">
      <SchemaOrg
        breadcrumbs={[
          { name: 'Services & Solutions', url: '/services' },
        ]}
        schema={{
          '@type': 'Service',
          serviceType: 'Enterprise Software Engineering & Digital Transformation',
          provider: {
            '@type': 'Organization',
            name: 'Infinity Technologies',
          },
          areaServed: 'Worldwide',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Engineering Offerings',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise Systems Engineering' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & DevOps Architecture' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI & Data Intelligence' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Product & UX Design' } },
            ],
          },
        }}
      />

      <div className="pt-24 pb-2 border-b border-border-primary/40 bg-surface-muted/30">
        <Container size="lg">
          <Breadcrumb
            theme={theme}
            items={[{ label: 'Services & Solutions', href: '/services', isCurrent: true }]}
          />
        </Container>
      </div>

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
