import AboutHero from '../sections/AboutHero';
import OurStorySection from '../sections/OurStorySection';
import MissionVisionValues from '../sections/MissionVisionValues';
import WhyChooseUs from '../sections/WhyChooseUs';
import CapabilitiesSection from '../sections/CapabilitiesSection';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export default function AboutPage({ theme }: AboutPageProps) {
  return (
    <div className="animate-fade-in">
      <AboutHero theme={theme} />
      <OurStorySection theme={theme} />
      <MissionVisionValues theme={theme} />
      <WhyChooseUs theme={theme} />
      <CapabilitiesSection theme={theme} />
      <InteractiveCtaSection theme={theme} />
    </div>
  );
}
