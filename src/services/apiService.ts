import {
  Restaurant,
  Location,
  RestaurantSearchParams,
} from "./restaurantService";

class APIService {
  private baseURL = window.location.origin;

  async searchRestaurants(
    params: RestaurantSearchParams
  ): Promise<Restaurant[]> {
    try {
      const url = new URL("/api/restaurants/search", this.baseURL);
      url.searchParams.append("lat", params.location.lat.toString());
      url.searchParams.append("lng", params.location.lng.toString());
      url.searchParams.append("radius", params.radius.toString());
      url.searchParams.append("minRating", params.minRating.toString());
      url.searchParams.append("maxPrice", params.maxPrice.toString());

      console.log("🔍 Calling internal API route:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Wait for the API route to process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get response from window object
      const apiResponse = (window as any).restaurantAPIResponse;

      if (!apiResponse) {
        throw new Error("No API response available");
      }

      if (apiResponse.error) {
        throw new Error(apiResponse.error);
      }

      console.log("🍕 API Response:", apiResponse);
      return apiResponse.restaurants || [];
    } catch (error) {
      console.error("❌ API Service error:", error);
      throw error;
    }
  }

  async getRestaurantDetails(restaurantId: string): Promise<Restaurant | null> {
    try {
      const url = new URL(`/api/restaurants/${restaurantId}`, this.baseURL);

      console.log("🔍 Calling restaurant details API:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Wait for the API route to process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get response from window object
      const apiResponse = (window as any).restaurantDetailsAPIResponse;

      if (!apiResponse) {
        throw new Error("No API response available");
      }

      if (apiResponse.error) {
        throw new Error(apiResponse.error);
      }

      console.log("🍕 Restaurant Details API Response:", apiResponse);
      return apiResponse.restaurant || null;
    } catch (error) {
      console.error("❌ API Service error:", error);
      throw error;
    }
  }

  async testAPIConnectivity(): Promise<{ rapidapi: boolean; google: boolean }> {
    try {
      const url = new URL("/api/test", this.baseURL);

      console.log("🧪 Testing API connectivity:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status}`);
      }

      // Wait for the API route to process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get response from window object
      const apiResponse = (window as any).apiTestResponse;

      if (!apiResponse) {
        throw new Error("No API test response available");
      }

      console.log("🧪 API Test Response:", apiResponse);
      return apiResponse.result || { rapidapi: false, google: false };
    } catch (error) {
      console.error("❌ API Test error:", error);
      return { rapidapi: false, google: false };
    }
  }

  // Helper method to clear window responses
  clearResponses() {
    delete (window as any).restaurantAPIResponse;
    delete (window as any).restaurantDetailsAPIResponse;
    delete (window as any).apiTestResponse;
  }
}

export const apiService = new APIService();
