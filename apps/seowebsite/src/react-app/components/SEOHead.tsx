import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * @deprecated Consider using SEOOptimized component instead which includes structured data (JSON-LD).
 */
export default function SEOHead({
  title = 'EKA Balance Barcelona - Massatge Terapèutic i Kinesiologia | Carrer Pelai 12',
  description = 'Espai de benestar EKA Balance a Barcelona (Carrer Pelai 12). Massatge terapèutic, kinesiologia i plans VIP per al teu equilibri integral. Reserva ara!',
  keywords = 'massatge Barcelona, kinesiologia Barcelona, teràpia benestar, Carrer Pelai, Plaça Universitat, plans VIP salut',
  image = 'https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png',
  url = 'https://ekabalance.com',
  type = 'website'
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ca_ES" />
      <meta property="og:site_name" content="EKA Balance" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="EKA Balance" />
      <meta name="geo.region" content="ES-CT" />
      <meta name="geo.placename" content="Barcelona" />
    </Helmet>
  );
}
