import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Insights() {
  const { language } = useLanguage();

  const insights = [
    {
      id: "guia-construcao-portugal",
      title: language === "pt"
        ? "Guia Completo para Construir Casa em Portugal em 2026"
        : "Complete Guide to Building a House in Portugal in 2026",
      description: language === "pt"
        ? "Da escolha do terreno à entrega das chaves: custos, prazos, licenciamento e como escolher o arquitecto certo."
        : "From choosing the land to handing over the keys: costs, timelines, licensing and how to choose the right architect.",
      category: language === "pt" ? "Particulares" : "Private",
      readTime: "12 min",
      href: "/insights/guia-construcao-portugal",
    },
    {
      id: "reabilitacao-eficiencia-energetica",
      title: language === "pt"
        ? "Reabilitação de Escritórios: BIM e Eficiência Energética"
        : "Office Renovation: BIM and Energy Efficiency",
      description: language === "pt"
        ? "Como a tecnologia BIM e o design sustentável transformam espaços comerciais, reduzem custos e valorizam o imóvel."
        : "How BIM technology and sustainable design transform commercial spaces, reduce costs and increase property value.",
      category: language === "pt" ? "Empresas" : "Companies",
      readTime: "10 min",
      href: "/insights/reabilitacao-eficiencia-energetica",
    },
    {
      id: "investimento-imobiliario-lisboa",
      title: language === "pt"
        ? "Investir em Imobiliário em Lisboa: Guia para Investidores 2026"
        : "Real Estate Investment in Lisbon: Investor Guide 2026",
      description: language === "pt"
        ? "Zonas com maior potencial, retorno esperado, benefícios fiscais e o papel da arquitectura na valorização."
        : "Areas with highest potential, expected returns, tax benefits and the role of architecture in value creation.",
      category: language === "pt" ? "Investidores" : "Investors",
      readTime: "15 min",
      href: "/insights/investimento-imobiliario-lisboa",
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

      {/* Articles Grid */}
      <section className="py-24">
        <div className="container-arifa">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((insight, i) => (
              <AnimatedSection key={insight.id} animation="fade-up" delay={i * 100}>
                <Link to={insight.href} className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-shadow border-border group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {insight.category}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {insight.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                        {insight.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{insight.readTime}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          {language === "pt" ? "Ler artigo" : "Read article"}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact CTA */}
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="mt-16 text-center p-8 rounded-xl bg-card border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {language === "pt"
                  ? "Precisa de ajuda com o seu projecto?"
                  : "Need help with your project?"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "pt"
                  ? "Fale connosco para discutir as suas necessidades e descobrir como podemos ajudar."
                  : "Talk to us to discuss your needs and find out how we can help."}
              </p>
              <Button asChild>
                <a href="/contacto">
                  {language === "pt" ? "Contactar" : "Contact Us"}
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
