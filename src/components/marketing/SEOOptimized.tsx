import React, { useEffect } from 'react';

interface SEOOptimizedProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  children?: React.ReactNode;
}

export default function SEOOptimized({
  title = 'EKA Balance - Centre de Teràpies Holístiques a Barcelona',
  description = 'Descobreix el benestar integral a EKA Balance. Especialistes en massatge terapèutic, kinesiologia i osteobalance a Barcelona. Reserva la teva sessió avui.',
  keywords = 'massatge terapèutic Barcelona, kinesiologia Barcelona, osteobalance, teràpia holística, benestar integral, relaxació, alleujar tensions, Plaça Universitat',
  image = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=630&fit=crop',
  url = 'https://ekabalance.com',
  type = 'website',
  children,
}: SEOOptimizedProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: 'EKA Balance',
        url: url,
        logo: {
          '@type': 'ImageObject',
          url: 'https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+34-658-867-133',
          email: 'contact@ekabalance.com',
          contactType: 'customer service',
          availableLanguage: ['Catalan', 'Spanish', 'English', 'Russian'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer Pelai, 12',
          addressLocality: 'Barcelona',
          addressRegion: 'Catalunya',
          postalCode: '08001',
          addressCountry: 'ES',
        },
        sameAs: ['https://www.facebook.com/ekabalance', 'https://www.instagram.com/ekabalance'],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${url}/#localbusiness`,
        name: 'EKA Balance',
        description: description,
        url: url,
        telephone: '+34-933-123-456',
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer Pelai, 12',
          addressLocality: 'Barcelona',
          addressRegion: 'Catalunya',
          postalCode: '08001',
          addressCountry: 'ES',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.3851,
          longitude: 2.1734,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '20:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '16:00',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serveis de Teràpia',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Massatge Bàsic',
                description:
                  "Sessió de massatge terapèutic d'una hora per alleujar tensions quotidianes",
              },
              price: '60.00',
              priceCurrency: 'EUR',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Massatge Complet',
                description:
                  'Sessió completa que combina tècniques diverses per un tractament integral',
              },
              price: '75.00',
              priceCurrency: 'EUR',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Kinesiologia Barcelona',
                description: 'Sessió de kinesiologia aplicada per equilibrar el cos',
              },
              price: '75.00',
              priceCurrency: 'EUR',
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url: url,
        name: 'EKA Balance',
        description: description,
        publisher: {
          '@id': `${url}/#organization`,
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${url}/services?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
    ],
  };

  useEffect(() => {
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

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string, attrs: Record<string, string> = {}) => {
      let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        Object.entries(attrs).forEach(([key, value]) => {
          link!.setAttribute(key, value);
        });
        document.head.appendChild(link);
      }
    };

    // Update title
    document.title = title;

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'EKA Balance');
    setMetaTag('robots', 'index, follow');
    setMetaTag('language', 'Catalan');
    setMetaTag('revisit-after', '7 days');

    // Open Graph Meta Tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'EKA Balance', true);
    setMetaTag('og:locale', 'ca_ES', true);

    // Twitter Card Meta Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Additional Meta Tags
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Compute theme color from CSS variable
    const computedThemeColor =
      typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
        : '#FFB405'; // fallback
    setMetaTag('theme-color', computedThemeColor ? `hsl(${computedThemeColor})` : '#FFB405');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Preconnect links
    setLinkTag('preconnect', 'https://fonts.googleapis.com');
    setLinkTag('preconnect', 'https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
    setLinkTag('preconnect', 'https://images.unsplash.com');

    // DNS Prefetch
    setLinkTag('dns-prefetch', '//fonts.googleapis.com');
    setLinkTag('dns-prefetch', '//fonts.gstatic.com');
    setLinkTag('dns-prefetch', '//images.unsplash.com');

    // Structured Data JSON-LD
    let script = document.querySelector('script[data-seo-structured]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo-structured', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, image, url, type, structuredData]);

  return <>{children}</>;
}
