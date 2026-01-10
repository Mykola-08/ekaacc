import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  children
}: SEOOptimizedProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        "name": "EKA Balance",
        "url": url,
        "logo": {
          "@type": "ImageObject",
          "url": "https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/eka_logo.png"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+34-658-867-133",
          "email": "contact@ekabalance.com",
          "contactType": "customer service",
          "availableLanguage": ["Catalan", "Spanish", "English", "Russian"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrer Pelai, 12",
          "addressLocality": "Barcelona",
          "addressRegion": "Catalunya",
          "postalCode": "08001",
          "addressCountry": "ES"
        },
        "sameAs": [
          "https://www.facebook.com/ekabalance",
          "https://www.instagram.com/ekabalance"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": `${url}/#localbusiness`,
        "name": "EKA Balance",
        "description": description,
        "url": url,
        "telephone": "+34-933-123-456",
        "priceRange": "€€",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrer Pelai, 12",
          "addressLocality": "Barcelona",
          "addressRegion": "Catalunya",
          "postalCode": "08001",
          "addressCountry": "ES"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.3851,
          "longitude": 2.1734
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "20:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "16:00"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Serveis de Teràpia",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Massatge Bàsic",
                "description": "Sessió de massatge terapèutic d'una hora per alleujar tensions quotidianes"
              },
              "price": "60.00",
              "priceCurrency": "EUR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Massatge Complet",
                "description": "Sessió completa que combina tècniques diverses per un tractament integral"
              },
              "price": "75.00",
              "priceCurrency": "EUR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Kinesiologia Barcelona",
                "description": "Sessió de kinesiologia aplicada per equilibrar el cos"
              },
              "price": "75.00",
              "priceCurrency": "EUR"
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        "url": url,
        "name": "EKA Balance",
        "description": description,
        "publisher": {
          "@id": `${url}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${url}/services?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="EKA Balance" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Catalan" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="EKA Balance" />
        <meta property="og:locale" content="ca_ES" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="theme-color" content="#F59E0B" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={url} />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
      </Helmet>
      {children}
    </>
  );
}
