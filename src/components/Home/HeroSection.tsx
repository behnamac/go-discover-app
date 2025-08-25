import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Star, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerFadeIn,
  floating,
  cardHover,
  buttonClick,
  locationButtonAnimation,
} from "@/lib/animations";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { getCurrentLocation, isLoading, userLocation, error } = useLocation();
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

  const handleStartExploring = () => {
    buttonClick(".explore-button");
    setTimeout(() => navigate("/search"), 150);
  };

  const handleEnableLocation = async () => {
    buttonClick(".location-button");
    try {
      await getCurrentLocation();
      if (userLocation) {
        locationButtonAnimation(".location-button", true);
        toast({
          title: "Location Enabled!",
          description: "Your location has been set. Explore nearby places!",
        });
      }
    } catch (err) {
      toast({
        title: "Location Error",
        description: error || "Failed to get your location. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      // Initial animations
      const tl = gsap.timeline();

      tl.add(() => {
        // Hero content animations
        fadeIn(".hero-title", 0.2);
        fadeIn(".hero-subtitle", 0.4);
        fadeIn(".hero-buttons", 0.6);
        fadeIn(".hero-stats", 0.8);
      });

      // Stagger animation for feature cards
      staggerFadeIn(".hero-card", 1);

      // Floating animation for background elements
      floating(".hero-background");

      // Card hover animations
      cardHover(".hero-card");

      // Parallax effect for background
      gsap.to(".hero-background", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="hero-background absolute inset-0 bg-cover bg-center bg-no-repeat"
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
              <h1 className="hero-title text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Next
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Destination
                </span>
              </h1>
              <p className="hero-subtitle text-xl text-muted-foreground max-w-lg">
                Find amazing places, restaurants, and experiences near you with
                real-time recommendations powered by your location.
              </p>
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="hero"
                className="explore-button text-lg px-8 py-6"
                onClick={handleStartExploring}
              >
                <Navigation className="mr-2 h-5 w-5" />
                Start Exploring
              </Button>
              <Button
                size="lg"
                variant="glass"
                className="location-button text-lg px-8 py-6"
                onClick={handleEnableLocation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-5 w-5" />
                )}
                {isLoading
                  ? "Getting Location..."
                  : userLocation
                  ? "Location Enabled"
                  : "Enable Location"}
              </Button>
            </div>

            {/* Stats */}
            <div className="hero-stats flex items-center space-x-8 pt-8">
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
            <Card className="hero-card p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
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

            <Card className="hero-card p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
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

            <Card className="hero-card p-6 bg-card/80 backdrop-blur-md border-border/40 shadow-card hover:shadow-travel transition-smooth">
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
