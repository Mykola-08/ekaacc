import { useEffect } from 'react';

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
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    
    // Open Graph Tags
    setMetaTag('og:type', type, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:locale', 'ca_ES', true);
    setMetaTag('og:site_name', 'EKA Balance', true);
    
    // Twitter Card Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    
    // Additional SEO
    setMetaTag('robots', 'index, follow');
    setMetaTag('author', 'EKA Balance');
    setMetaTag('geo.region', 'ES-CT');
    setMetaTag('geo.placename', 'Barcelona');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, keywords, image, url, type]);

  return null;
}
