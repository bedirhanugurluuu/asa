import UnderConstruction from "./components/UnderConstruction";
import SEO from "./components/SEO";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO 
        title="Yakında - ASA Group Luxury Rent" 
        description="ASA Group Luxury Rent web sitesi yakında açılıyor. Kısa dönem kiralama yönetimi ve gelir optimizasyonu hizmetleri için bize ulaşın." 
      />
      <UnderConstruction />
    </main>
  );
}
