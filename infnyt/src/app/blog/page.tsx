import type { Metadata } from "next";
import BlogHero from "@/components/BlogHero";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — InfinytTech",
  description:
    "Insights, guides, and ideas on web development, AI, cloud, and digital transformation from the InfinytTech team.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogHero />
      <BlogGrid />
    </main>
  );
}
