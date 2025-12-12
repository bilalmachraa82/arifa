import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import arifaLogo from "@/assets/arifa-logo.png";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useLanguage } from "@/contexts/LanguageContext";

const social = [
  { name: "Instagram", href: "https://www.instagram.com/arifastudio", icon: Instagram },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/arifastudio", icon: Linkedin },
];

export function Footer() {
  const { t } = useLanguage();
  
  const navigation = {
    segments: [
      { name: t("segments.private.title"), href: "/privado" },
      { name: t("segments.companies.title"), href: "/empresas" },
      { name: t("segments.investors.title"), href: "/investidores" },
    ],
    company: [
      { name: t("footer.aboutUs"), href: "/#sobre" },
      { name: t("nav.portfolio"), href: "/portfolio" },
      { name: t("nav.blog"), href: "/blog" },
      { name: t("nav.contact"), href: "/contacto" },
    ],
    legal: [
      { name: t("footer.privacyPolicy"), href: "/privacidade" },
      { name: t("footer.terms"), href: "/termos" },
    ],
  };

  return (
    <footer className="bg-foreground text-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="container-arifa py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img className="h-12 w-auto brightness-0 invert" src={arifaLogo} alt="ARIFA Studio" />
            <p className="mt-6 text-sm text-background/70 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-8 flex gap-4">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-background/60 hover:text-background transition-colors"
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
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t("footer.segments")}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.segments.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t("footer.company")}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t("footer.legal")}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t("footer.contact")}</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-background/70">
                    Avenida de Berna, 31, 2º Dto, sala 9<br />
                    1050-038 Lisboa, Portugal
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                  <a href="tel:+351928272198" className="text-sm text-background/70 hover:text-background transition-colors">
                    +351 928 272 198
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                  <a href="mailto:info@arifa.studio" className="text-sm text-background/70 hover:text-background transition-colors">
                    info@arifa.studio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">{t("footer.newsletter")}</h3>
              <p className="mt-4 text-sm text-background/70 mb-4">
                {t("footer.newsletterDesc")}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10">
          <p className="text-xs text-background/50 text-center">
            &copy; {new Date().getFullYear()} ARIFA Studio. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
