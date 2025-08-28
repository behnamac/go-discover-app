import { useHeroBackground } from "@/hooks/hero";

const HeroBackground = () => {
  useHeroBackground();

  return (
    <div
      className="hero-background absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/hero-travel.jpg')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
    </div>
  );
};

export default HeroBackground;
