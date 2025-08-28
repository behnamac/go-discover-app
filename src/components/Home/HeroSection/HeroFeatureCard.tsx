import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface HeroFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientClass: string;
  iconColor: string;
}

const HeroFeatureCard = ({
  icon: Icon,
  title,
  description,
  gradientClass,
  iconColor,
}: HeroFeatureCardProps) => {
  return (
    <Card className="hero-card p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${gradientClass}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default HeroFeatureCard;
