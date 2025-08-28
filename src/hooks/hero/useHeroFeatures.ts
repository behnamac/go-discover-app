import { MapPin, Star, Users } from "lucide-react";

export const useHeroFeatures = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-time Location",
      description: "Get personalized recommendations based on your exact location and preferences.",
      gradientClass: "bg-gradient-ocean",
      iconColor: "text-primary-foreground",
    },
    {
      icon: Star,
      title: "Smart Recommendations",
      description: "Discover hidden gems and popular spots with AI-powered suggestions.",
      gradientClass: "bg-gradient-sunset",
      iconColor: "text-cta-foreground",
    },
    {
      icon: Users,
      title: "Community Reviews",
      description: "Read authentic reviews from fellow explorers and locals.",
      gradientClass: "bg-gradient-hero",
      iconColor: "text-primary-foreground",
    },
  ];

  return { features };
};
