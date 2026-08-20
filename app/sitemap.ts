import { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain;
  const now = new Date();

  return [
    { url: base,                             lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/#productos`,             lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#servicios`,             lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/#galeria`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#nosotros`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/#contacto`,              lastModified: now, changeFrequency: "yearly",  priority: 0.8 },
    { url: `${base}/politica-privacidad`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
