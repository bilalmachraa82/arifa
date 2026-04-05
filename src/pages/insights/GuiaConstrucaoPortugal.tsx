import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function GuiaConstrucaoPortugal() {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEO
        title={language === "pt"
          ? "Guia Completo para Construir Casa em Portugal em 2026"
          : "Complete Guide to Building a House in Portugal in 2026"}
        description={language === "pt"
          ? "Tudo o que precisa saber para construir casa em Portugal: licenciamento, custos, prazos, escolha do arquitecto e fases do projecto. Guia actualizado para 2026."
          : "Everything you need to know about building a house in Portugal: licensing, costs, timelines, choosing an architect and project phases. Updated guide for 2026."}
        url="https://www.arifa.studio/insights/guia-construcao-portugal"
        type="article"
        publishedTime="2026-04-05"
        author="ARIFA Studio"
        articleSection="Particulares"
        keywords={language === "pt"
          ? "construir casa portugal, arquitecto portugal, licenciamento obra, custo construção portugal, projecto arquitectura, fases construção casa"
          : "build house portugal, architect portugal, construction license, building costs portugal, architecture project, house construction phases"}
        breadcrumbs={[
          { name: language === "pt" ? "Início" : "Home", url: "https://www.arifa.studio" },
          { name: "Insights", url: "https://www.arifa.studio/insights" },
          { name: language === "pt" ? "Guia Construção Portugal" : "Building Guide Portugal", url: "https://www.arifa.studio/insights/guia-construcao-portugal" },
        ]}
        faq={language === "pt" ? [
          { question: "Quanto custa construir uma casa em Portugal em 2026?", answer: "O custo médio de construção em Portugal varia entre 1.200€ e 2.500€ por m², dependendo da localização, acabamentos e complexidade do projecto. Uma moradia de 200m² pode custar entre 240.000€ e 500.000€, sem contar com o terreno." },
          { question: "Quanto tempo demora a construir uma casa em Portugal?", answer: "O prazo típico é de 18 a 24 meses desde o projecto até à entrega. O licenciamento camarário pode demorar 3 a 12 meses, dependendo do município. A construção em si demora geralmente 10 a 14 meses." },
          { question: "Preciso de um arquitecto para construir casa em Portugal?", answer: "Sim. Em Portugal, o projecto de arquitectura deve ser elaborado e assinado por um arquitecto inscrito na Ordem dos Arquitectos. É uma exigência legal para obter a licença de construção." },
          { question: "O que é o licenciamento de obra?", answer: "O licenciamento é o processo de aprovação camarária do projecto. Inclui a submissão do projecto de arquitectura, projectos de especialidades e o pagamento das taxas municipais. Só após a emissão do alvará de construção é que a obra pode começar." },
        ] : [
          { question: "How much does it cost to build a house in Portugal in 2026?", answer: "The average construction cost in Portugal ranges from €1,200 to €2,500 per m², depending on location, finishes and project complexity. A 200m² house can cost between €240,000 and €500,000, excluding land." },
          { question: "How long does it take to build a house in Portugal?", answer: "The typical timeline is 18 to 24 months from project to handover. Municipal licensing can take 3 to 12 months, depending on the municipality. Construction itself usually takes 10 to 14 months." },
          { question: "Do I need an architect to build a house in Portugal?", answer: "Yes. In Portugal, the architecture project must be prepared and signed by an architect registered with the Ordem dos Arquitectos. It is a legal requirement to obtain the construction license." },
          { question: "What is the construction licensing process?", answer: "Licensing is the municipal approval process for the project. It includes submitting the architecture project, specialty projects and paying municipal fees. Construction can only begin after the construction permit is issued." },
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
                  {language === "pt" ? "Particulares" : "Private Clients"}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {language === "pt" ? "12 min de leitura" : "12 min read"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  ARIFA Studio
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
                {language === "pt"
                  ? "Guia Completo para Construir Casa em Portugal em 2026"
                  : "Complete Guide to Building a House in Portugal in 2026"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {language === "pt"
                  ? "Da escolha do terreno à entrega das chaves: tudo o que precisa saber sobre o processo de construção, custos, prazos e como escolher o arquitecto certo."
                  : "From choosing the land to handing over the keys: everything you need to know about the construction process, costs, timelines and how to choose the right architect."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container-arifa">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">

              <AnimatedSection animation="fade-up">
                <h2>{language === "pt" ? "1. Escolher o Terreno Certo" : "1. Choosing the Right Land"}</h2>
                <p>
                  {language === "pt"
                    ? "O primeiro passo é encontrar um terreno adequado. Nem todos os terrenos permitem construção — é essencial verificar o PDM (Plano Director Municipal) da câmara local para confirmar que o terreno está classificado como solo urbano e quais as condições de edificabilidade (área máxima, cércea, afastamentos)."
                    : "The first step is finding suitable land. Not all land allows construction — it's essential to check the local council's PDM (Municipal Master Plan) to confirm the land is classified as urban and what the building conditions are (maximum area, height, setbacks)."}
                </p>
                <p>
                  {language === "pt"
                    ? "Recomendamos consultar um arquitecto antes de comprar o terreno. Um profissional experiente pode identificar condicionantes que afectam o projecto: orientação solar, topografia, servidões, infraestruturas disponíveis e regulamentos locais."
                    : "We recommend consulting an architect before purchasing land. An experienced professional can identify constraints that affect the project: solar orientation, topography, easements, available infrastructure and local regulations."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "2. O Papel do Arquitecto" : "2. The Role of the Architect"}</h2>
                <p>
                  {language === "pt"
                    ? "Em Portugal, a lei exige que o projecto de arquitectura seja elaborado por um arquitecto inscrito na Ordem dos Arquitectos (OA). O arquitecto é responsável por traduzir as suas necessidades num projecto funcional, estético e regulamentarmente correcto."
                    : "In Portugal, the law requires that the architecture project be prepared by an architect registered with the Ordem dos Arquitectos (OA). The architect is responsible for translating your needs into a functional, aesthetic and code-compliant design."}
                </p>
                <h3>{language === "pt" ? "O que um bom arquitecto oferece:" : "What a good architect offers:"}</h3>
                <ul>
                  <li>{language === "pt" ? "Estudo prévio com análise do terreno e programa funcional" : "Preliminary study with land analysis and functional program"}</li>
                  <li>{language === "pt" ? "Projecto de licenciamento para submissão à câmara" : "Licensing project for council submission"}</li>
                  <li>{language === "pt" ? "Projecto de execução detalhado para a construção" : "Detailed execution project for construction"}</li>
                  <li>{language === "pt" ? "Coordenação das especialidades (estrutura, águas, electricidade, AVAC)" : "Coordination of engineering specialties (structure, plumbing, electrical, HVAC)"}</li>
                  <li>{language === "pt" ? "Acompanhamento de obra para garantir que o projecto é executado correctamente" : "Construction supervision to ensure the project is built correctly"}</li>
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "3. Fases do Projecto de Arquitectura" : "3. Architecture Project Phases"}</h2>
                <p>
                  {language === "pt"
                    ? "O projecto de arquitectura segue fases bem definidas. Na ARIFA, utilizamos a metodologia RIBA (Royal Institute of British Architects) adaptada ao contexto português:"
                    : "The architecture project follows well-defined phases. At ARIFA, we use the RIBA (Royal Institute of British Architects) methodology adapted to the Portuguese context:"}
                </p>
                <ol>
                  <li><strong>{language === "pt" ? "Preparação e Briefing" : "Preparation and Briefing"}</strong> — {language === "pt" ? "Definição do programa, orçamento e cronograma. Análise do terreno e condicionantes." : "Definition of the program, budget and timeline. Site and constraints analysis."}</li>
                  <li><strong>{language === "pt" ? "Conceito" : "Concept"}</strong> — {language === "pt" ? "Desenvolvimento das primeiras ideias, maquetes 3D e estudo volumétrico." : "Development of initial ideas, 3D models and volumetric studies."}</li>
                  <li><strong>{language === "pt" ? "Projecto de Licenciamento" : "Licensing Project"}</strong> — {language === "pt" ? "Documentação para submissão à câmara municipal." : "Documentation for municipal council submission."}</li>
                  <li><strong>{language === "pt" ? "Projecto Técnico" : "Technical Project"}</strong> — {language === "pt" ? "Projectos de especialidades, caderno de encargos e orçamentação." : "Engineering projects, specifications and budgeting."}</li>
                  <li><strong>{language === "pt" ? "Construção" : "Construction"}</strong> — {language === "pt" ? "Acompanhamento de obra com visitas regulares e relatórios de progresso." : "Construction supervision with regular visits and progress reports."}</li>
                  <li><strong>{language === "pt" ? "Entrega" : "Handover"}</strong> — {language === "pt" ? "Inspecções finais, certificações e entrega das chaves." : "Final inspections, certifications and key handover."}</li>
                </ol>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "4. Custos de Construção em 2026" : "4. Construction Costs in 2026"}</h2>
                <p>
                  {language === "pt"
                    ? "Os custos de construção em Portugal variam significativamente conforme a região, tipo de construção e nível de acabamentos:"
                    : "Construction costs in Portugal vary significantly depending on the region, type of construction and level of finishes:"}
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>{language === "pt" ? "Tipo" : "Type"}</th>
                      <th>{language === "pt" ? "Custo/m²" : "Cost/m²"}</th>
                      <th>{language === "pt" ? "Casa 200m²" : "200m² House"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{language === "pt" ? "Económico" : "Economic"}</td>
                      <td>1.200€ – 1.500€</td>
                      <td>240.000€ – 300.000€</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Médio" : "Medium"}</td>
                      <td>1.500€ – 2.000€</td>
                      <td>300.000€ – 400.000€</td>
                    </tr>
                    <tr>
                      <td>{language === "pt" ? "Premium" : "Premium"}</td>
                      <td>2.000€ – 2.500€+</td>
                      <td>400.000€ – 500.000€+</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  {language === "pt"
                    ? "Estes valores incluem construção mas não incluem: terreno, projecto de arquitectura e especialidades (tipicamente 8-12% do custo de obra), taxas camarárias e ligações de infraestruturas."
                    : "These values include construction but exclude: land, architecture and engineering projects (typically 8-12% of construction cost), municipal fees and infrastructure connections."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "5. Licenciamento: Prazos e Processo" : "5. Licensing: Timelines and Process"}</h2>
                <p>
                  {language === "pt"
                    ? "O licenciamento é frequentemente a fase mais imprevisível. O processo típico inclui:"
                    : "Licensing is often the most unpredictable phase. The typical process includes:"}
                </p>
                <ol>
                  <li><strong>{language === "pt" ? "Pedido de informação prévia" : "Prior information request"}</strong> ({language === "pt" ? "opcional" : "optional"}) — 30 {language === "pt" ? "dias úteis" : "business days"}</li>
                  <li><strong>{language === "pt" ? "Submissão do projecto" : "Project submission"}</strong> — {language === "pt" ? "entrega de toda a documentação à câmara" : "delivery of all documentation to the council"}</li>
                  <li><strong>{language === "pt" ? "Apreciação e pareceres" : "Review and opinions"}</strong> — 45-90 {language === "pt" ? "dias úteis (pode ser mais em municípios com maior volume)" : "business days (can be longer in municipalities with higher volume)"}</li>
                  <li><strong>{language === "pt" ? "Emissão do alvará" : "Permit issuance"}</strong> — {language === "pt" ? "pagamento das taxas e início da obra" : "fee payment and start of construction"}</li>
                </ol>
                <p>
                  {language === "pt"
                    ? "Na ARIFA, acompanhamos todo o processo de licenciamento, gerindo a comunicação com a câmara e resolvendo eventuais condicionantes ou pedidos de esclarecimento."
                    : "At ARIFA, we manage the entire licensing process, handling communication with the council and resolving any conditions or requests for clarification."}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "6. Sustentabilidade e Eficiência Energética" : "6. Sustainability and Energy Efficiency"}</h2>
                <p>
                  {language === "pt"
                    ? "A regulamentação energética em Portugal (SCE - Sistema de Certificação Energética) exige que todas as novas construções tenham classificação energética. Investir em eficiência desde o projecto tem retorno a médio prazo:"
                    : "Energy regulations in Portugal (SCE - Energy Certification System) require all new constructions to have an energy rating. Investing in efficiency from the project stage pays off in the medium term:"}
                </p>
                <ul>
                  <li>{language === "pt" ? "Isolamento térmico adequado (paredes, cobertura, pavimento)" : "Adequate thermal insulation (walls, roof, floor)"}</li>
                  <li>{language === "pt" ? "Orientação solar optimizada para maximizar luz natural" : "Optimized solar orientation to maximize natural light"}</li>
                  <li>{language === "pt" ? "Painéis solares (obrigatórios em novos edifícios desde 2024)" : "Solar panels (mandatory in new buildings since 2024)"}</li>
                  <li>{language === "pt" ? "Sistemas de águas pluviais e reutilização" : "Rainwater harvesting and reuse systems"}</li>
                  <li>{language === "pt" ? "Materiais de baixo impacto ambiental" : "Low environmental impact materials"}</li>
                </ul>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h2>{language === "pt" ? "7. Como Escolher o Arquitecto Certo" : "7. How to Choose the Right Architect"}</h2>
                <ul>
                  <li>{language === "pt" ? "Verifique a inscrição na Ordem dos Arquitectos" : "Check registration with the Ordem dos Arquitectos"}</li>
                  <li>{language === "pt" ? "Analise o portfolio e experiência em projectos semelhantes" : "Review the portfolio and experience in similar projects"}</li>
                  <li>{language === "pt" ? "Peça referências de clientes anteriores" : "Ask for references from previous clients"}</li>
                  <li>{language === "pt" ? "Confirme que oferece acompanhamento de obra (não apenas projecto)" : "Confirm they offer construction supervision (not just design)"}</li>
                  <li>{language === "pt" ? "Avalie a comunicação: o arquitecto deve ouvir as suas necessidades" : "Evaluate communication: the architect should listen to your needs"}</li>
                  <li>{language === "pt" ? "Compare propostas, mas não escolha apenas pelo preço mais baixo" : "Compare proposals, but don't choose based solely on the lowest price"}</li>
                </ul>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="not-prose mt-12 p-8 rounded-xl bg-accent/30 border border-border text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === "pt"
                      ? "Está a pensar construir?"
                      : "Thinking about building?"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {language === "pt"
                      ? "Fale connosco para uma consulta inicial gratuita. Ajudamos a avaliar o seu terreno e a definir o melhor caminho para o seu projecto."
                      : "Talk to us for a free initial consultation. We help evaluate your land and define the best path for your project."}
                  </p>
                  <Button asChild size="lg">
                    <Link to="/contacto">
                      {language === "pt" ? "Marcar Consulta Gratuita" : "Book Free Consultation"}
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
