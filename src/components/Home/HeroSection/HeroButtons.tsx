import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useHeroButtons } from "@/hooks/hero";

const HeroButtons = () => {
  const { handleStartExploring, handleEnableLocation, isLoading, userLocation } = useHeroButtons();

  return (
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
  );
};

export default HeroButtons;
