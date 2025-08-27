import { useState, useEffect, useCallback } from "react";
import {
  restaurantService,
  Restaurant,
  RestaurantSearchParams,
} from "@/services/restaurantService";
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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (params: RestaurantSearchParams) => {
      console.log("🍕 Executing restaurant search for:", params.location);
      try {
        setIsLoading(true);
        setError(null);

        const results = await restaurantService.searchNearbyRestaurants(params);
        setRestaurants(results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch restaurants"
        );
        console.error("Error fetching restaurants:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300), // Reduced from 500ms to 300ms
    []
  );

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

      debouncedSearch(searchParams);
    } else {
      // Clear restaurants if zoom is too low
      setRestaurants([]);
    }
  }, [
    mapCenter,
    currentZoom,
    minZoomLevel,
    searchRadius,
    minRating,
    maxPrice,
    debouncedSearch,
  ]);

  // Update map center and zoom
  const updateMapView = useCallback(
    (center: { lat: number; lng: number }, zoom: number) => {
      setMapCenter(center);
      setCurrentZoom(zoom);
    },
    []
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
