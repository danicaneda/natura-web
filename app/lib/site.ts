export const SITE = {
  name: "Natura",
  tagline: "Flores & Plantas",
  city: "Reinosa",
  region: "Cantabria",
  address: {
    street: "Calle Peligros, 2",
    postalCode: "39200",
    city: "Reinosa",
    region: "Cantabria",
    country: "ES",
  },
  geo: {
    latitude: 43.00417,
    longitude: -4.13972,
  },
  phone: {
    display: "606 59 81 56",
    tel: "+34606598156",
    display2: "942 75 26 91",
    tel2: "+34942752691",
  },
  whatsapp: {
    number: "34606598156",
    url: (msg?: string) =>
      `https://wa.me/34606598156${msg ? `?text=${encodeURIComponent(msg)}` : ""}`,
  },
  email: "terear@hotmail.es",
  domain: "https://www.floresyplantasnatura.es",
  founded: 1995,
  backend: {
    // Backend público (FastAPI en Render). Se puede sobrescribir con
    // NEXT_PUBLIC_BACKEND_URL en Vercel si algún día se cambia el host.
    url:
      process.env.NEXT_PUBLIC_BACKEND_URL ??
      "https://natura-api.onrender.com",
  },
  hours: [
    { label: "Lunes a viernes", value: "9:30 – 14:00 · 17:00 – 20:00" },
    { label: "Sábado",          value: "9:30 – 14:00" },
    { label: "Domingo",         value: "Cerrado" },
  ] as const,
  google: {
    reviewsUrl:
      "https://www.google.com/search?q=Natura+flores+y+plantas+Reinosa+rese%C3%B1as&tbm=lcl",
    mapsUrl:
      "https://maps.google.com/?q=Calle+Peligros+2,+39200+Reinosa,+Cantabria",
    rating: 5.0,
    reviewCount: 47,
  },
  // Perfiles sociales reales. Dejar `null` cuando no exista perfil
  // publicado — el UI oculta el enlace automáticamente.
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
  },
} as const;
