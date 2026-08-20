import type { NextConfig } from "next";

const BACKEND = "https://natura-api.onrender.com";

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' se mantiene por los pequeños <script> inline de Next
  // (framework runtime + JSON-LD). Vercel Analytics se sirve same-origin
  // desde /_vercel/insights/*, así que no requiere un dominio extra.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: ${BACKEND} https://res.cloudinary.com https://*.cloudinary.com https://unpkg.com https://*.tile.openstreetmap.org`,
  `connect-src 'self' ${BACKEND} https://*.tile.openstreetmap.org`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http",  hostname: "localhost",                  port: "8001" },
      { protocol: "http",  hostname: "127.0.0.1",                  port: "8001" },
      { protocol: "https", hostname: "natura-api.onrender.com"                  },
      { protocol: "https", hostname: "res.cloudinary.com"                       },
      { protocol: "https", hostname: "*.cloudinary.com"                         },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy",   value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
