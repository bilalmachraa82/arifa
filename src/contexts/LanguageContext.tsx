import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.private": "Privado",
    "nav.companies": "Empresas",
    "nav.investors": "Investidores",
    "nav.portfolio": "Portfolio",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",
    "nav.quote": "Pedir Orçamento",
    "nav.login": "Entrar",
    "nav.openMenu": "Abrir menu",
    "nav.closeMenu": "Fechar menu",
    
    // Contact Page
    "contact.subtitle": "Contacto",
    "contact.title": "Vamos conversar sobre o seu projeto",
    "contact.description": "Tem um projeto em mente? Queremos conhecê-lo. A primeira consulta é gratuita e sem compromisso.",
    "contact.address": "Morada",
    "contact.phone": "Telefone / WhatsApp",
    "contact.email": "Email",
    "contact.hours": "Horário",
    "contact.weekdays": "Seg - Sex: 9h - 18h",
    "contact.saturday": "Sáb: Com marcação",
    "contact.whatToExpect": "O que esperar",
    "contact.response24h": "Resposta em até 24 horas",
    "contact.freeConsultation": "Consulta inicial gratuita",
    "contact.detailedProposal": "Proposta detalhada sem compromisso",
    "contact.fullName": "Nome completo",
    "contact.emailLabel": "Email",
    "contact.phoneLabel": "Telefone",
    "contact.clientType": "Tipo de cliente",
    "contact.selectOption": "Selecione...",
    "contact.privateClient": "Cliente Privado",
    "contact.company": "Empresa",
    "contact.investor": "Investidor",
    "contact.service": "Serviço pretendido",
    "contact.consulting": "Consultoria Estratégica e Viabilidade",
    "contact.design": "Design Arquitetónico e Técnico",
    "contact.bim": "Modelação e Coordenação BIM",
    "contact.simulations": "Análise Preditiva e Simulações",
    "contact.construction": "Gestão de Construção",
    "contact.sustainability": "Eficiência e Sustentabilidade",
    "contact.other": "Outro",
    "contact.message": "Mensagem",
    "contact.messagePlaceholder": "Descreva brevemente o seu projeto...",
    "contact.send": "Enviar mensagem",
    "contact.sending": "A enviar...",
    "contact.successTitle": "Mensagem enviada!",
    "contact.successMessage": "Entraremos em contacto consigo em breve.",
    "contact.errorTitle": "Erro ao enviar",
    "contact.errorMessage": "Por favor tente novamente mais tarde.",
    "contact.namePlaceholder": "O seu nome",
    "contact.emailPlaceholder": "email@exemplo.pt",
    "contact.phonePlaceholder": "+351 900 000 000",
    "contact.mapPlaceholder": "Mapa — Avenida de Berna, 31, 1050-038 Lisboa",
    
    // Auth Page
    "auth.login": "Entrar",
    "auth.signup": "Criar conta",
    "auth.loginTitle": "Bem-vindo de volta",
    "auth.signupTitle": "Crie a sua conta",
    "auth.loginDescription": "Entre na sua área de cliente",
    "auth.signupDescription": "Registe-se para acompanhar os seus projetos",
    "auth.email": "Email",
    "auth.password": "Palavra-passe",
    "auth.fullName": "Nome completo",
    "auth.confirmPassword": "Confirmar palavra-passe",
    "auth.loginButton": "Entrar",
    "auth.signupButton": "Criar conta",
    "auth.loggingIn": "A entrar...",
    "auth.signingUp": "A criar conta...",
    "auth.noAccount": "Ainda não tem conta?",
    "auth.hasAccount": "Já tem conta?",
    "auth.createAccount": "Criar conta",
    "auth.loginHere": "Entre aqui",
    "auth.successTitle": "Conta criada!",
    "auth.successMessage": "Verifique o seu email para confirmar a conta.",
    "auth.errorTitle": "Erro",
    "auth.passwordMismatch": "As palavras-passe não coincidem",
    "auth.backToHome": "Voltar ao início",
    
    // WhatsApp
    "whatsapp.tooltip": "Fale connosco no WhatsApp",
    "whatsapp.message": "Olá, gostaria de mais informações sobre os vossos serviços.",
    
    // Common
    "common.required": "obrigatório",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.private": "Private",
    "nav.companies": "Companies",
    "nav.investors": "Investors",
    "nav.portfolio": "Portfolio",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.quote": "Get Quote",
    "nav.login": "Login",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    
    // Contact Page
    "contact.subtitle": "Contact",
    "contact.title": "Let's talk about your project",
    "contact.description": "Have a project in mind? We want to know about it. The first consultation is free and without obligation.",
    "contact.address": "Address",
    "contact.phone": "Phone / WhatsApp",
    "contact.email": "Email",
    "contact.hours": "Hours",
    "contact.weekdays": "Mon - Fri: 9am - 6pm",
    "contact.saturday": "Sat: By appointment",
    "contact.whatToExpect": "What to expect",
    "contact.response24h": "Response within 24 hours",
    "contact.freeConsultation": "Free initial consultation",
    "contact.detailedProposal": "Detailed proposal without obligation",
    "contact.fullName": "Full name",
    "contact.emailLabel": "Email",
    "contact.phoneLabel": "Phone",
    "contact.clientType": "Client type",
    "contact.selectOption": "Select...",
    "contact.privateClient": "Private Client",
    "contact.company": "Company",
    "contact.investor": "Investor",
    "contact.service": "Desired service",
    "contact.consulting": "Strategic Consulting and Feasibility",
    "contact.design": "Architectural and Technical Design",
    "contact.bim": "BIM Modeling and Coordination",
    "contact.simulations": "Predictive Analysis and Simulations",
    "contact.construction": "Construction Management",
    "contact.sustainability": "Efficiency and Sustainability",
    "contact.other": "Other",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Briefly describe your project...",
    "contact.send": "Send message",
    "contact.sending": "Sending...",
    "contact.successTitle": "Message sent!",
    "contact.successMessage": "We will contact you soon.",
    "contact.errorTitle": "Error sending",
    "contact.errorMessage": "Please try again later.",
    "contact.namePlaceholder": "Your name",
    "contact.emailPlaceholder": "email@example.com",
    "contact.phonePlaceholder": "+351 900 000 000",
    "contact.mapPlaceholder": "Map — Avenida de Berna, 31, 1050-038 Lisbon",
    
    // Auth Page
    "auth.login": "Login",
    "auth.signup": "Sign up",
    "auth.loginTitle": "Welcome back",
    "auth.signupTitle": "Create your account",
    "auth.loginDescription": "Access your client area",
    "auth.signupDescription": "Register to track your projects",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full name",
    "auth.confirmPassword": "Confirm password",
    "auth.loginButton": "Login",
    "auth.signupButton": "Create account",
    "auth.loggingIn": "Logging in...",
    "auth.signingUp": "Creating account...",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.createAccount": "Create account",
    "auth.loginHere": "Login here",
    "auth.successTitle": "Account created!",
    "auth.successMessage": "Check your email to confirm your account.",
    "auth.errorTitle": "Error",
    "auth.passwordMismatch": "Passwords don't match",
    "auth.backToHome": "Back to home",
    
    // WhatsApp
    "whatsapp.tooltip": "Chat with us on WhatsApp",
    "whatsapp.message": "Hello, I would like more information about your services.",
    
    // Common
    "common.required": "required",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("arifa-language");
    return (saved as Language) || "pt";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("arifa-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
