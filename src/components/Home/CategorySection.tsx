import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Camera, 
  Building, 
  Coffee, 
  ShoppingBag, 
  TreePine,
  Waves,
  Mountain
} from "lucide-react";

const categories = [
  {
    icon: Utensils,
    name: "Restaurants",
    description: "Local cuisine & dining",
    color: "bg-gradient-sunset",
    count: "2.5K+"
  },
  {
    icon: Camera,
    name: "Attractions",
    description: "Must-see landmarks",
    color: "bg-gradient-hero",
    count: "1.8K+"
  },
  {
    icon: Building,
    name: "Hotels",
    description: "Perfect places to stay",
    color: "bg-gradient-ocean",
    count: "950+"
  },
  {
    icon: Coffee,
    name: "Cafés",
    description: "Coffee & cozy spots",
    color: "bg-gradient-sunset",
    count: "1.2K+"
  },
  {
    icon: ShoppingBag,
    name: "Shopping",
    description: "Markets & boutiques",
    color: "bg-gradient-hero",
    count: "750+"
  },
  {
    icon: TreePine,
    name: "Nature",
    description: "Parks & outdoor spaces",
    color: "bg-gradient-ocean",
    count: "650+"
  },
  {
    icon: Waves,
    name: "Beaches",
    description: "Coastal destinations",
    color: "bg-gradient-sunset",
    count: "420+"
  },
  {
    icon: Mountain,
    name: "Adventures",
    description: "Hiking & activities",
    color: "bg-gradient-hero",
    count: "380+"
  }
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-gradient-sky">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Explore by 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Category</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing places tailored to your interests, from hidden local gems to popular destinations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-travel transition-bounce bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/20"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce`}>
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="text-xs font-medium text-primary">{category.count} nearby</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="px-8">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;