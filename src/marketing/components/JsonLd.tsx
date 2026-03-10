export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "EKA Balance",
    "image": "https://ekabalance.com/images/eka_logo.png",
    "@id": "https://ekabalance.com",
    "url": "https://ekabalance.com",
    "telephone": "+34658867133",
    "email": "contact@ekabalance.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrer Pelai, 12",
      "addressLocality": "Barcelona",
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
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "sameAs": [
      "https://instagram.com/eka_balance"
    ],
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
