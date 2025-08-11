import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    navigate("/search");
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Next
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Destination
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Find amazing places, restaurants, and experiences near you with
                real-time recommendations powered by your location.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="hero"
                className="text-lg px-8 py-6"
                onClick={handleStartExploring}
              >
                <Navigation className="mr-2 h-5 w-5" />
                Start Exploring
              </Button>
              <Button size="lg" variant="glass" className="text-lg px-8 py-6">
                <MapPin className="mr-2 h-5 w-5" />
                Enable Location
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground">Places</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500K+</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-4">
            <Card className="p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-gradient-ocean">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Location</h3>
                  <p className="text-muted-foreground">
                    Get personalized recommendations based on your exact
                    location and preferences.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-gradient-sunset">
                  <Star className="h-6 w-6 text-cta-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Smart Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Discover hidden gems and popular spots with AI-powered
                    suggestions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-gradient-hero">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Reviews</h3>
                  <p className="text-muted-foreground">
                    Read authentic reviews from fellow explorers and locals.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
