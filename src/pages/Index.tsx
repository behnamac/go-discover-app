import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/CategorySection";
import MapSection from "@/components/Home/MapSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MapSection />
      </main>
    </div>
  );
};

export default Index;
