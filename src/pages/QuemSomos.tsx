import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Globe, Leaf, Cpu, Users, Target } from "lucide-react";

export default function QuemSomos() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: Leaf,
      title: language === "pt" ? "Sustentabilidade" : "Sustainability",
      description: language === "pt"
        ? "Práticas de design sustentável e eficiência energética em cada projeto."
        : "Sustainable design practices and energy efficiency in every project.",
    },
    {
      icon: Cpu,
      title: language === "pt" ? "Inovação Digital" : "Digital Innovation",
      description: language === "pt"
        ? "Metodologia BIM, modelação 3D e integração tecnológica avançada."
        : "BIM methodology, 3D modeling and advanced technology integration.",
    },
    {
      icon: Globe,
      title: language === "pt" ? "Visão Global" : "Global Vision",
      description: language === "pt"
        ? "Experiência internacional em Portugal, Noruega, Suécia e Angola."
        : "International experience in Portugal, Norway, Sweden and Angola.",
    },
    {
      icon: Users,
      title: language === "pt" ? "Colaboração" : "Collaboration",
      description: language === "pt"
        ? "Trabalhamos lado a lado com clientes, engenheiros e construtores."
        : "We work side by side with clients, engineers and builders.",
    },
    {
      icon: Award,
      title: language === "pt" ? "Excelência" : "Excellence",
      description: language === "pt"
        ? "Atenção obsessiva ao detalhe em cada fase do projeto."
        : "Obsessive attention to detail at every stage of the project.",
    },
    {
      icon: Target,
      title: language === "pt" ? "Ética" : "Ethics",
      description: language === "pt"
        ? "Transparência total, prazos cumpridos e comunicação constante."
        : "Full transparency, met deadlines and constant communication.",
    },
  ];

  const team = [
    {
      name: "Teresa Ribeiro",
      role: language === "pt" ? "Fundadora & Arquiteta Principal" : "Founder & Lead Architect",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: language === "pt"
        ? "20+ anos de experiência internacional. Especialista em BIM e design sustentável."
        : "20+ years of international experience. Specialist in BIM and sustainable design.",
    },
  ];

  const milestones = [
    { year: "2002", text: language === "pt" ? "Início da carreira em arquitetura" : "Start of architecture career" },
    { year: "2008", text: language === "pt" ? "Projetos internacionais (Noruega, Suécia)" : "International projects (Norway, Sweden)" },
    { year: "2015", text: language === "pt" ? "Especialização em BIM e sustentabilidade" : "Specialization in BIM and sustainability" },
    { year: "2022", text: language === "pt" ? "Fundação da ARIFA Studio" : "ARIFA Studio founded" },
    { year: "2024", text: language === "pt" ? "Transformação digital e plataforma cliente" : "Digital transformation and client platform" },
  ];

  return (
    <Layout>
      <SEO
        title={language === "pt" ? "Quem Somos" : "About Us"}
        description={language === "pt"
          ? "Conheça a ARIFA Studio: 20+ anos de experiência internacional em arquitetura, BIM e design sustentável. Fundada em 2022 em Lisboa."
          : "Meet ARIFA Studio: 20+ years of international experience in architecture, BIM and sustainable design. Founded in 2022 in Lisbon."
        }
        url="https://www.arifa.studio/quem-somos"
        breadcrumbs={[
          { name: language === "pt" ? "Início" : "Home", url: "https://www.arifa.studio" },
          { name: language === "pt" ? "Quem Somos" : "About Us", url: "https://www.arifa.studio/quem-somos" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-accent/30">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-[0.3em] text-accent-foreground/70 uppercase mb-4">
                {language === "pt" ? "Quem Somos" : "About Us"}
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
                {language === "pt" ? "Arquitetura com alma portuguesa," : "Architecture with Portuguese soul,"}
                <span className="block font-normal text-muted-foreground">
                  {language === "pt" ? "visão global" : "global vision"}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {language === "pt"
                  ? "Combinamos mais de 20 anos de experiência internacional com inovação digital e sustentabilidade para criar espaços que inspiram e perduram."
                  : "We combine over 20 years of international experience with digital innovation and sustainability to create spaces that inspire and endure."}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="fade-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Interior design ARIFA"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-square bg-accent rounded-sm flex items-center justify-center p-6">
                    <p className="text-2xl text-accent-foreground text-center font-light italic">
                      "{language === "pt" ? "Design é inteligência tornada visível" : "Design is intelligence made visible"}"
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square bg-secondary rounded-sm overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Modern architecture"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Residential project"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-right" delay={200}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {language === "pt" ? "A Nossa História" : "Our Story"}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {language === "pt"
                      ? "A ARIFA Studio nasce em 2022 da visão de Teresa Ribeiro — arquiteta com mais de duas décadas de experiência internacional. Após projetos de referência na Noruega, Suécia e Angola, decidiu fundar um estúdio que combinasse o melhor da tradição arquitetónica portuguesa com as mais avançadas ferramentas digitais."
                      : "ARIFA Studio was born in 2022 from the vision of Teresa Ribeiro — an architect with over two decades of international experience. After landmark projects in Norway, Sweden and Angola, she decided to found a studio combining the best of Portuguese architectural tradition with the most advanced digital tools."}
                  </p>
                  <p>
                    {language === "pt"
                      ? "Especializamo-nos em metodologia BIM, design sustentável e eficiência energética. Acreditamos que a digitalização inteligente do setor da construção é o caminho para criar edifícios mais eficientes, sustentáveis e centrados nas pessoas."
                      : "We specialize in BIM methodology, sustainable design and energy efficiency. We believe that the intelligent digitalization of the construction sector is the path to creating more efficient, sustainable and people-centered buildings."}
                  </p>
                  <p>
                    {language === "pt"
                      ? "Hoje, a ARIFA Studio atua em quatro mercados — Portugal, Noruega, Suécia e Angola — com uma equipa multidisciplinar e uma abordagem integrada que abrange desde o conceito inicial até à entrega final."
                      : "Today, ARIFA Studio operates in four markets — Portugal, Norway, Sweden and Angola — with a multidisciplinary team and an integrated approach spanning from initial concept to final delivery."}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-card">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">
              {language === "pt" ? "O Nosso Percurso" : "Our Journey"}
            </h2>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <AnimatedSection key={m.year} animation="fade-up" delay={i * 100}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shrink-0">
                      {m.year}
                    </div>
                    {i < milestones.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pt-3 pb-8">
                    <p className="text-foreground font-medium">{m.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 lg:py-32">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.3em] text-accent-foreground/70 uppercase mb-4">
                {language === "pt" ? "A Equipa" : "The Team"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {language === "pt" ? "As pessoas por trás dos projetos" : "The people behind the projects"}
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-md mx-auto">
            {team.map((member) => (
              <AnimatedSection key={member.name} animation="fade-up" delay={100}>
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 bg-secondary">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-accent-foreground font-medium text-sm mt-1">{member.role}</p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{member.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-sm font-medium tracking-[0.3em] text-accent-foreground/70 uppercase mb-4">
                {language === "pt" ? "Os Nossos Valores" : "Our Values"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {language === "pt" ? "O que nos define" : "What defines us"}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} animation="fade-up" delay={i * 100}>
                <div className="p-6 rounded-lg border border-border bg-background hover:shadow-lg transition-shadow">
                  <value.icon className="h-8 w-8 text-accent-foreground mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-accent/30">
        <div className="container-arifa text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {language === "pt" ? "Pronto para começar?" : "Ready to start?"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              {language === "pt"
                ? "Vamos transformar a sua visão em realidade. Marque uma reunião sem compromisso."
                : "Let's turn your vision into reality. Schedule a free consultation."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contacto">{t("cta.requestQuote")}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/portfolio">{t("about.explorePortfolio")}</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
