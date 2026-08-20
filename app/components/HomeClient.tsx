"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/app/lib/site";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import NosotrosSection from "./NosotrosSection";
import ServiciosSection from "./ServiciosSection";
import ProductosSection from "./ProductosSection";
import GaleriaSection from "./GaleriaSection";
import EquipoSection from "./EquipoSection";
import TestimoniosSection from "./TestimoniosSection";
import CtaBanner from "./CtaBanner";
import FAQSection from "./FAQSection";
import ContactoSection from "./ContactoSection";
import Footer from "./Footer";
import MaintenancePage from "./MaintenancePage";
import ScrollProgress from "./ScrollProgress";
import WhatsAppFab from "./WhatsAppFab";
import CookieBanner from "./CookieBanner";
import MobileNav from "./MobileNav";
import BackToTop from "./BackToTop";

interface SiteStatus {
  maintenance_mode: boolean;
  maintenance_title?: string;
  maintenance_message?: string;
}

export default function HomeClient() {
  const [maintenance, setMaintenance] = useState<SiteStatus | null>(null);

  useEffect(() => {
    // Warm-up backend + status en paralelo. No bloqueamos el render.
    fetch(`${SITE.backend.url}/api/health`).catch(() => {});
    fetch("/api/status")
      .then((r) => r.json())
      .then((d: SiteStatus) => {
        if (d?.maintenance_mode) setMaintenance(d);
      })
      .catch(() => {});
  }, []);

  if (maintenance?.maintenance_mode) {
    return (
      <MaintenancePage
        title={maintenance.maintenance_title || "Volvemos pronto"}
        message={maintenance.maintenance_message || "Estamos preparando algo especial."}
      />
    );
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main id="main">
        <HeroSection />
        <NosotrosSection />
        <ServiciosSection />
        <ProductosSection />
        <GaleriaSection />
        <EquipoSection />
        <TestimoniosSection />
        <CtaBanner />
        <FAQSection />
        <ContactoSection />
      </main>

      <Footer />

      <BackToTop />
      <WhatsAppFab />
      <MobileNav />
      <CookieBanner />
    </>
  );
}
