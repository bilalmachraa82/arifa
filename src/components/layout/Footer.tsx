import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import arifaLogo from "@/assets/arifa-logo.png";

const navigation = {
  segments: [
    { name: "Clientes Privados", href: "/privado" },
    { name: "Empresas", href: "/empresas" },
    { name: "Investidores", href: "/investidores" },
  ],
  company: [
    { name: "Sobre Nós", href: "/#sobre" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Política de Privacidade", href: "/privacidade" },
    { name: "Termos e Condições", href: "/termos" },
  ],
};

const social = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Facebook", href: "#", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="bg-arifa-charcoal text-primary-foreground" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="container-arifa py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img className="h-12 w-auto brightness-0 invert" src={arifaLogo} alt="ARIFA Studio" />
            <p className="mt-6 text-sm text-primary-foreground/70 leading-relaxed">
              Arquitetura e design de interiores com visão contemporânea e respeito pela tradição portuguesa.
            </p>
            <div className="mt-8 flex gap-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Segmentos</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.segments.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Empresa</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contacto</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/70">
                  Rua da Arquitetura, 123<br />
                  1100-001 Lisboa, Portugal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-arifa-teal flex-shrink-0" />
                <a href="tel:+351210000000" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  +351 210 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-arifa-teal flex-shrink-0" />
                <a href="mailto:geral@arifastudio.pt" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  geral@arifastudio.pt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/50 text-center">
            &copy; {new Date().getFullYear()} ARIFA Studio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
