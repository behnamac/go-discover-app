import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GoogleMap from "@/components/ui/google-map";
import { useLocation } from "@/contexts/LocationContext";
import { useRestaurants } from "@/hooks/use-restaurants";
import { restaurantService } from "@/services/restaurantService";
import { gsap } from "gsap";
import {
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerFadeIn,
  cardHover,
  buttonClick,
  scaleIn,
  pageTransition,
} from "@/lib/animations";
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Heart,
  Crown,
  Utensils,
  Bed,
  Camera,
  Navigation,
  Crosshair,
  Layers,
  Loader2,
} from "lucide-react";

const SearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("restaurants");
  const {
    userLocation,
    getCurrentLocation,
    isLoading: locationLoading,
  } = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

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

  console.log(
    "🍕 SearchPage rendering with",
    restaurants.length,
    "restaurants"
  );
  if (restaurants.length > 0) {
    console.log("🍕 First restaurant in render:", restaurants[0]?.name);
  }

  const categories = [
    { id: "restaurants", name: "Restaurants", icon: Utensils },
    { id: "hotels", name: "Hotels", icon: Bed },
    { id: "attractions", name: "Attractions", icon: Camera },
  ];

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
    console.log("🗺️ Map center changed to:", center);
    updateMapView(center, currentZoom);
  };

  const handleTestAPIs = async () => {
    console.log("🧪 Testing API connectivity...");
    const results = await restaurantService.testAPIConnectivity();
    console.log("API Test Results:", results);

    if (results.rapidapi || results.google) {
      // Refresh restaurants to try real API data
      await refreshRestaurants();
    }
  };

  // Initialize map center when component loads
  useEffect(() => {
    const initialCenter = userLocation || { lat: 40.7128, lng: -74.006 };
    console.log("🗺️ Initializing map center:", initialCenter);
    updateMapView(initialCenter, userLocation ? 15 : 14);
  }, [userLocation]); // Removed updateMapView from dependencies

  useEffect(() => {
    if (pageRef.current) {
      // Page entrance animation
      pageTransition(pageRef.current);

      // Stagger animations for page content
      const tl = gsap.timeline({ delay: 0.2 });

      tl.add(() => {
        fadeIn(".search-header", 0);
        slideInLeft(".search-left-panel", 0.2);
        slideInRight(".search-right-panel", 0.4);
        staggerFadeIn(".nearby-restaurant", 0.6);
        scaleIn(".map-controls", 0.8);
      });

      // Card hover animations
      cardHover(".nearby-restaurant");
      cardHover(".search-card");
    }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Header */}
      <header className="search-header sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-hero">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Travel Advisor
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  userLocation
                    ? "Search in this area..."
                    : "Search anywhere on the map..."
                }
                className="pl-10 bg-background/50 border-border/40 focus:border-primary/40 transition-smooth"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button variant="hero" className="hidden md:flex">
            Explore new places
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Place Details */}
        <div className="search-left-panel w-1/3 border-r border-border/40 p-6 overflow-y-auto">
          {/* Image Placeholder */}
          <div className="search-card w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-6">
            <span className="text-muted-foreground">
              {restaurants.length > 0
                ? `${restaurants[0]?.name} Interior`
                : "Restaurant Interior"}
            </span>
          </div>

          {/* Restaurant Name */}
          <h1 className="text-2xl font-bold mb-4">
            {restaurants.length > 0
              ? restaurants[0]?.name
              : "Blue Ribbon Sushi"}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (restaurants[0]?.rating || 4)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              ({restaurants[0]?.reviews || 1247} reviews)
            </span>
          </div>

          {/* Price Range & Cuisine */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-muted-foreground">
              {restaurants[0]?.price || "$$$$"}
            </span>
            <span className="text-muted-foreground">
              {restaurants[0]?.category || "Japanese, Sushi"}
            </span>
          </div>

          {/* Ranking */}
          <div className="mb-4">
            <span className="text-muted-foreground">Distance</span>
            <p className="font-medium">
              {restaurants[0]?.distance || "0.3 km"} from your location
            </p>
          </div>

          {/* Badges */}
          <div className="flex space-x-2 mb-6">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Crown className="h-3 w-3" />
              <span>Top Rated</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Utensils className="h-3 w-3" />
              <span>{restaurants[0]?.category || "Restaurant"}</span>
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{restaurants[0]?.hours || "Open until 11:00 PM"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{restaurants[0]?.phone || "(212) 555-0123"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{restaurants[0]?.address || "123 Sushi Street, NYC"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
            <Button variant="outline" className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              Save to Favorites
            </Button>
          </div>
        </div>

        {/* Right Panel - Map and Nearby Places */}
        <div className="search-right-panel flex-1 relative">
          {/* Interactive Map */}
          <div className="w-full h-full">
            <GoogleMap
              center={userLocation || { lat: 40.7128, lng: -74.006 }}
              zoom={userLocation ? 15 : 14}
              markers={allMarkers}
              onMarkerClick={handleMarkerClick}
              onZoomChanged={handleMapZoomChanged}
              onCenterChanged={handleMapCenterChanged}
              className="w-full h-full"
            />
          </div>

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
            <Button
              variant="glass"
              size="icon"
              onClick={handleTestAPIs}
              title="Test APIs"
            >
              🔧
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                console.log("🔍 Current map center:", mapCenter);
                refreshRestaurants();
              }}
              title="Refresh Restaurants"
            >
              🔄
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => {
                const newCenter = { lat: 51.5074, lng: -0.1278 }; // London
                console.log("🗺️ Manually setting center to London:", newCenter);
                updateMapView(newCenter, 15);
              }}
              title="Test London"
            >
              🇬🇧
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

          {/* Nearby Restaurants Card */}
          <div className="absolute top-4 left-4 w-80">
            <Card className="bg-background/95 backdrop-blur">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">
                  Nearby Restaurants
                  {restaurants.length > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({restaurants.length}) - {restaurants[0]?.name}
                    </span>
                  )}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="nearby-restaurant flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
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
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            {restaurant.image}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {restaurant.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{restaurant.rating}</span>
                            </div>
                            <span>({restaurant.reviews})</span>
                            <span>•</span>
                            <span>{restaurant.distance}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : shouldShowRestaurants && !restaurantsLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        No restaurants found in this area
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {userLocation
                          ? "Zoom in to see restaurants in this area"
                          : "Zoom in to see restaurants anywhere on the map"}
                      </p>
                    </div>
                  )}
                </div>
                {restaurantsError && (
                  <p className="text-xs text-destructive mt-2">
                    {restaurantsError}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
