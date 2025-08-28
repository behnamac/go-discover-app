interface Location {
  lat: number;
  lng: number;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  category: string;
  image: string;
  description: string;
  position: Location;
  distance: string;
  address: string;
  phone?: string;
  website?: string;
  hours?: string;
}

interface RestaurantSearchParams {
  location: Location;
  radius?: number; // in meters
  type?: string; // restaurant, cafe, bar, etc.
  minRating?: number;
  maxPrice?: number;
}

class RestaurantService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // You'll need to get your RapidAPI key from https://rapidapi.com/
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || "";
    this.baseUrl = "https://places.googleapis.com/v1/places:searchNearby";

    // Debug API key status
    if (!this.apiKey) {
      console.warn(
        "⚠️ RapidAPI key not found! Set VITE_RAPIDAPI_KEY in your .env file"
      );
    } else {
      console.log("✅ RapidAPI key found");
    }

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      console.warn(
        "⚠️ Google Maps API key not found! Set VITE_GOOGLE_MAPS_API_KEY in your .env file"
      );
    } else {
      console.log("✅ Google Maps API key found");
    }

    // Test API connectivity on initialization
    setTimeout(() => {
      this.testAPIConnectivity().then((results) => {
        if (!results.rapidapi && !results.google) {
          console.warn("⚠️ Both APIs failed. Using mock data only.");
        }
      });
    }, 1000);
  }

  // Search for restaurants at any location on the map (not just user's location)
  // This allows users to explore restaurants anywhere they zoom in
  // Using RapidAPI Travel Advisor by default for better reliability
  async searchNearbyRestaurants(
    params: RestaurantSearchParams
  ): Promise<Restaurant[]> {
    // Try RapidAPI first, fallback to Google Places API
    try {
      return await this.searchNearbyRestaurantsRapidAPI(params);
    } catch (error) {
      console.warn("RapidAPI failed, trying Google Places API:", error);
      return await this.searchNearbyRestaurantsGoogle(params);
    }
  }

  // Google Places API implementation (fallback)
  async searchNearbyRestaurantsGoogle(
    params: RestaurantSearchParams
  ): Promise<Restaurant[]> {
    const {
      location,
      radius = 1000,
      type = "restaurant",
      minRating = 0,
      maxPrice = 4,
    } = params;

    try {
      // Using Google Places API (you'll need to enable Places API in Google Cloud Console)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${location.lat},${location.lng}&` +
          `radius=${radius}&` +
          `type=${type}&` +
          `minprice=0&` +
          `maxprice=${maxPrice}&` +
          `key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        console.warn("Places API response:", data.status, data.error_message);
        // Return mock data with a note about API issues
        console.log(
          "Using mock data due to API issues. Check your Google Maps API key and billing setup."
        );
        return this.getMockRestaurants(location);
      }

      return data.results
        .map((place: any, index: number) => ({
          id: place.place_id || `restaurant-${index}`,
          name: place.name,
          rating: place.rating || 0,
          reviews: place.user_ratings_total || 0,
          price: this.getPriceLevel(place.price_level),
          category: this.getCategory(place.types),
          image: place.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
                place.photos[0].photo_reference
              }&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            : this.getRandomRestaurantImage(),
          description: this.generateDescription(place.types),
          position: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          distance: this.calculateDistance(location, {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }),
          address: place.vicinity || "Address not available",
          phone: place.formatted_phone_number,
          website: place.website,
          hours: place.opening_hours?.open_now ? "Open now" : "Closed",
        }))
        .filter((restaurant) => restaurant.rating >= minRating);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      console.log(
        "Using mock data due to network/API error. Check your Google Maps API key and billing setup."
      );
      return this.getMockRestaurants(location);
    }
  }

  // Using RapidAPI Travel Advisor for restaurant data
  async searchNearbyRestaurantsRapidAPI(
    params: RestaurantSearchParams
  ): Promise<Restaurant[]> {
    const {
      location,
      radius = 1000,
      type = "restaurant",
      minRating = 0,
      maxPrice = 4,
    } = params;

    try {
      // Use the list-by-latlng endpoint with URL parameters
      const url = new URL(
        "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng"
      );
      url.searchParams.append("latitude", location.lat.toString());
      url.searchParams.append("longitude", location.lng.toString());
      url.searchParams.append("limit", "20");
      url.searchParams.append("currency", "USD");
      url.searchParams.append("distance", (radius / 1000).toString());
      url.searchParams.append("open_now", "false");
      url.searchParams.append("lunit", "km");
      url.searchParams.append("lang", "en_US");
      url.searchParams.append("min_rating", "0");
      url.searchParams.append("max_rating", "5");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        throw new Error(`RapidAPI error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("RapidAPI response:", data);

      if (!data.data || !Array.isArray(data.data)) {
        console.warn("No restaurant data returned from RapidAPI");
        console.log("Response structure:", Object.keys(data));
        return this.getMockRestaurants(location);
      }

      console.log(`Found ${data.data.length} restaurants from RapidAPI`);
      console.log("Search location:", location);
      console.log("API URL:", url.toString());
      console.log("Sample restaurant data:", data.data[0]);
      console.log(
        "Sample restaurant image:",
        data.data[0]?.photo?.images?.medium?.url
      );
      console.log(
        "🍕 First 3 restaurants from API:",
        data.data.slice(0, 3).map((r) => r.name)
      );

      // Log categories to see what we're getting
      console.log(
        "🍕 Categories in response:",
        data.data.map((r: any) => ({
          name: r.name,
          category: r.category?.name,
          cuisine: r.cuisine?.[0]?.name,
          type: r.type,
        }))
      );

      const finalRestaurants = data.data
        .filter((place: any) => {
          // Filter by rating
          if (place.rating < minRating) return false;

          // The API already filters for restaurants, but let's double-check
          const category = place.category?.name?.toLowerCase() || "";
          const name = place.name?.toLowerCase() || "";

          // Exclude obvious non-restaurant places
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

          // Check if it's clearly not a restaurant
          const isNotRestaurant = nonRestaurantKeywords.some(
            (keyword) => category.includes(keyword) || name.includes(keyword)
          );

          console.log(
            `🍕 Filtering ${place.name}: category=${category}, isNotRestaurant=${isNotRestaurant}`
          );

          // Include if it's not clearly a non-restaurant place
          return !isNotRestaurant;
        })
        .map((place: any, index: number) => {
          console.log(`🍕 Processing restaurant ${index}: ${place.name}`);
          // Validate coordinates
          const coords = this.validateCoordinates(
            place.latitude,
            place.longitude
          );
          if (!coords) {
            console.warn(
              `Invalid coordinates for restaurant ${place.name}: ${place.latitude}, ${place.longitude}`
            );
            return null;
          }

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
              this.getRandomRestaurantImage(),
            description: place.description || this.generateDescription([type]),
            position: coords,
            distance: this.calculateDistance(location, coords),
            address: place.address_string || "Address not available",
            phone: place.phone || "Phone not available",
            website: place.website || "Website not available",
            hours: place.open_now_text || "Hours not available",
          };
        })
        .filter((restaurant) => restaurant !== null);

      console.log(
        "🍕 Final processed restaurants:",
        finalRestaurants.map((r) => r.name)
      );
      return finalRestaurants;
    } catch (error) {
      console.error("❌ Error fetching restaurants from RapidAPI:", error);
      console.log(
        "🔄 Using mock data due to RapidAPI error. Check your RapidAPI key and subscription."
      );

      if (error instanceof Error) {
        console.log("Error details:", error.message);
      }

      return this.getMockRestaurants(location);
    }
  }

  // Test API connectivity
  async testAPIConnectivity(): Promise<{ rapidapi: boolean; google: boolean }> {
    const results = { rapidapi: false, google: false };

    // Test RapidAPI with actual restaurant search
    try {
      const url = new URL(
        "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng"
      );
      url.searchParams.append("latitude", "40.7128");
      url.searchParams.append("longitude", "-74.006");
      url.searchParams.append("limit", "5");
      url.searchParams.append("currency", "USD");
      url.searchParams.append("distance", "1");
      url.searchParams.append("open_now", "false");
      url.searchParams.append("lunit", "km");
      url.searchParams.append("lang", "en_US");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          results.rapidapi = true;
          console.log("✅ RapidAPI connection successful - Found restaurants");
        } else {
          console.log("⚠️ RapidAPI connected but no restaurant data returned");
        }
      } else {
        console.log(
          `❌ RapidAPI connection failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.log("❌ RapidAPI connection error:", error);
    }

    // Note: Google Places API cannot be tested from browser due to CORS
    console.log("ℹ️ Google Places API testing skipped (CORS restriction)");

    return results;
  }

  // Get detailed information about a specific restaurant
  async getRestaurantDetails(restaurantId: string): Promise<Restaurant | null> {
    try {
      const response = await fetch(
        "https://travel-advisor.p.rapidapi.com/restaurants/v2/get-details",
        {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": this.apiKey,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationId: restaurantId,
            currency: "USD",
            lang: "en_US",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Restaurant details API error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.data) {
        console.warn("No restaurant details returned from RapidAPI");
        return null;
      }

      const place = data.data;

      return {
        id: place.locationId || place.location_id || restaurantId,
        name: place.name || "Restaurant",
        rating: place.rating || 0,
        reviews: place.numReviews || place.num_reviews || 0,
        price:
          this.getPriceLevelFromString(place.priceLevel || place.price_level) ||
          "$$",
        category: place.cuisine?.[0]?.name || place.category || "Restaurant",
        image:
          place.photo?.images?.medium?.url ||
          place.photo?.images?.small?.url ||
          this.getRandomRestaurantImage(),
        description:
          place.description ||
          place.shortDescription ||
          this.generateDescription(["restaurant"]),
        position: {
          lat: parseFloat(place.latitude || place.lat) || 0,
          lng: parseFloat(place.longitude || place.lng) || 0,
        },
        distance: "0 km", // Will be calculated when we have the reference location
        address:
          place.addressString ||
          place.address_string ||
          place.address ||
          "Address not available",
        phone: place.phone || place.phoneNumber || "Phone not available",
        website: place.website || place.url || "Website not available",
        hours:
          place.openNowText ||
          place.open_now_text ||
          place.hours ||
          "Hours not available",
      };
    } catch (error) {
      console.error("Error fetching restaurant details from RapidAPI:", error);
      return null;
    }
  }

  private getPriceLevel(level: number): string {
    switch (level) {
      case 1:
        return "$";
      case 2:
        return "$$";
      case 3:
        return "$$$";
      case 4:
        return "$$$$";
      default:
        return "$$";
    }
  }

  private getPriceLevelFromString(priceLevel: string | number): string {
    if (typeof priceLevel === "number") {
      return this.getPriceLevel(priceLevel);
    }

    if (typeof priceLevel === "string") {
      // Handle string-based price levels
      const level = priceLevel.toLowerCase();
      if (level.includes("inexpensive") || level.includes("$")) return "$";
      if (level.includes("moderate") || level.includes("$$")) return "$$";
      if (level.includes("expensive") || level.includes("$$$")) return "$$$";
      if (level.includes("very expensive") || level.includes("$$$$"))
        return "$$$$";
    }

    return "$$";
  }

  private getCategory(types: string[]): string {
    const categories = {
      restaurant: "Restaurant",
      cafe: "Cafe",
      bar: "Bar",
      bakery: "Bakery",
      food: "Food",
      meal_takeaway: "Takeaway",
      meal_delivery: "Delivery",
    };

    for (const type of types) {
      if (categories[type as keyof typeof categories]) {
        return categories[type as keyof typeof categories];
      }
    }

    return "Restaurant";
  }

  private generateDescription(types: string[]): string {
    const descriptions = [
      "Delicious food and great atmosphere",
      "Popular local favorite",
      "Fresh ingredients and friendly service",
      "Cozy dining experience",
      "Authentic flavors and warm hospitality",
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomRestaurantImage(): string {
    const images = ["🍕", "🍔", "🍜", "🍣", "🍖", "🥗", "🍝", "🌮", "🍤", "🥘"];
    return images[Math.floor(Math.random() * images.length)];
  }

  private calculateDistance(from: Location, to: Location): string {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(to.lat - from.lat);
    const dLng = this.toRadians(to.lng - from.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(from.lat)) *
        Math.cos(this.toRadians(to.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private validateCoordinates(
    lat: any,
    lng: any
  ): { lat: number; lng: number } | null {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Check if coordinates are valid numbers and within valid ranges
    if (isNaN(latNum) || isNaN(lngNum)) {
      return null;
    }

    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return null;
    }

    return { lat: latNum, lng: lngNum };
  }

  private getMockRestaurants(location: Location): Restaurant[] {
    // Generate unique restaurants based on location coordinates
    const locationHash = Math.abs(location.lat * 1000 + location.lng * 1000);
    const seed = Math.floor(locationHash) % 1000;

    // Import mock data
    const { restaurantNames, restaurantTypes, descriptions, streetNames } = require("@/data/mockRestaurantData");

    const mockRestaurants: Restaurant[] = [];

    for (let i = 0; i < 5; i++) {
      const nameIndex = (seed + i * 7) % restaurantNames.length;
      const typeIndex = (seed + i * 11) % restaurantTypes.length;
      const streetIndex = (seed + i * 13) % streetNames.length;
      const descIndex = (seed + i * 17) % descriptions.length;

      const rating = 3.5 + Math.random() * 1.5; // 3.5 to 5.0
      const reviews = Math.floor(Math.random() * 2000) + 100;
      const priceLevel = Math.floor(Math.random() * 3) + 1; // 1-3
      const price = "$".repeat(priceLevel);

      // Generate position with some randomness but relative to location
      const latOffset = (Math.random() - 0.5) * 0.01; // ±0.005 degrees
      const lngOffset = (Math.random() - 0.5) * 0.01;

      const position = {
        lat: location.lat + latOffset,
        lng: location.lng + lngOffset,
      };

      const distance = this.calculateDistance(location, position);

      mockRestaurants.push({
        id: `mock-${locationHash}-${i}`,
        name: restaurantNames[nameIndex],
        rating: Math.round(rating * 10) / 10,
        reviews,
        price,
        category: restaurantTypes[typeIndex].name,
        image: restaurantTypes[typeIndex].icon,
        description: descriptions[descIndex],
        position,
        distance,
        address: `${Math.floor(Math.random() * 999) + 1} ${
          streetNames[streetIndex]
        }`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 9000) + 1000}`,
        hours: Math.random() > 0.3 ? "Open now" : "Closed",
      });
    }

    return mockRestaurants;
  }
}

export const restaurantService = new RestaurantService();
export type { Restaurant, RestaurantSearchParams, Location };
