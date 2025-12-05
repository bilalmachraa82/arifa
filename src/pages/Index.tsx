import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { SegmentSelector } from "@/components/home/SegmentSelector";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SegmentSelector />
      <AboutSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
