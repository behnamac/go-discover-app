import { useHeroFeatures } from "@/hooks/hero";
import HeroFeatureCard from "./HeroFeatureCard";

const HeroFeatureCards = () => {
  const { features } = useHeroFeatures();

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <HeroFeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          gradientClass={feature.gradientClass}
          iconColor={feature.iconColor}
        />
      ))}
    </div>
  );
};

export default HeroFeatureCards;
