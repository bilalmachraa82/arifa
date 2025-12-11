import { Helmet } from "react-helmet-async";

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
  projectData
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}` 
    : defaultSEO.title;

  // Build structured data array
  const structuredData: object[] = [organizationSchema, websiteSchema];

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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "project" ? "website" : type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="pt_PT" />

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