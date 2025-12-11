import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

export default function Termos() {
  return (
    <Layout>
      <SEO 
        title="Termos e Condições"
        description="Termos e condições de utilização do website da ARIFA Studio."
        url="https://arifa.studio/termos"
      />
      
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Legal
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
              Termos e Condições
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
              1. Identificação
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Este website é propriedade e operado pela ARIFA Studio, Lda., com sede na 
              Avenida de Berna, 31, 2º Dto, sala 9, 1050-038 Lisboa, Portugal.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              2. Aceitação dos Termos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao aceder e utilizar este website, aceita estar vinculado a estes Termos e Condições. 
              Se não concordar com alguma parte destes termos, não deve utilizar o website.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              3. Utilização do Website
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              O utilizador compromete-se a utilizar o website de forma lícita e de acordo 
              com estes Termos e Condições, não podendo:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc pl-6">
              <li>Utilizar o website de forma que cause danos ou prejudique terceiros</li>
              <li>Tentar aceder a áreas restritas sem autorização</li>
              <li>Reproduzir, duplicar ou revender qualquer parte do website</li>
              <li>Utilizar o website para fins ilegais ou não autorizados</li>
            </ul>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              4. Propriedade Intelectual
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo deste website, incluindo textos, imagens, gráficos, logótipos, 
              ícones e software, é propriedade da ARIFA Studio ou dos seus licenciadores e 
              está protegido por direitos de autor e outras leis de propriedade intelectual.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              5. Área de Cliente
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              O acesso à área de cliente requer autenticação. O utilizador é responsável 
              por manter a confidencialidade das suas credenciais de acesso e por todas 
              as atividades realizadas com a sua conta.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              6. Serviços
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              As informações sobre serviços apresentadas neste website são meramente 
              informativas. Os termos específicos de cada projeto são definidos em 
              contratos individuais celebrados com os clientes.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A ARIFA Studio não será responsável por quaisquer danos diretos, indiretos, 
              incidentais ou consequenciais resultantes da utilização ou incapacidade de 
              utilização deste website.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              8. Links Externos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Este website pode conter links para websites de terceiros. A ARIFA Studio 
              não é responsável pelo conteúdo ou práticas de privacidade desses websites.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              9. Alterações aos Termos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A ARIFA Studio reserva-se o direito de modificar estes Termos e Condições 
              a qualquer momento. As alterações entram em vigor imediatamente após 
              publicação no website.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              10. Lei Aplicável
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Estes Termos e Condições são regidos pela lei portuguesa. Qualquer litígio 
              será submetido aos tribunais competentes de Lisboa.
            </p>

            <h2 className="font-display text-2xl font-medium text-foreground mt-8 mb-4">
              11. Contacto
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões relacionadas com estes Termos e Condições, contacte-nos:<br />
              Email: info@arifa.studio<br />
              Telefone: +351 928 272 198
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
