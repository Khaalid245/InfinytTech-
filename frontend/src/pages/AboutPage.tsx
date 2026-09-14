import AboutHero from '../sections/AboutHero';
import OurStorySection from '../sections/OurStorySection';
import MissionVisionValues from '../sections/MissionVisionValues';
import WhyChooseUs from '../sections/WhyChooseUs';
import CapabilitiesSection from '../sections/CapabilitiesSection';
import HorizontalJourney from '../sections/HorizontalJourney';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';
import TeamSection from '../sections/TeamSection';
import { SchemaOrg } from '../components/seo/SchemaOrg';
import Breadcrumb from '../components/ui/Breadcrumb';
import Container from '../components/layout/Container';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export default function AboutPage({ theme }: AboutPageProps) {
  return (
    <div className="animate-fade-in">
      <SchemaOrg
        breadcrumbs={[
          { name: 'About Us', url: '/about' },
        ]}
        schema={{
          '@type': 'AboutPage',
          name: 'About Infinity Technologies',
          description: 'Learn about our engineering philosophy, mission, executive leadership team, and global enterprise impact.',
        }}
      />

      <div className="pt-24 pb-2 border-b border-border-primary/40 bg-surface-muted/30">
        <Container size="lg">
          <Breadcrumb
            theme={theme}
            items={[{ label: 'About Us', href: '/about', isCurrent: true }]}
          />
        </Container>
      </div>

      <AboutHero theme={theme} />
      <OurStorySection theme={theme} />
      <MissionVisionValues theme={theme} />
      <WhyChooseUs theme={theme} />
      <TeamSection theme={theme} />
      <CapabilitiesSection theme={theme} />
      <HorizontalJourney theme={theme} />
      <InteractiveCtaSection theme={theme} />
    </div>
  );
}
