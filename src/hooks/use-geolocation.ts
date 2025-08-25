import { useState, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface GeolocationState {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: false,
    error: null,
  });

  const getCurrentLocation = async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
      }));
      return null;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setState({
        location,
        isLoading: false,
        error: null,
      });

      return location;
    } catch (err) {
      let errorMessage = "Failed to get location. Please try again.";

      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while getting location.";
        }
      }

      setState({
        location: null,
        isLoading: false,
        error: errorMessage,
      });

      return null;
    }
  };

  const clearLocation = () => {
    setState({
      location: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    getCurrentLocation,
    clearLocation,
  };
};
