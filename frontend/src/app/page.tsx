import HomeHero from "@/components/sections/HomeHero";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ServicesSection />
      <ProjectsSection />
      <WhyChooseSection />
      <TestimonialSection />
    </main>
  );
}
