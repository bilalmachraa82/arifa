import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustSignals } from "@/components/home/TrustSignals";
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
        description="ARIFA Studio - Arquitectura que transforma. Tecnologia que entrega. 20 anos de experiência internacional. BIM Level 2 certified."
        url="https://arifa.studio"
        keywords="arquitetura Lisboa, estúdio de arquitetura Portugal, design de interiores, BIM, projetos residenciais, arquitetura corporativa, investimento imobiliário"
        breadcrumbs={[
          { name: "Início", url: "https://arifa.studio" }
        ]}
      />
      <HeroSection />
      <TrustSignals />
      <SegmentSelector />
      <AboutSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
