import { useState, useEffect, useCallback } from "react";
import {
  restaurantService,
  Restaurant,
  RestaurantSearchParams,
} from "@/services/restaurantService";
import { apiService } from "@/services/apiService";
import { useLocation } from "@/contexts/LocationContext";

interface UseRestaurantsOptions {
  minZoomLevel?: number;
  searchRadius?: number;
  minRating?: number;
  maxPrice?: number;
}

export const useRestaurants = (options: UseRestaurantsOptions = {}) => {
  const {
    minZoomLevel = 14,
    searchRadius = 1000,
    minRating = 0,
    maxPrice = 4,
  } = options;

  const { userLocation } = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(10);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Direct search function (no debounce for testing)
  const directSearch = useCallback(
    async (params: RestaurantSearchParams) => {
      console.log("🍕 Executing restaurant search for:", params.location);
      console.log("🍕 Search params:", params);
      try {
        setIsLoading(true);
        setError(null);

        // Use the new API service instead of direct restaurant service
        const results = await apiService.searchRestaurants(params);
        console.log(
          "🍕 Setting restaurants in state:",
          results.length,
          "restaurants"
        );
        console.log(
          "🍕 First restaurant:",
          results[0]?.name,
          "at",
          results[0]?.position
        );
        setRestaurants([...results]); // Force new array reference
        console.log("🍕 Restaurants state updated");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch restaurants"
        );
        console.error("Error fetching restaurants:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [] // Remove restaurants.length dependency
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (params: RestaurantSearchParams) => {
      await directSearch(params);
    }, 300),
    [directSearch]
  );

  // Monitor restaurants state changes
  useEffect(() => {
    console.log(
      "🍕 Restaurants state changed:",
      restaurants.length,
      "restaurants"
    );
    if (restaurants.length > 0) {
      console.log("🍕 First restaurant in state:", restaurants[0]?.name);
    }
  }, [restaurants]);

  // Search restaurants when map center or zoom changes
  useEffect(() => {
    if (!mapCenter) return;

    console.log(
      "🔍 Searching restaurants for location:",
      mapCenter,
      "zoom:",
      currentZoom
    );

    // Only search if zoom level is sufficient
    if (currentZoom >= minZoomLevel) {
      const searchParams: RestaurantSearchParams = {
        location: mapCenter,
        radius: searchRadius,
        minRating,
        maxPrice,
      };

      console.log("🍕 About to call directSearch with:", searchParams);
      directSearch(searchParams);
    } else {
      // Clear restaurants if zoom is too low
      setRestaurants([]);
    }
  }, [
    mapCenter?.lat, // Only depend on lat/lng values, not the entire object
    mapCenter?.lng,
    currentZoom,
    minZoomLevel,
    searchRadius,
    minRating,
    maxPrice,
    directSearch, // Add back but with stable reference
  ]);

  // Update map center and zoom
  const updateMapView = useCallback(
    (center: { lat: number; lng: number }, zoom: number) => {
      console.log("🗺️ updateMapView called with:", center, "zoom:", zoom);

      // Force immediate state update
      setMapCenter({ ...center });
      setCurrentZoom(zoom);

      console.log("🗺️ State update triggered for:", center);
    },
    [] // Keep empty to prevent loops
  );

  // Refresh restaurants
  const refreshRestaurants = useCallback(async () => {
    if (!mapCenter) return;

    const searchParams: RestaurantSearchParams = {
      location: mapCenter,
      radius: searchRadius,
      minRating,
      maxPrice,
    };

    await debouncedSearch(searchParams);
  }, [mapCenter, searchRadius, minRating, maxPrice, debouncedSearch]);

  // Clear restaurants
  const clearRestaurants = useCallback(() => {
    setRestaurants([]);
    setError(null);
  }, []);

  return {
    restaurants,
    isLoading,
    error,
    currentZoom,
    mapCenter,
    updateMapView,
    refreshRestaurants,
    clearRestaurants,
    shouldShowRestaurants: currentZoom >= minZoomLevel,
  };
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
