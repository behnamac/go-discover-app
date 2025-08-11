import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/CategorySection";
import MapSection from "@/components/Home/MapSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import Footer from "@/components/Layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MapSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
