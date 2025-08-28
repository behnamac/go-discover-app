import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { buttonClick, locationButtonAnimation } from "@/lib/animations";

export const useHeroButtons = () => {
  const navigate = useNavigate();
  const { getCurrentLocation, isLoading, userLocation, error } = useLocation();
  const { toast } = useToast();

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

  return {
    handleStartExploring,
    handleEnableLocation,
    isLoading,
    userLocation,
  };
};
