import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

export default function Privacidade() {
  return (
    <Layout>
      <SEO 
        title="Política de Privacidade"
        description="Política de privacidade da ARIFA Studio. Saiba como recolhemos, utilizamos e protegemos os seus dados pessoais."
        url="https://arifa.studio/privacidade"
      />
      
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Legal
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
              Política de Privacidade
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container-arifa">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-muted-foreground leading-relaxed">
              Última atualização: Dezembro 2024
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              1. Responsável pelo Tratamento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A ARIFA Studio, Lda., com sede na Avenida de Berna, 31, 2º Dto, sala 9, 1050-038 Lisboa, 
              Portugal, é a responsável pelo tratamento dos dados pessoais recolhidos através deste website.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              2. Dados Pessoais Recolhidos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Recolhemos os seguintes dados pessoais quando utiliza o nosso website:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc pl-6">
              <li>Nome completo</li>
              <li>Endereço de email</li>
              <li>Número de telefone (opcional)</li>
              <li>Mensagens enviadas através do formulário de contacto</li>
              <li>Preferências de segmento e serviço de interesse</li>
            </ul>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              3. Finalidade do Tratamento
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Os dados pessoais são tratados para as seguintes finalidades:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc pl-6">
              <li>Responder a pedidos de contacto e orçamento</li>
              <li>Enviar comunicações de marketing (apenas com consentimento)</li>
              <li>Gerir a área de cliente</li>
              <li>Cumprir obrigações legais e contratuais</li>
            </ul>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              4. Base Legal
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              O tratamento dos dados pessoais baseia-se no consentimento do utilizador, 
              na execução de contratos e no cumprimento de obrigações legais.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              5. Período de Conservação
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Os dados pessoais são conservados durante o período necessário para as 
              finalidades para as quais foram recolhidos, ou conforme exigido por lei.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              6. Direitos do Titular
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tem direito a aceder, retificar, apagar e solicitar a portabilidade dos seus dados, 
              bem como a opor-se ao seu tratamento. Para exercer estes direitos, contacte-nos 
              através de info@arifa.studio.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              7. Segurança
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizativas adequadas para proteger os seus 
              dados pessoais contra acesso não autorizado, perda ou destruição.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              8. Contacto
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões relacionadas com a proteção de dados, contacte-nos:<br />
              Email: info@arifa.studio<br />
              Telefone: +351 928 272 198
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
