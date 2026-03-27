import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natura — Flores y Plantas | Reinosa, Cantabria",
  description: "Natura, tu floristería de confianza en Reinosa. Flores frescas, plantas de interior y exterior, ramos personalizados y arreglos florales para cada ocasión.",
  keywords: ["floristería", "flores", "plantas", "ramos", "natura", "Reinosa", "Cantabria", "flores frescas", "arreglos florales"],
  openGraph: {
    title: "Natura — Flores y Plantas",
    description: "Flores frescas y plantas para cada momento especial. Floristería en Reinosa, Cantabria.",
    type: "website",
    locale: "es_ES",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B8860B",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FloristShop',
  name: 'Floristería Natura',
  description: 'Floristería en Reinosa. Flores frescas, plantas, ramos de novia, decoración para bodas y eventos. Entrega a domicilio.',
  url: 'https://www.floresyplantasnatura.es',
  telephone: '+34606598156',
  email: 'terear@hotmail.es',
  priceRange: '€€',
  image: 'https://www.floresyplantasnatura.es/hero.jpeg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Peligros, 2',
    addressLocality: 'Reinosa',
    postalCode: '39200',
    addressRegion: 'Cantabria',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.0002664,
    longitude: -4.1402405,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:30', closes: '13:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '16:30', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:30', closes: '13:30' },
  ],
  sameAs: [
    'https://www.google.com/maps?q=Calle+Peligros+2,+39200+Reinosa,+Cantabria',
  ],
  hasMap: 'https://maps.google.com/maps?q=Calle+Peligros+2,+Cantabria+39200',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '47',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
