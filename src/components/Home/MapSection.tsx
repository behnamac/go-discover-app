import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GoogleMap from "@/components/ui/google-map";
import { useLocation } from "@/contexts/LocationContext";
import { useRestaurants } from "@/hooks/use-restaurants";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  slideInLeft,
  slideInRight,
  staggerFadeIn,
  cardHover,
  buttonClick,
  scaleIn,
  pulse,
} from "@/lib/animations";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Layers,
  Crosshair,
  Loader2,
} from "lucide-react";

const MapSection = () => {
  const {
    userLocation,
    getCurrentLocation,
    isLoading: locationLoading,
  } = useLocation();
  const sectionRef = useRef<HTMLElement>(null);

  const {
    restaurants,
    isLoading: restaurantsLoading,
    error: restaurantsError,
    currentZoom,
    mapCenter,
    updateMapView,
    refreshRestaurants,
    shouldShowRestaurants,
  } = useRestaurants({
    minZoomLevel: 14,
    searchRadius: 1000,
    minRating: 0,
    maxPrice: 4,
  });

  // Convert restaurants to map markers
  const restaurantMarkers = restaurants.map((restaurant) => ({
    position: restaurant.position,
    title: restaurant.name,
  }));

  // Add user location marker if available
  const allMarkers = userLocation
    ? [
        ...restaurantMarkers,
        {
          position: userLocation,
          title: "Your Location",
        },
      ]
    : restaurantMarkers;

  const handleMarkerClick = (marker: any) => {
    console.log("Marker clicked:", marker.title);
  };

  const handleCenterOnLocation = () => {
    buttonClick(".center-location-btn");
    if (userLocation) {
      // This would typically trigger a map center action
      console.log("Centering on user location:", userLocation);
    } else {
      getCurrentLocation();
    }
  };

  const handleMapZoomChanged = (zoom: number) => {
    // Use current map center instead of user location for zoom changes
    const currentCenter = mapCenter ||
      userLocation || { lat: 40.7128, lng: -74.006 };
    updateMapView(currentCenter, zoom);
  };

  const handleMapCenterChanged = (center: { lat: number; lng: number }) => {
    updateMapView(center, currentZoom);
  };

  useEffect(() => {
    if (sectionRef.current) {
      // Scroll-triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.add(() => {
        // Map section content animations
        slideInLeft(".map-content", 0);
        slideInRight(".map-container", 0.2);
        staggerFadeIn(".nearby-place", 0.4);
      });

      // Card hover animations
      cardHover(".nearby-place");

      // Pulse animation for location badge
      if (userLocation) {
        pulse(".location-badge");
      }

      // Map controls animations
      scaleIn(".map-controls", 0.6);
    }
  }, [userLocation]);

  return (
    <section ref={sectionRef} className="map-section py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="map-content space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">
                Explore Your
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {" "}
                  Area
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Interactive map with real-time location and nearby
                recommendations
              </p>
              {userLocation && (
                <div className="mt-4 flex items-center justify-center lg:justify-start">
                  <Badge
                    variant="secondary"
                    className="location-badge flex items-center space-x-2"
                  >
                    <MapPin className="h-3 w-3" />
                    <span>Location Enabled</span>
                  </Badge>
                </div>
              )}
              {currentZoom < 14 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Zoom in to see nearby restaurants
                </div>
              )}
            </div>

            {/* Map Container */}
            <Card className="map-container relative h-96 border-border/40 overflow-hidden">
              <GoogleMap
                center={userLocation || { lat: 40.7128, lng: -74.006 }}
                zoom={userLocation ? 15 : 14}
                markers={allMarkers}
                onMarkerClick={handleMarkerClick}
                onZoomChanged={handleMapZoomChanged}
                onCenterChanged={handleMapCenterChanged}
                className="w-full h-full"
              />

              {/* Map Controls */}
              <div className="map-controls absolute top-4 right-4 space-y-2">
                <Button variant="glass" size="icon">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant="glass"
                  size="icon"
                  className="center-location-btn"
                  onClick={handleCenterOnLocation}
                  disabled={locationLoading}
                >
                  <Crosshair className="h-4 w-4" />
                </Button>
              </div>

              {/* Loading indicator */}
              {restaurantsLoading && (
                <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading restaurants...</span>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-cta"></div>
                <span>Restaurants</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span>Popular Spots</span>
              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Nearby Places</h3>
              <p className="text-muted-foreground">
                {userLocation
                  ? shouldShowRestaurants
                    ? `Found ${restaurants.length} restaurants in this area`
                    : "Zoom in to see restaurants in this area"
                  : "Zoom in to see restaurants anywhere on the map"}
              </p>
              {restaurantsError && (
                <p className="text-sm text-destructive mt-2">
                  {restaurantsError}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="nearby-place hover:shadow-card transition-smooth cursor-pointer border-border/40"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-2xl overflow-hidden">
                          {restaurant.image.startsWith("http") ? (
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLElement;
                                target.style.display = "none";
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {restaurant.image}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {restaurant.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {restaurant.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {restaurant.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{restaurant.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{restaurant.distance}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{restaurant.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : shouldShowRestaurants && !restaurantsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No restaurants found in this area</p>
                  <p className="text-sm">
                    Try zooming out or moving to a different location
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Zoom in to see restaurants anywhere on the map</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
