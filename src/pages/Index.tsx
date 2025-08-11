import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Home/HeroSection";
import CategorySection from "@/components/Home/CategorySection";
import MapSection from "@/components/Home/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <MapSection />
      </main>
    </div>
  );
};

export default Index;