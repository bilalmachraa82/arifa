import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightDocument {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  created_at: string;
}

export default function Insights() {
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<InsightDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await supabase.storage
        .from("public-downloads")
        .list("", { limit: 100 });

      // For now, show placeholder content since the bucket may not exist yet
      setDocuments([]);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Placeholder insights for when storage is empty
  const placeholderInsights = [
    {
      id: "1",
      title: language === "pt" ? "Guia BIM para Proprietários" : "BIM Guide for Owners",
      description: language === "pt"
        ? "Descubra como a metodologia BIM pode reduzir custos e prazos no seu projeto de construção."
        : "Discover how BIM methodology can reduce costs and timelines in your construction project.",
      category: "BIM",
      file_type: "pdf",
    },
    {
      id: "2",
      title: language === "pt" ? "Tendências de Arquitetura 2026" : "Architecture Trends 2026",
      description: language === "pt"
        ? "As principais tendências em design sustentável, materiais inovadores e eficiência energética."
        : "Key trends in sustainable design, innovative materials and energy efficiency.",
      category: language === "pt" ? "Tendências" : "Trends",
      file_type: "pdf",
    },
    {
      id: "3",
      title: language === "pt" ? "Checklist de Projeto Residencial" : "Residential Project Checklist",
      description: language === "pt"
        ? "Tudo o que precisa de preparar antes de iniciar o projeto da sua nova casa."
        : "Everything you need to prepare before starting your new home project.",
      category: language === "pt" ? "Guias" : "Guides",
      file_type: "pdf",
    },
  ];

  return (
    <Layout>
      <SEO
        title={language === "pt" ? "Insights & Downloads" : "Insights & Downloads"}
        description={language === "pt"
          ? "Recursos gratuitos sobre arquitetura, BIM, sustentabilidade e tendências. Descarregue guias, checklists e relatórios."
          : "Free resources on architecture, BIM, sustainability and trends. Download guides, checklists and reports."
        }
        url="https://www.arifa.studio/insights"
        breadcrumbs={[
          { name: language === "pt" ? "Início" : "Home", url: "https://www.arifa.studio" },
          { name: "Insights", url: "https://www.arifa.studio/insights" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-accent/30">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-[0.3em] text-accent-foreground/70 uppercase mb-4">
                {language === "pt" ? "Recursos" : "Resources"}
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Insights & Downloads
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {language === "pt"
                  ? "Partilhamos conhecimento e recursos gratuitos sobre arquitetura, BIM, sustentabilidade e tendências do setor. Descarregue os nossos guias e relatórios."
                  : "We share knowledge and free resources on architecture, BIM, sustainability and industry trends. Download our guides and reports."}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-24">
        <div className="container-arifa">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placeholderInsights.map((doc, i) => (
                <AnimatedSection key={doc.id} animation="fade-up" delay={i * 100}>
                  <Card className="h-full hover:shadow-lg transition-shadow border-border">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                        {doc.description}
                      </p>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-2" disabled>
                          <Eye className="h-4 w-4" />
                          {language === "pt" ? "Pré-visualizar" : "Preview"}
                        </Button>
                        <Button size="sm" className="flex-1 gap-2" disabled>
                          <Download className="h-4 w-4" />
                          {language === "pt" ? "Descarregar" : "Download"}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center mt-3">
                        {language === "pt" ? "Em breve disponível" : "Coming soon"}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-16 text-center p-8 rounded-xl bg-card border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {language === "pt"
                  ? "Quer receber novos recursos?"
                  : "Want to receive new resources?"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "pt"
                  ? "Subscreva a nossa newsletter para receber guias, artigos e insights diretamente no seu email."
                  : "Subscribe to our newsletter to receive guides, articles and insights directly to your email."}
              </p>
              <Button asChild>
                <a href="/#newsletter">
                  {language === "pt" ? "Subscrever Newsletter" : "Subscribe to Newsletter"}
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
