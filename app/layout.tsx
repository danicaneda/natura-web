import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE } from "./lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const faviconSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 26' fill='none'><path d='M10 25 Q9.5 18 10 8' stroke='%23B8860B' stroke-width='1.15' stroke-linecap='round'/><path d='M10 21 C8 19 5 19 4 17 C6 13 10 15 10 19 Z' fill='%23B8860B'/><path d='M10 16 C12 14 15 13 16 11 C14 7 10 9 10 14 Z' fill='%23B8860B' opacity='0.78'/><path d='M10 9 C9.5 7 9 5 10 3 C11 5 10.5 7 10 9 Z' fill='%23B8860B' opacity='0.5'/></svg>`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Natura · Floristería en Reinosa | Flores, plantas y arte floral",
    template: "%s · Natura Floristería Reinosa",
  },
  description:
    "Floristería artesanal en Reinosa, Cantabria. Ramos personalizados, plantas de interior y exterior, decoración de bodas y eventos. Entrega a domicilio. Valoración ★ 5.0 en Google.",
  keywords: [
    "floristería Reinosa",
    "flores Cantabria",
    "ramos de novia Reinosa",
    "decoración de bodas Cantabria",
    "entrega flores Reinosa",
    "plantas Reinosa",
    "floristería Campoo",
  ],
  authors: [{ name: "Floristería Natura" }],
  creator: "Floristería Natura",
  publisher: "Floristería Natura",
  applicationName: "Natura Flores & Plantas",
  category: "Floristería",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Natura Flores & Plantas",
    title: "Natura · Floristería artesanal en Reinosa",
    description:
      "Ramos, plantas y arte floral con firma propia en Reinosa. ★ 5.0 en Google · desde 1995 cuidando cada flor.",
    url: SITE.domain,
    locale: "es_ES",
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Floristería Natura — Flores y plantas en Reinosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natura · Floristería en Reinosa",
    description:
      "Ramos, plantas y arte floral con firma propia. Reinosa, Cantabria.",
    images: ["/hero.jpeg"],
  },
  icons: {
    icon: faviconSvg,
    apple: faviconSvg,
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EE" },
    { media: "(prefers-color-scheme: dark)",  color: "#1A1208" },
  ],
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": `${SITE.domain}#business`,
  name: "Floristería Natura",
  alternateName: "Natura Flores & Plantas",
  description:
    "Floristería artesanal en Reinosa (Cantabria). Ramos, plantas, decoración de bodas y eventos. Entrega a domicilio.",
  url: SITE.domain,
  telephone: SITE.phone.tel,
  email: SITE.email,
  priceRange: "€€",
  foundingDate: SITE.founded.toString(),
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
  },
  image: `${SITE.domain}/hero.jpeg`,
  logo: `${SITE.domain}/hero.jpeg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postalCode,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  areaServed: [
    { "@type": "City", name: "Reinosa" },
    { "@type": "AdministrativeArea", name: "Campoo" },
    { "@type": "AdministrativeArea", name: "Cantabria" },
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:30", closes: "14:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "17:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:30", closes: "14:00" },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SITE.phone.tel,
      contactType: "customer service",
      areaServed: "ES",
      availableLanguage: ["Spanish"],
    },
    {
      "@type": "ContactPoint",
      telephone: SITE.phone.tel2,
      contactType: "sales",
      areaServed: "ES",
      availableLanguage: ["Spanish"],
    },
  ],
  sameAs: [SITE.google.mapsUrl],
  hasMap: SITE.google.mapsUrl,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.google.rating.toString(),
    reviewCount: SITE.google.reviewCount.toString(),
    bestRating: "5",
    worstRating: "1",
  },
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ramos de novia y decoración de bodas" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Decoración floral para eventos y celebraciones" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ramos y coronas para funerales" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entrega de flores a domicilio en Reinosa y comarca" } },
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.domain}#website`,
  url: SITE.domain,
  name: "Natura · Flores y Plantas",
  publisher: { "@id": `${SITE.domain}#business` },
  inLanguage: "es-ES",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <link rel="preconnect" href={SITE.backend.url} />
        <link rel="dns-prefetch" href={SITE.backend.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="n-skip">Saltar al contenido</a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
