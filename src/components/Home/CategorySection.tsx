import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategoryData } from "@/hooks/useCategoryData";

const FeaturesSection = () => {
  const { features } = useCategoryData();

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
