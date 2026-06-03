import AboutHero from '../sections/AboutHero';
import OurStorySection from '../sections/OurStorySection';
import MissionVisionValues from '../sections/MissionVisionValues';
import CoreValuesSection from '../sections/CoreValuesSection';
import WhyChooseUs from '../sections/WhyChooseUs';
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
      <CoreValuesSection theme={theme} />
      <WhyChooseUs theme={theme} />
      <InteractiveCtaSection theme={theme} />
    </div>
  );
}
