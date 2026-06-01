import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import WhyChoose from "@/components/WhyChoose";
import Industries from "@/components/Industries";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Industries />
      <Services />
      <Projects />
      <WhyChoose />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
