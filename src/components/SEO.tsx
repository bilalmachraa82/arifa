import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface CollectionItem {
  name: string;
  url: string;
  image?: string;
  description?: string;
}

interface AlternateLanguage {
  lang: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "project";
  publishedTime?: string;
  author?: string;
  keywords?: string;
  // For articles
  articleSection?: string;
  // For projects
  projectData?: {
    name: string;
    description: string;
    image?: string;
    location?: string;
    category?: string;
  };
  // For breadcrumbs
  breadcrumbs?: BreadcrumbItem[];
  // For FAQ pages
  faq?: FAQItem[];
  // For service pages
  serviceType?: string;
  // For collection pages (e.g., Portfolio)
  collectionItems?: CollectionItem[];
  collectionName?: string;
  // For international SEO
  alternateLanguages?: AlternateLanguage[];
  currentLang?: "pt" | "en";
}

const defaultSEO = {
  siteName: "ARIFA Studio",
  title: "ARIFA Studio | Arquitetura & Design",
  description: "Estúdio de arquitetura e design de interiores em Lisboa. Projetos residenciais, corporativos e de investimento com abordagem integrada e tecnologia BIM.",
  image: "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/og-image.jpg",
  url: "https://arifa.studio",
  keywords: "arquitetura, design de interiores, BIM, Lisboa, Portugal, projetos residenciais, projetos corporativos, investimento imobiliário"
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ARIFA Studio",
  "alternateName": "ARIFA",
  "url": "https://arifa.studio",
  "logo": "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/logo.png",
  "description": defaultSEO.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lisboa",
    "addressCountry": "PT"
  },
  "sameAs": [
    "https://www.instagram.com/arifa.studio",
    "https://www.linkedin.com/company/arifa-studio"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese", "English"]
  }
};

// WebSite Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ARIFA Studio",
  "url": "https://arifa.studio",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://arifa.studio/portfolio?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Generate Article Schema
const generateArticleSchema = (
  title: string,
  description: string,
  image: string,
  url: string,
  publishedTime?: string,
  author?: string,
  section?: string
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "url": url,
  "datePublished": publishedTime,
  "author": {
    "@type": "Person",
    "name": author || "ARIFA Studio"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ARIFA Studio",
    "logo": {
      "@type": "ImageObject",
      "url": "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/logo.png"
    }
  },
  "articleSection": section || "Arquitetura",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

// Generate Project Schema (CreativeWork)
const generateProjectSchema = (
  name: string,
  description: string,
  image?: string,
  location?: string,
  category?: string
) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": name,
  "description": description,
  "image": image,
  "creator": {
    "@type": "Organization",
    "name": "ARIFA Studio"
  },
  "genre": category || "Arquitetura",
  "locationCreated": location ? {
    "@type": "Place",
    "name": location
  } : undefined
});

// LocalBusiness Schema (ArchitectFirm)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ArchitectFirm",
  "name": "ARIFA Studio",
  "alternateName": "ARIFA",
  "url": "https://arifa.studio",
  "logo": "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/logo.png",
  "image": "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/og-image.jpg",
  "description": defaultSEO.description,
  "priceRange": "$$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Lisboa",
    "addressLocality": "Lisboa",
    "addressRegion": "Lisboa",
    "postalCode": "1000-000",
    "addressCountry": "PT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "38.7223",
    "longitude": "-9.1393"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Lisboa"
    },
    {
      "@type": "Country",
      "name": "Portugal"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de Arquitetura",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Projeto de Arquitetura",
          "description": "Design arquitetónico completo para projetos residenciais e comerciais"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Design de Interiores",
          "description": "Design de interiores personalizado e funcional"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Modelação BIM",
          "description": "Building Information Modeling para projetos de construção"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.instagram.com/arifa.studio",
    "https://www.linkedin.com/company/arifa-studio"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// Generate BreadcrumbList Schema
const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Generate FAQ Schema
const generateFAQSchema = (faq: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

// Generate Service Schema
const generateServiceSchema = (name: string, description: string, serviceType?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "provider": {
    "@type": "ArchitectFirm",
    "name": "ARIFA Studio",
    "url": "https://arifa.studio"
  },
  "serviceType": serviceType || "Architectural Services",
  "areaServed": {
    "@type": "Country",
    "name": "Portugal"
  }
});

// Generate CollectionPage Schema (for Portfolio, Blog listings, etc.)
const generateCollectionSchema = (
  name: string,
  description: string,
  url: string,
  items: CollectionItem[]
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": name,
  "description": description,
  "url": url,
  "provider": {
    "@type": "ArchitectFirm",
    "name": "ARIFA Studio"
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": item.url,
      ...(item.image && { "image": item.image }),
      ...(item.description && { "description": item.description })
    }))
  }
});

export function SEO({
  title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = "website",
  publishedTime,
  author,
  keywords = defaultSEO.keywords,
  articleSection,
  projectData,
  breadcrumbs,
  faq,
  serviceType,
  collectionItems,
  collectionName,
  alternateLanguages,
  currentLang = "pt"
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}` 
    : defaultSEO.title;

  // Build structured data array
  const structuredData: object[] = [organizationSchema, websiteSchema, localBusinessSchema];

  if (type === "article" && title) {
    structuredData.push(
      generateArticleSchema(title, description, image, url, publishedTime, author, articleSection)
    );
  }

  if (type === "project" && projectData) {
    structuredData.push(
      generateProjectSchema(
        projectData.name,
        projectData.description,
        projectData.image,
        projectData.location,
        projectData.category
      )
    );
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.push(generateBreadcrumbSchema(breadcrumbs));
  }

  if (faq && faq.length > 0) {
    structuredData.push(generateFAQSchema(faq));
  }

  if (serviceType && title) {
    structuredData.push(generateServiceSchema(title, description, serviceType));
  }

  if (collectionItems && collectionItems.length > 0) {
    structuredData.push(
      generateCollectionSchema(
        collectionName || title || "Collection",
        description,
        url,
        collectionItems
      )
    );
  }

  // Generate default alternate languages if not provided
  const defaultAlternates: AlternateLanguage[] = alternateLanguages || [
    { lang: "pt", url: url.replace(/\/(en|pt)\//, "/") },
    { lang: "en", url: url.replace(/\/(en|pt)\//, "/").replace("arifa.studio/", "arifa.studio/en/") }
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <html lang={currentLang} />

      {/* Hreflang Tags for International SEO */}
      {defaultAlternates.map((alt) => (
        <link 
          key={alt.lang}
          rel="alternate" 
          hrefLang={alt.lang === "pt" ? "pt-PT" : "en"} 
          href={alt.url} 
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url.replace(/\/(en|pt)\//, "/")} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "project" ? "website" : type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content={currentLang === "pt" ? "pt_PT" : "en_US"} />
      <meta property="og:locale:alternate" content={currentLang === "pt" ? "en_US" : "pt_PT"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content={author || defaultSEO.siteName} />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}