import Header from "./components/Header";
import Hero from "./components/Hero";
import PropertyManagement from "./components/PropertyManagement";
import Growth from "./components/Growth";
import Services from "./components/Services";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import { translations } from "@/lib/translations";

export default function Home() {
  const t = translations.tr.seo.home;
  
  return (
    <main className="min-h-screen">
      <SEO title={t.title} description={t.description} />
      <Header />
      <Hero />
      <PropertyManagement />
      <Growth />
      <Services />
      <Footer />
      </main>
  );
}
