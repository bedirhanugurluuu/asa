import Header from "../components/Header";
import Hero from "../components/Hero";
import PropertyManagement from "../components/PropertyManagement";
import Growth from "../components/Growth";
import Services from "../components/Services";
import Footer from "../components/Footer";

export default function HomeEN() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PropertyManagement />
      <Growth />
      <Services />
      <Footer />
    </main>
  );
}
