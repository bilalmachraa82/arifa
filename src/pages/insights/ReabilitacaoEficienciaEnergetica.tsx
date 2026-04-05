import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ReabilitacaoEficienciaEnergetica() {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEO
        title={language === "pt"
          ? "Reabilitação de Escritórios: BIM e Eficiência Energética"
          : "Office Renovation: BIM and Energy Efficiency"}
        description={language === "pt"
          ? "Como a metodologia BIM e o design sustentável transformam espaços comerciais. Guia para empresas sobre reabilitação de escritórios com eficiência energética em Portugal."
          : "How BIM methodology and sustainable design transform commercial spaces. Guide for companies on energy-efficient office renovation in Portugal."}
        url="https://www.arifa.studio/insights/reabilitacao-eficiencia-energetica"
        type="article"
        publishedTime="2026-04-05"
        author="ARIFA Studio"
        articleSection="Empresas"
        keywords={language === "pt"
          ? "reabilitação escritórios, BIM arquitectura, eficiência energética edifícios, renovação espaço comercial, certificação energética, arquitectura sustentável empresa"
          : "office renovation, BIM architecture, building energy efficiency, commercial space renovation, energy certification, sustainable corporate architecture"}
        breadcrumbs={[
          { name: language === "pt" ? "Início" : "Home", url: "https://www.arifa.studio" },
          { name: "Insights", url: "https://www.arifa.studio/insights" },
          { name: language === "pt" ? "Reabilitação e Eficiência" : "Renovation and Efficiency", url: "https://www.arifa.studio/insights/reabilitacao-eficiencia-energetica" },
        ]}
        faq={language === "pt" ? [
          { question: "O que é BIM e como ajuda na reabilitação de escritórios?", answer: "BIM (Building Information Modeling) é uma metodologia que cria um modelo digital 3D do edifício com toda a informação técnica integrada. Na reabilitação, permite simular intervenções antes de as executar, detectar conflitos entre especialidades, controlar custos e prazos com maior precisão." },
          { question: "Quanto se pode poupar com eficiência energética num escritório?", answer: "Uma reabilitação energética bem planeada pode reduzir os custos de energia em 30% a 60%. O retorno do investimento varia tipicamente entre 3 a 7 anos, dependendo das medidas implementadas e do estado actual do edifício." },
          { question: "A certificação energética é obrigatória para escritórios?", answer: "Sim. Em Portugal, todos os edifícios de serviços com mais de 250m² são obrigados a ter certificação energética (SCE). Edifícios com melhor classificação têm vantagens fiscais e são mais atractivos para inquilinos." },
        ] : [
          { question: "What is BIM and how does it help in office renovation?", answer: "BIM (Building Information Modeling) is a methodology that creates a 3D digital model of the building with all technical information integrated. In renovation, it allows simulating interventions before executing them, detecting conflicts between specialties, and controlling costs and timelines with greater precision." },
          { question: "How much can you save with energy efficiency in an office?", answer: "A well-planned energy renovation can reduce energy costs by 30% to 60%. Return on investment typically ranges from 3 to 7 years, depending on the measures implemented and the current state of the building." },
          { question: "Is energy certification mandatory for offices?", answer: "Yes. In Portugal, all service buildings over 250m² are required to have energy certification (SCE). Buildings with better ratings have tax advantages and are more attractive to tenants." },
        ]}
      />

      <article>
        {/* Hero */}
        <section className="relative py-24 lg:py-32 bg-accent/30">
          <div className="container-arifa">
            <AnimatedSection animation="fade-up">
              <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                {language === "pt" ? "Voltar a Insights" : "Back to Insights"}
              </Link>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {language === "pt" ? "Empresas" : "Companies"}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {language === "pt" ? "10 min de leitura" : "10 min read"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  ARIFA Studio
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
                {language === "pt"
                  ? "Reabilitação de Escritórios: BIM e Eficiência Energética"
                  : "Office Renovation: BIM and Energy Efficiency"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {language === "pt"
                  ? "Como a tecnologia BIM e o design sustentável podem transformar o espaço de trabalho da sua empresa, reduzir custos operacionais e valorizar o imóvel."
                  : "How BIM technology and sustainable design can transform your company's workspace, reduce operational costs and increase property value."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container-arifa">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">

              <AnimatedSection animation="fade-up">
                <h2>{language === "pt" ? "Por Que Reabilitar em Vez de Construir Novo?" : "Why Renovate Instead of Building New?"}</h2>
                <p>
                  {language === "pt"
                    ? "A reabilitação de espaços comerciais existentes é frequentemente mais vantajosa do que a construção nova: menor impacto ambiental, prazos mais curtos, possibilidade de manter a localização, e benefícios fiscais significativos em Portugal (IVA reduzido de 6% em zonas de reabilitação urbana, isenção de IMI até 5 anos)."
                    : "Renovating existing commercial spaces is often more advantageous than new construction: lower environmental impact, shorter timelines, ability to maintain location, and significant tax benefits in Portugal (reduced 6% VAT in urban rehabilitation zones, IMI exemption up to 5 years)."}
                </p>
                <p>
                  {language === "pt"
                    ? "No entanto, uma reabilitação mal planeada pode custar mais do que o previsto e gerar problemas estruturais. É aqui que a combinação de BIM com arquitectura especializada faz a diferença."
                    : "However, a poorly planned renovation can cost more than expected and generate structural problems. This is where the combination of BIM with specialized architecture makes the difference."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "O Que é BIM e Como Funciona" : "What is BIM and How It Works"}</h2>
                <p>
                  {language === "pt"
                    ? "BIM (Building Information Modeling) não é apenas um software 3D — é uma metodologia de trabalho colaborativa que integra toda a informação do edifício num modelo digital único."
                    : "BIM (Building Information Modeling) is not just 3D software — it's a collaborative work methodology that integrates all building information into a single digital model."}
                </p>
                <h3>{language === "pt" ? "Vantagens do BIM na reabilitação:" : "BIM advantages in renovation:"}</h3>
                <ul>
                  <li><strong>{language === "pt" ? "Detecção de conflitos" : "Clash detection"}</strong> — {language === "pt" ? "Identifica interferências entre estrutura, AVAC, electricidade e canalização antes da obra, evitando erros caros." : "Identifies interference between structure, HVAC, electrical and plumbing before construction, avoiding expensive errors."}</li>
                  <li><strong>{language === "pt" ? "Simulação energética" : "Energy simulation"}</strong> — {language === "pt" ? "Permite testar diferentes cenários de isolamento, iluminação e climatização para encontrar a solução óptima." : "Allows testing different insulation, lighting and HVAC scenarios to find the optimal solution."}</li>
                  <li><strong>{language === "pt" ? "Controlo de custos" : "Cost control"}</strong> — {language === "pt" ? "Quantificação automática de materiais e mão-de-obra, com actualizações em tempo real à medida que o projecto evolui." : "Automatic quantification of materials and labor, with real-time updates as the project evolves."}</li>
                  <li><strong>{language === "pt" ? "Gestão de obra" : "Construction management"}</strong> — {language === "pt" ? "O modelo BIM serve como referência durante toda a construção, através de plataformas como a DALUX." : "The BIM model serves as a reference throughout construction, via platforms like DALUX."}</li>
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "Eficiência Energética: Onde Investir" : "Energy Efficiency: Where to Invest"}</h2>
                <p>
                  {language === "pt"
                    ? "As principais áreas de intervenção para melhorar a eficiência energética de um escritório existente:"
                    : "The main areas of intervention to improve the energy efficiency of an existing office:"}
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>{language === "pt" ? "Medida" : "Measure"}</th>
                      <th>{language === "pt" ? "Poupança estimada" : "Estimated savings"}</th>
                      <th>{language === "pt" ? "Retorno" : "ROI"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{language === "pt" ? "Iluminação LED + sensores" : "LED lighting + sensors"}</td>
                      <td>40-60%</td>
                      <td>1-2 {language === "pt" ? "anos" : "years"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Isolamento térmico fachada" : "Facade thermal insulation"}</td>
                      <td>25-40%</td>
                      <td>5-8 {language === "pt" ? "anos" : "years"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Caixilharia eficiente" : "Efficient windows"}</td>
                      <td>15-25%</td>
                      <td>4-6 {language === "pt" ? "anos" : "years"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Sistema AVAC moderno" : "Modern HVAC system"}</td>
                      <td>30-50%</td>
                      <td>3-5 {language === "pt" ? "anos" : "years"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Painéis fotovoltaicos" : "Photovoltaic panels"}</td>
                      <td>20-40%</td>
                      <td>5-7 {language === "pt" ? "anos" : "years"}</td>
                    </tr>
                  </tbody>
                </table>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "Certificação Energética para Edifícios de Serviços" : "Energy Certification for Service Buildings"}</h2>
                <p>
                  {language === "pt"
                    ? "Em Portugal, o Sistema de Certificação Energética (SCE) classifica os edifícios de A+ (mais eficiente) a F (menos eficiente). Para edifícios de serviços com mais de 250m², a certificação é obrigatória e deve ser renovada periodicamente."
                    : "In Portugal, the Energy Certification System (SCE) classifies buildings from A+ (most efficient) to F (least efficient). For service buildings over 250m², certification is mandatory and must be renewed periodically."}
                </p>
                <h3>{language === "pt" ? "Benefícios de melhor classificação:" : "Benefits of better rating:"}</h3>
                <ul>
                  <li>{language === "pt" ? "Redução significativa dos custos de energia (30-60%)" : "Significant reduction in energy costs (30-60%)"}</li>
                  <li>{language === "pt" ? "Valorização do imóvel (8-14% segundo estudos europeus)" : "Property value increase (8-14% according to European studies)"}</li>
                  <li>{language === "pt" ? "Maior atractividade para inquilinos e colaboradores" : "Greater attractiveness for tenants and employees"}</li>
                  <li>{language === "pt" ? "Cumprimento de directivas europeias (EPBD recast)" : "Compliance with European directives (EPBD recast)"}</li>
                  <li>{language === "pt" ? "Elegibilidade para financiamento verde (PRR, IFRRU 2020)" : "Eligibility for green financing (PRR, IFRRU 2020)"}</li>
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "Caso Prático: Reabilitação com BIM" : "Case Study: BIM-Driven Renovation"}</h2>
                <p>
                  {language === "pt"
                    ? "Num projecto típico de reabilitação de escritório de 500m² em Lisboa, a utilização de BIM permitiu:"
                    : "In a typical 500m² office renovation project in Lisbon, using BIM enabled:"}
                </p>
                <ul>
                  <li>{language === "pt" ? "Redução de 15% nos custos face ao orçamento inicial (detecção precoce de conflitos)" : "15% cost reduction vs initial budget (early clash detection)"}</li>
                  <li>{language === "pt" ? "Prazo de obra reduzido em 3 semanas (melhor coordenação entre equipas)" : "Construction timeline reduced by 3 weeks (better team coordination)"}</li>
                  <li>{language === "pt" ? "Classificação energética de C para A (com intervenção no isolamento e AVAC)" : "Energy rating upgrade from C to A (with insulation and HVAC intervention)"}</li>
                  <li>{language === "pt" ? "Poupança anual de energia estimada em 12.000€" : "Estimated annual energy savings of €12,000"}</li>
                </ul>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="not-prose mt-12 p-8 rounded-xl bg-accent/30 border border-border text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === "pt"
                      ? "Quer reabilitar o espaço da sua empresa?"
                      : "Want to renovate your company's space?"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {language === "pt"
                      ? "Oferecemos consultoria inicial gratuita para avaliar o potencial de reabilitação do seu espaço comercial."
                      : "We offer a free initial consultation to assess the renovation potential of your commercial space."}
                  </p>
                  <Button asChild size="lg">
                    <Link to="/contacto">
                      {language === "pt" ? "Agendar Consultoria" : "Schedule Consultation"}
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
