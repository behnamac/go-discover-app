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

  // Using RapidAPI Travel Advisor v2 endpoints (more reliable)
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
      // First, get restaurant filters to understand available options
      const filtersResponse = await fetch(
        "https://travel-advisor.p.rapidapi.com/restaurant-filters/v2/list",
        {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": this.apiKey,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            geoId: 1, // Default geo ID, will be overridden by coordinates
            date: new Date().toISOString().split("T")[0],
            partySize: 2,
            sort: "RELEVANCE",
            sortId: "relevance",
            filters: [],
            updateToken: "",
          }),
        }
      );

      if (!filtersResponse.ok) {
        throw new Error(`Filters API error! status: ${filtersResponse.status}`);
      }

      // Now get restaurants using the v2 list endpoint
      const restaurantsResponse = await fetch(
        "https://travel-advisor.p.rapidapi.com/restaurants/v2/list",
        {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": this.apiKey,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            geoId: 1, // This will be overridden by coordinates
            date: new Date().toISOString().split("T")[0],
            partySize: 2,
            sort: "RELEVANCE",
            sortId: "relevance",
            filters: [],
            updateToken: "",
            // Add location-based parameters
            latitude: location.lat,
            longitude: location.lng,
            radius: radius / 1000, // Convert to km
            limit: 20,
          }),
        }
      );

      if (!restaurantsResponse.ok) {
        throw new Error(
          `Restaurants API error! status: ${restaurantsResponse.status}`
        );
      }

      const data = await restaurantsResponse.json();

      if (!data.data || !Array.isArray(data.data)) {
        console.warn("No restaurant data returned from RapidAPI");
        return this.getMockRestaurants(location);
      }

      return data.data
        .filter((place: any) => place.rating >= minRating)
        .map((place: any, index: number) => ({
          id: place.locationId || place.location_id || `restaurant-${index}`,
          name: place.name || "Restaurant",
          rating: place.rating || 0,
          reviews: place.numReviews || place.num_reviews || 0,
          price:
            this.getPriceLevelFromString(
              place.priceLevel || place.price_level
            ) || "$$",
          category: place.cuisine?.[0]?.name || place.category || "Restaurant",
          image:
            place.photo?.images?.medium?.url ||
            place.photo?.images?.small?.url ||
            this.getRandomRestaurantImage(),
          description:
            place.description ||
            place.shortDescription ||
            this.generateDescription([type]),
          position: {
            lat: place.latitude || place.lat || location.lat,
            lng: place.longitude || place.lng || location.lng,
          },
          distance: this.calculateDistance(location, {
            lat: place.latitude || place.lat || location.lat,
            lng: place.longitude || place.lng || location.lng,
          }),
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
        }));
    } catch (error) {
      console.error("Error fetching restaurants from RapidAPI:", error);
      console.log(
        "Using mock data due to RapidAPI error. Check your RapidAPI key and subscription."
      );
      return this.getMockRestaurants(location);
    }
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
          lat: place.latitude || place.lat || 0,
          lng: place.longitude || place.lng || 0,
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

  private getMockRestaurants(location: Location): Restaurant[] {
    // Generate unique restaurants based on location coordinates
    const locationHash = Math.abs(location.lat * 1000 + location.lng * 1000);
    const seed = Math.floor(locationHash) % 1000;

    const restaurantNames = [
      "The Golden Fork",
      "Sapphire Kitchen",
      "Emerald Eats",
      "Ruby's Diner",
      "Diamond Delights",
      "Crystal Cafe",
      "Pearl Palace",
      "Amber Avenue",
      "Topaz Tavern",
      "Jade Junction",
      "Coral Corner",
      "Azure Alley",
      "Violet Vista",
      "Indigo Inn",
      "Maroon Market",
      "Teal Terrace",
      "Lavender Lane",
      "Crimson Corner",
      "Sage Street",
      "Copper Cafe",
    ];

    const restaurantTypes = [
      { name: "Restaurant", icon: "🍽️" },
      { name: "Cafe", icon: "☕" },
      { name: "Pizzeria", icon: "🍕" },
      { name: "Sushi Bar", icon: "🍣" },
      { name: "Burger Joint", icon: "🍔" },
      { name: "Taco Shop", icon: "🌮" },
      { name: "Steakhouse", icon: "🥩" },
      { name: "Seafood", icon: "🦐" },
      { name: "Bakery", icon: "🥐" },
      { name: "Deli", icon: "🥪" },
    ];

    const streetNames = [
      "Main Street",
      "Oak Avenue",
      "Pine Road",
      "Elm Street",
      "Maple Drive",
      "Cedar Lane",
      "Birch Boulevard",
      "Willow Way",
      "Cherry Circle",
      "Aspen Alley",
      "Spruce Street",
      "Hickory Highway",
      "Poplar Place",
      "Sycamore Square",
      "Beech Bend",
    ];

    const descriptions = [
      "Authentic local cuisine with a modern twist",
      "Cozy atmosphere with exceptional service",
      "Fresh ingredients sourced from local farms",
      "Family-owned establishment with traditional recipes",
      "Contemporary dining with international flavors",
      "Rustic charm meets culinary excellence",
      "Artisanal dishes in a relaxed setting",
      "Gourmet experience at affordable prices",
      "Home-style cooking with a gourmet touch",
      "Innovative menu featuring seasonal specialties",
    ];

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
