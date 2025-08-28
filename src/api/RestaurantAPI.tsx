import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  category: string;
  image: string;
  description: string;
  position: {
    lat: number;
    lng: number;
  };
  distance: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
}

interface RestaurantSearchParams {
  location: {
    lat: number;
    lng: number;
  };
  radius: number;
  minRating: number;
  maxPrice: number;
}

const RestaurantAPI = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get parameters from URL
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "1000";
  const minRating = searchParams.get("minRating") || "0";
  const maxPrice = searchParams.get("maxPrice") || "4";

  const searchRestaurants = async (params: RestaurantSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Call RapidAPI
      const url = new URL(
        "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng"
      );
      url.searchParams.append("latitude", params.location.lat.toString());
      url.searchParams.append("longitude", params.location.lng.toString());
      url.searchParams.append("limit", "20");
      url.searchParams.append("currency", "USD");
      url.searchParams.append("distance", (params.radius / 1000).toString());
      url.searchParams.append("open_now", "false");
      url.searchParams.append("lunit", "km");
      url.searchParams.append("lang", "en_US");
      url.searchParams.append("min_rating", params.minRating.toString());
      url.searchParams.append("max_rating", "5");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("No restaurant data returned from API");
      }

      // Process and filter restaurants
      const processedRestaurants = data.data
        .filter((place: any) => {
          if (place.rating < params.minRating) return false;

          const category = place.category?.name?.toLowerCase() || "";
          const name = place.name?.toLowerCase() || "";

          // Exclude non-restaurant places
          const nonRestaurantKeywords = [
            "museum",
            "gallery",
            "theater",
            "cinema",
            "park",
            "garden",
            "monument",
            "statue",
            "tower",
            "bridge",
            "castle",
            "palace",
            "temple",
            "church",
            "mosque",
            "synagogue",
            "shrine",
            "attraction",
            "landmark",
            "viewpoint",
            "observation",
            "tour",
            "experience",
            "adventure",
            "entertainment",
            "amusement",
            "zoo",
            "aquarium",
            "hotel",
            "hostel",
            "resort",
            "spa",
            "gym",
            "fitness",
          ];

          const isNotRestaurant = nonRestaurantKeywords.some(
            (keyword) => category.includes(keyword) || name.includes(keyword)
          );

          return !isNotRestaurant;
        })
        .map((place: any, index: number) => {
          const coords = {
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude),
          };

          return {
            id: place.location_id || `restaurant-${index}`,
            name: place.name || "Restaurant",
            rating: place.rating || 0,
            reviews: place.num_reviews || 0,
            price: place.price_level || "$$",
            category: place.cuisine?.[0]?.name || "Restaurant",
            image:
              place.photo?.images?.medium?.url ||
              place.photo?.images?.small?.url ||
              place.photo?.images?.large?.url ||
              "🍽️",
            description: place.description || "Restaurant description",
            position: coords,
            distance: "0 km", // Will be calculated on frontend
            address: place.address_string || "Address not available",
            phone: place.phone || "Phone not available",
            website: place.website || "Website not available",
            hours: place.open_now_text || "Hours not available",
          };
        });

      setRestaurants(processedRestaurants);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch restaurants"
      );
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Search when parameters change
  useEffect(() => {
    if (lat && lng) {
      const params: RestaurantSearchParams = {
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        radius: parseInt(radius),
        minRating: parseInt(minRating),
        maxPrice: parseInt(maxPrice),
      };
      searchRestaurants(params);
    }
  }, [lat, lng, radius, minRating, maxPrice]);

  // Return data as JSON
  return (
    <div style={{ display: "none" }}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.restaurantAPIResponse = ${JSON.stringify({
              restaurants,
              loading,
              error,
              timestamp: new Date().toISOString(),
            })};
          `,
        }}
      />
    </div>
  );
};

export default RestaurantAPI;
