import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Map, Filter, Utensils, Heart, Smartphone } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Real-time Geolocation",
    description:
      "Accurate location tracking provides personalized recommendations based on your exact position.",
    color: "bg-gradient-hero",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description:
      "Powered by Google Maps API for detailed navigation and route planning capabilities.",
    color: "bg-gradient-ocean",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description:
      "Filter by category, rating, distance, and price to find exactly what you're looking for.",
    color: "bg-gradient-sunset",
  },
  {
    icon: Utensils,
    title: "Places Discovery",
    description:
      "Find restaurants, attractions, and points of interest using Google Places API integration.",
    color: "bg-gradient-hero",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description:
      "Bookmark your favorite places and create personalized travel collections.",
    color: "bg-gradient-ocean",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Responsive interface optimized for all devices and screen sizes.",
    color: "bg-gradient-sunset",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Powerful Features for Every
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              Traveler
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience seamless travel planning with our advanced location-based
            services and intelligent recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-travel transition-bounce bg-card border-border/40 hover:border-primary/20 hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-bounce`}
                  >
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-xl mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
