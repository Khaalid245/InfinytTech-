import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutValues from "@/components/AboutValues";
import AboutTeam from "@/components/AboutTeam";

export const metadata: Metadata = {
  title: "About — InfinytTech",
  description:
    "Production systems, senior engineers, and one accountable team behind InfinytTech.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutValues />
      <AboutTeam />
    </main>
  );
}
