import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { SegmentSelector } from "@/components/home/SegmentSelector";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Início"
        description="ARIFA Studio - Estúdio de arquitetura e design de interiores em Lisboa. Transformamos espaços com abordagem integrada, tecnologia BIM e foco na sustentabilidade."
        url="https://arifa.studio"
      />
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
