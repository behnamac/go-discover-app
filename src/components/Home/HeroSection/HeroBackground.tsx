import { useHeroBackground } from "@/hooks/hero";
import heroImage from "@/assets/hero-travel.jpg";

const HeroBackground = () => {
  useHeroBackground();

  return (
    <div
      className="hero-background absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
    </div>
  );
};

export default HeroBackground;
