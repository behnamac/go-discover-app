import { useRef } from "react";
import HeroBackground from "./HeroSection/HeroBackground";
import HeroTitle from "./HeroSection/HeroTitle";
import HeroButtons from "./HeroSection/HeroButtons";
import HeroStats from "./HeroSection/HeroStats";
import HeroFeatureCards from "./HeroSection/HeroFeatureCards";
import { useHeroAnimations } from "@/hooks/hero";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Initialize all hero animations
  useHeroAnimations();

  return (
    <section
      ref={sectionRef}
      className="hero-section relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <HeroTitle />
            <HeroButtons />
            <HeroStats />
          </div>

          {/* Right Content - Feature Cards */}
          <HeroFeatureCards />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
