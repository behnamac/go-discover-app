import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (marker: google.maps.Marker) => void;
}

const MapComponent = ({
  center = { lat: 40.7128, lng: -74.006 }, // Default to NYC
  zoom = 13,
  className = "",
  markers = [],
  onMapClick,
  onMarkerClick,
}: GoogleMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(newMap);

      // Add click listener
      if (onMapClick) {
        newMap.addListener("click", onMapClick);
      }
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Handle markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach(({ position, title, icon }) => {
      const marker = new google.maps.Marker({
        position,
        map,
        title,
        icon: icon || undefined,
      });

      if (onMarkerClick) {
        marker.addListener("click", () => onMarkerClick(marker));
      }

      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);
  }, [map, markers, onMarkerClick]);

  return <div ref={ref} className={className} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto animate-pulse">
              <div className="w-8 h-8 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center mx-auto">
              <div className="text-destructive-foreground text-2xl">!</div>
            </div>
            <p className="text-muted-foreground">Failed to load map</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

// Fallback component when no API key is provided
const MapFallback = ({ className }: { className?: string }) => (
  <div className={`${className} bg-muted flex items-center justify-center`}>
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto">
        <MapPin className="h-8 w-8 text-primary-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Google Maps Integration</h3>
        <p className="text-muted-foreground max-w-sm">
          Add your Google Maps API key to enable interactive maps
        </p>
        <div className="text-xs text-muted-foreground">
          Create a .env file with: VITE_GOOGLE_MAPS_API_KEY=your_key_here
        </div>
      </div>
    </div>
  </div>
);

const GoogleMap = (props: GoogleMapProps) => {
  // Use Vite's import.meta.env instead of process.env
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Show fallback if no API key is provided
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return <MapFallback className={props.className} />;
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent {...props} />
    </Wrapper>
  );
};

export default GoogleMap;
