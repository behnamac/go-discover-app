import { useHeroStats } from "@/hooks/hero";

const HeroStats = () => {
  const { stats } = useHeroStats();

  return (
    <div className="hero-stats flex items-center space-x-8 pt-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;
