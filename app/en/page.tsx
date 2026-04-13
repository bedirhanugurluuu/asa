import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Growth from "../components/Growth";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PropertyManagement from "../components/PropertyManagement";
import SEO from "../components/SEO";
import Services from "../components/Services";

export default function HomeEN() {
  return (
    <main className="min-h-screen">
      <SEO />
      <Header />
      <Hero />
      <PropertyManagement />
      <Services />
      <Growth />
      <Contact />
      <Footer />
    </main>
  );
}
