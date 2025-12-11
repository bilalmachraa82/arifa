import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  keywords?: string;
}

const defaultSEO = {
  siteName: "ARIFA Studio",
  title: "ARIFA Studio | Arquitetura & Design",
  description: "Estúdio de arquitetura e design de interiores em Lisboa. Projetos residenciais, corporativos e de investimento com abordagem integrada e tecnologia BIM.",
  image: "https://kiqxagkbyhdnyjngjstc.supabase.co/storage/v1/object/public/project-images/og-image.jpg",
  url: "https://arifa.studio",
  keywords: "arquitetura, design de interiores, BIM, Lisboa, Portugal, projetos residenciais, projetos corporativos, investimento imobiliário"
};

export function SEO({
  title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = "website",
  publishedTime,
  author,
  keywords = defaultSEO.keywords
}: SEOProps) {
  const fullTitle = title 
    ? `${title} | ${defaultSEO.siteName}` 
    : defaultSEO.title;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
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
    </Helmet>
  );
}