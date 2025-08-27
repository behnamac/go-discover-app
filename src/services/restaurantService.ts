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

  // Alternative: Using Google Places API directly (more reliable)
  async searchNearbyRestaurants(
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
      return this.getMockRestaurants(location);
    }
  }

  // Alternative: Using RapidAPI (if you prefer)
  async searchNearbyRestaurantsRapidAPI(
    params: RestaurantSearchParams
  ): Promise<Restaurant[]> {
    const { location, radius = 1000, type = "restaurant" } = params;

    try {
      const response = await fetch(
        `https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?` +
          `latitude=${location.lat}&` +
          `longitude=${location.lng}&` +
          `limit=20&` +
          `currency=USD&` +
          `distance=${radius}&` +
          `open_now=false&` +
          `lunit=km&` +
          `lang=en_US`,
        {
          headers: {
            "X-RapidAPI-Key": this.apiKey,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.data.map((place: any, index: number) => ({
        id: place.location_id || `restaurant-${index}`,
        name: place.name,
        rating: place.rating || 0,
        reviews: place.num_reviews || 0,
        price: place.price_level || "$$",
        category: place.cuisine?.[0]?.name || "Restaurant",
        image:
          place.photo?.images?.medium?.url || this.getRandomRestaurantImage(),
        description: place.description || this.generateDescription([type]),
        position: {
          lat: place.latitude,
          lng: place.longitude,
        },
        distance: this.calculateDistance(location, {
          lat: place.latitude,
          lng: place.longitude,
        }),
        address: place.address_string || "Address not available",
        phone: place.phone,
        website: place.website,
        hours: place.open_now_text || "Hours not available",
      }));
    } catch (error) {
      console.error("Error fetching restaurants from RapidAPI:", error);
      return this.getMockRestaurants(location);
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
    const mockRestaurants = [
      {
        id: "1",
        name: "Coastal Breeze Restaurant",
        rating: 4.8,
        reviews: 1247,
        price: "$$",
        category: "Restaurant",
        image: "🍖",
        description: "Fresh seafood with ocean views",
        position: { lat: location.lat + 0.001, lng: location.lng + 0.001 },
        distance: "0.3 km",
        address: "123 Ocean Drive",
        phone: "(555) 123-4567",
        hours: "Open now",
      },
      {
        id: "2",
        name: "Sunset Beach Cafe",
        rating: 4.9,
        reviews: 856,
        price: "$$",
        category: "Cafe",
        image: "☕",
        description: "Crystal clear waters and white sand views",
        position: { lat: location.lat - 0.002, lng: location.lng + 0.002 },
        distance: "0.8 km",
        address: "456 Beach Road",
        phone: "(555) 234-5678",
        hours: "Open now",
      },
      {
        id: "3",
        name: "Vista Hotel Restaurant",
        rating: 4.6,
        reviews: 543,
        price: "$$$",
        category: "Restaurant",
        image: "🏨",
        description: "Luxury accommodation with panoramic views",
        position: { lat: location.lat + 0.003, lng: location.lng - 0.001 },
        distance: "1.2 km",
        address: "789 Vista Boulevard",
        phone: "(555) 345-6789",
        hours: "Open now",
      },
    ];

    return mockRestaurants;
  }
}

export const restaurantService = new RestaurantService();
export type { Restaurant, RestaurantSearchParams, Location };
