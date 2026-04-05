import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function InvestimentoImobiliarioLisboa() {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEO
        title={language === "pt"
          ? "Investir em Imobiliário em Lisboa: Guia para Investidores 2026"
          : "Real Estate Investment in Lisbon: Investor Guide 2026"}
        description={language === "pt"
          ? "Guia completo para investidores imobiliários em Lisboa e Portugal. Zonas com maior potencial, retorno esperado, enquadramento fiscal e o papel da arquitectura na valorização."
          : "Complete guide for real estate investors in Lisbon and Portugal. Areas with highest potential, expected returns, tax framework and the role of architecture in value creation."}
        url="https://www.arifa.studio/insights/investimento-imobiliario-lisboa"
        type="article"
        publishedTime="2026-04-05"
        author="ARIFA Studio"
        articleSection="Investidores"
        keywords={language === "pt"
          ? "investimento imobiliário lisboa, investir portugal, retorno investimento imobiliário, reabilitação urbana lisboa, golden visa portugal, arquitecto investimento"
          : "lisbon real estate investment, invest portugal, real estate ROI, urban rehabilitation lisbon, golden visa portugal, architecture investment"}
        breadcrumbs={[
          { name: language === "pt" ? "Início" : "Home", url: "https://www.arifa.studio" },
          { name: "Insights", url: "https://www.arifa.studio/insights" },
          { name: language === "pt" ? "Investimento Imobiliário Lisboa" : "Lisbon Real Estate Investment", url: "https://www.arifa.studio/insights/investimento-imobiliario-lisboa" },
        ]}
        faq={language === "pt" ? [
          { question: "Qual é o retorno médio de investimento imobiliário em Lisboa?", answer: "O retorno bruto em Lisboa varia entre 4% e 7% ao ano para arrendamento de longa duração. Em reabilitação para venda, os retornos podem atingir 15-30% sobre o investimento total, dependendo da localização e da qualidade do projecto de arquitectura." },
          { question: "Quais as zonas de Lisboa com maior potencial de valorização em 2026?", answer: "As zonas com maior potencial incluem Marvila, Beato, Penha de França e Arroios (reabilitação urbana em expansão), além de Alcântara e a frente ribeirinha oriental. O eixo Intendente-Mouraria continua em forte valorização." },
          { question: "Que benefícios fiscais existem para investimento em reabilitação?", answer: "Os principais benefícios incluem: IVA reduzido de 6% em obras de reabilitação em ARU (Áreas de Reabilitação Urbana), isenção de IMI até 5 anos, isenção de IMT na primeira transmissão após reabilitação, e taxa reduzida de IRS/IRC sobre rendas (5% em ARU)." },
        ] : [
          { question: "What is the average real estate investment return in Lisbon?", answer: "Gross returns in Lisbon range from 4% to 7% per year for long-term rentals. In renovation for sale, returns can reach 15-30% on total investment, depending on location and the quality of the architecture project." },
          { question: "Which areas of Lisbon have the highest appreciation potential in 2026?", answer: "Areas with highest potential include Marvila, Beato, Penha de França and Arroios (expanding urban rehabilitation), as well as Alcântara and the eastern riverfront. The Intendente-Mouraria axis continues strong appreciation." },
          { question: "What tax benefits exist for rehabilitation investment?", answer: "Main benefits include: reduced 6% VAT on rehabilitation works in ARU (Urban Rehabilitation Areas), IMI exemption up to 5 years, IMT exemption on first transfer after rehabilitation, and reduced IRS/IRC rate on rents (5% in ARU)." },
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
                  {language === "pt" ? "Investidores" : "Investors"}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {language === "pt" ? "15 min de leitura" : "15 min read"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  ARIFA Studio
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
                {language === "pt"
                  ? "Investir em Imobiliário em Lisboa: Guia para Investidores 2026"
                  : "Real Estate Investment in Lisbon: Investor Guide 2026"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {language === "pt"
                  ? "Zonas com maior potencial, retorno esperado, benefícios fiscais e como a arquitectura de qualidade maximiza o valor do seu investimento imobiliário."
                  : "Areas with highest potential, expected returns, tax benefits and how quality architecture maximizes the value of your real estate investment."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container-arifa">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">

              <AnimatedSection animation="fade-up">
                <h2>{language === "pt" ? "1. O Mercado Imobiliário Português em 2026" : "1. The Portuguese Real Estate Market in 2026"}</h2>
                <p>
                  {language === "pt"
                    ? "Portugal continua a ser um dos mercados imobiliários mais atractivos da Europa, combinando qualidade de vida, segurança, regime fiscal competitivo e procura crescente. Lisboa, em particular, mantém uma dinâmica de valorização sustentada pela limitação de oferta no centro histórico e pela procura internacional."
                    : "Portugal continues to be one of the most attractive real estate markets in Europe, combining quality of life, safety, competitive tax regime and growing demand. Lisbon, in particular, maintains a sustained appreciation dynamic driven by limited supply in the historic center and international demand."}
                </p>
                <p>
                  {language === "pt"
                    ? "Para o investidor, o contexto actual oferece oportunidades em duas frentes: reabilitação de edifícios existentes (com incentivos fiscais atractivos) e construção nova em zonas emergentes com forte potencial de valorização."
                    : "For investors, the current context offers opportunities on two fronts: rehabilitation of existing buildings (with attractive tax incentives) and new construction in emerging areas with strong appreciation potential."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "2. Zonas de Lisboa com Maior Potencial" : "2. Lisbon Areas with Highest Potential"}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>{language === "pt" ? "Zona" : "Area"}</th>
                      <th>{language === "pt" ? "Perfil" : "Profile"}</th>
                      <th>{language === "pt" ? "Preço médio/m²" : "Avg price/m²"}</th>
                      <th>{language === "pt" ? "Potencial" : "Potential"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Marvila / Beato</td>
                      <td>{language === "pt" ? "Reabilitação urbana emergente" : "Emerging urban rehab"}</td>
                      <td>3.500€ – 5.000€</td>
                      <td>{language === "pt" ? "Alto" : "High"}</td>
                    </tr>
                    <tr>
                      <td>Penha de França / Arroios</td>
                      <td>{language === "pt" ? "Residencial em valorização" : "Appreciating residential"}</td>
                      <td>4.000€ – 5.500€</td>
                      <td>{language === "pt" ? "Alto" : "High"}</td>
                    </tr>
                    <tr>
                      <td>Alcântara</td>
                      <td>{language === "pt" ? "Misto (residencial + comercial)" : "Mixed (residential + commercial)"}</td>
                      <td>4.500€ – 6.500€</td>
                      <td>{language === "pt" ? "Médio-alto" : "Medium-high"}</td>
                    </tr>
                    <tr>
                      <td>Intendente / Mouraria</td>
                      <td>{language === "pt" ? "Reabilitação consolidada" : "Consolidated rehab"}</td>
                      <td>4.500€ – 6.000€</td>
                      <td>{language === "pt" ? "Médio" : "Medium"}</td>
                    </tr>
                    <tr>
                      <td>Estrela / Campo de Ourique</td>
                      <td>{language === "pt" ? "Premium estabelecido" : "Established premium"}</td>
                      <td>5.500€ – 8.000€</td>
                      <td>{language === "pt" ? "Estável" : "Stable"}</td>
                    </tr>
                  </tbody>
                </table>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "3. Benefícios Fiscais para Investidores" : "3. Tax Benefits for Investors"}</h2>
                <h3>{language === "pt" ? "Reabilitação em ARU (Áreas de Reabilitação Urbana)" : "Rehabilitation in ARU (Urban Rehabilitation Areas)"}</h3>
                <ul>
                  <li><strong>{language === "pt" ? "IVA reduzido" : "Reduced VAT"}</strong>: 6% ({language === "pt" ? "em vez de 23%) em obras de reabilitação" : "instead of 23%) on rehabilitation works"}</li>
                  <li><strong>{language === "pt" ? "Isenção de IMI" : "IMI exemption"}</strong>: {language === "pt" ? "até 5 anos após conclusão da reabilitação" : "up to 5 years after rehabilitation completion"}</li>
                  <li><strong>{language === "pt" ? "Isenção de IMT" : "IMT exemption"}</strong>: {language === "pt" ? "na primeira transmissão após reabilitação" : "on first transfer after rehabilitation"}</li>
                  <li><strong>{language === "pt" ? "Taxa reduzida de IRS" : "Reduced IRS rate"}</strong>: 5% {language === "pt" ? "sobre rendas (vs 28% regime geral)" : "on rental income (vs 28% general regime)"}</li>
                  <li><strong>{language === "pt" ? "Dedução de custos" : "Cost deduction"}</strong>: {language === "pt" ? "custos de reabilitação dedutíveis até 30% do valor tributável" : "rehabilitation costs deductible up to 30% of taxable value"}</li>
                </ul>
                <h3>{language === "pt" ? "Residente Não Habitual (RNH)" : "Non-Habitual Resident (NHR)"}</h3>
                <p>
                  {language === "pt"
                    ? "O regime NHR (em evolução desde 2024) pode oferecer vantagens adicionais para investidores estrangeiros. Consulte sempre um fiscalista actualizado para avaliar a aplicabilidade ao seu caso específico."
                    : "The NHR regime (evolving since 2024) may offer additional advantages for foreign investors. Always consult an updated tax specialist to assess applicability to your specific case."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "4. O Papel da Arquitectura no Retorno do Investimento" : "4. The Role of Architecture in Investment Returns"}</h2>
                <p>
                  {language === "pt"
                    ? "A qualidade do projecto de arquitectura é um dos factores que mais impacta o retorno de um investimento imobiliário. Estudos europeus mostram que:"
                    : "The quality of the architecture project is one of the factors that most impacts real estate investment returns. European studies show that:"}
                </p>
                <ul>
                  <li>{language === "pt" ? "Projectos com arquitectura de qualidade vendem 10-20% acima da média do mercado" : "Projects with quality architecture sell 10-20% above market average"}</li>
                  <li>{language === "pt" ? "O tempo de venda/arrendamento é 30-40% menor" : "Sale/rental time is 30-40% shorter"}</li>
                  <li>{language === "pt" ? "A taxa de vacância é significativamente inferior" : "Vacancy rate is significantly lower"}</li>
                  <li>{language === "pt" ? "O custo de manutenção a longo prazo é menor com projectos bem concebidos" : "Long-term maintenance cost is lower with well-designed projects"}</li>
                </ul>
                <h3>{language === "pt" ? "Onde a arquitectura acrescenta valor:" : "Where architecture adds value:"}</h3>
                <ul>
                  <li><strong>{language === "pt" ? "Optimização de áreas" : "Area optimization"}</strong> — {language === "pt" ? "maximizar metros úteis sem comprometer a habitabilidade" : "maximize usable area without compromising livability"}</li>
                  <li><strong>{language === "pt" ? "Eficiência energética" : "Energy efficiency"}</strong> — {language === "pt" ? "melhor certificação = maior valor de mercado" : "better certification = higher market value"}</li>
                  <li><strong>{language === "pt" ? "Identidade visual" : "Visual identity"}</strong> — {language === "pt" ? "diferenciação num mercado cada vez mais competitivo" : "differentiation in an increasingly competitive market"}</li>
                  <li><strong>{language === "pt" ? "Flexibilidade funcional" : "Functional flexibility"}</strong> — {language === "pt" ? "espaços adaptáveis a diferentes usos futuros" : "spaces adaptable to different future uses"}</li>
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "5. Due Diligence: O Que Verificar" : "5. Due Diligence: What to Check"}</h2>
                <p>
                  {language === "pt"
                    ? "Antes de investir num imóvel para reabilitação, verifique:"
                    : "Before investing in a property for rehabilitation, check:"}
                </p>
                <ol>
                  <li><strong>{language === "pt" ? "Documentação" : "Documentation"}</strong> — {language === "pt" ? "caderneta predial, certidão de registo, licença de utilização" : "property record, registration certificate, usage license"}</li>
                  <li><strong>{language === "pt" ? "Condicionantes urbanísticas" : "Urban constraints"}</strong> — {language === "pt" ? "PDM, plano de pormenor, património classificado" : "master plan, detailed plan, classified heritage"}</li>
                  <li><strong>{language === "pt" ? "Estado estrutural" : "Structural condition"}</strong> — {language === "pt" ? "avaliação por engenheiro de estruturas (obrigatório antes de compra)" : "assessment by structural engineer (mandatory before purchase)"}</li>
                  <li><strong>{language === "pt" ? "Classificação ARU" : "ARU classification"}</strong> — {language === "pt" ? "verificar se o imóvel está em Área de Reabilitação Urbana" : "check if the property is in an Urban Rehabilitation Area"}</li>
                  <li><strong>{language === "pt" ? "Custos de reabilitação" : "Rehabilitation costs"}</strong> — {language === "pt" ? "estimativa preliminar por arquitecto com experiência em reabilitação" : "preliminary estimate by an architect experienced in rehabilitation"}</li>
                  <li><strong>{language === "pt" ? "Potencial de mercado" : "Market potential"}</strong> — {language === "pt" ? "estudo de procura e preços na zona para o tipo de produto final" : "demand and price study in the area for the final product type"}</li>
                </ol>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "6. Tipos de Investimento" : "6. Types of Investment"}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>{language === "pt" ? "Estratégia" : "Strategy"}</th>
                      <th>{language === "pt" ? "Retorno típico" : "Typical return"}</th>
                      <th>{language === "pt" ? "Prazo" : "Timeline"}</th>
                      <th>{language === "pt" ? "Risco" : "Risk"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{language === "pt" ? "Reabilitar e vender" : "Rehab and sell"}</td>
                      <td>15-30%</td>
                      <td>18-30 {language === "pt" ? "meses" : "months"}</td>
                      <td>{language === "pt" ? "Médio" : "Medium"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Reabilitar e arrendar (longa duração)" : "Rehab and rent (long-term)"}</td>
                      <td>4-7% {language === "pt" ? "anual" : "annual"}</td>
                      <td>{language === "pt" ? "Contínuo" : "Ongoing"}</td>
                      <td>{language === "pt" ? "Baixo" : "Low"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Construção nova" : "New construction"}</td>
                      <td>20-40%</td>
                      <td>24-36 {language === "pt" ? "meses" : "months"}</td>
                      <td>{language === "pt" ? "Alto" : "High"}</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Conversão de uso (comercial → residencial)" : "Use conversion (commercial → residential)"}</td>
                      <td>20-35%</td>
                      <td>18-24 {language === "pt" ? "meses" : "months"}</td>
                      <td>{language === "pt" ? "Médio-alto" : "Medium-high"}</td>
                    </tr>
                  </tbody>
                </table>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="not-prose mt-12 p-8 rounded-xl bg-accent/30 border border-border text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === "pt"
                      ? "Tem um projecto de investimento?"
                      : "Have an investment project?"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {language === "pt"
                      ? "Ajudamos investidores a maximizar o retorno através de arquitectura de qualidade. Consulta inicial gratuita e análise de viabilidade."
                      : "We help investors maximize returns through quality architecture. Free initial consultation and feasibility analysis."}
                  </p>
                  <Button asChild size="lg">
                    <Link to="/contacto">
                      {language === "pt" ? "Consulta para Investidores" : "Investor Consultation"}
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
