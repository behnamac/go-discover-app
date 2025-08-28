import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface RestaurantDetails {
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
  address: string;
  phone: string;
  website: string;
  hours: string;
  cuisine: string[];
  amenities: string[];
  photos: string[];
}

export const useRestaurantDetailsAPI = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRestaurantDetails = async (restaurantId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call RapidAPI for restaurant details
      const url = new URL('https://travel-advisor.p.rapidapi.com/restaurants/v2/get-details');
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
        },
        body: JSON.stringify({
          locationId: restaurantId,
          currency: 'USD',
          lang: 'en_US',
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error('No restaurant details returned from API');
      }

      const place = data.data;

      const restaurantDetails: RestaurantDetails = {
        id: place.locationId || place.location_id || restaurantId,
        name: place.name || "Restaurant",
        rating: place.rating || 0,
        reviews: place.numReviews || place.num_reviews || 0,
        price: place.priceLevel || place.price_level || "$$",
        category: place.cuisine?.[0]?.name || place.category || "Restaurant",
        image: place.photo?.images?.medium?.url ||
               place.photo?.images?.small?.url ||
               "🍽️",
        description: place.description ||
                    place.shortDescription ||
                    "Restaurant description",
        position: {
          lat: parseFloat(place.latitude || place.lat) || 0,
          lng: parseFloat(place.longitude || place.lng) || 0,
        },
        address: place.addressString ||
                 place.address_string ||
                 place.address ||
                 "Address not available",
        phone: place.phone || place.phoneNumber || "Phone not available",
        website: place.website || place.url || "Website not available",
        hours: place.openNowText ||
               place.open_now_text ||
               place.hours ||
               "Hours not available",
        cuisine: place.cuisine?.map((c: any) => c.name) || [],
        amenities: place.amenities || [],
        photos: place.photo?.images?.large?.url ? [place.photo.images.large.url] : [],
      };

      setRestaurant(restaurantDetails);
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant details');
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details when ID changes
  useEffect(() => {
    if (id) {
      getRestaurantDetails(id);
    }
  }, [id]);

  return {
    restaurant,
    loading,
    error,
    getRestaurantDetails,
  };
};
