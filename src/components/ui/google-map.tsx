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
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement) => void;
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
  const [mapMarkers, setMapMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  useEffect(() => {
    if (ref.current && !map) {
      try {
        console.log("Creating Google Map...");
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

        console.log("Google Map created successfully");
      } catch (error) {
        console.error("Error creating Google Map:", error);
      }
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Handle markers
  useEffect(() => {
    if (!map) return;

    try {
      // Clear existing markers
      mapMarkers.forEach((marker) => (marker.map = null));
      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

      // Add new markers using AdvancedMarkerElement
      markers.forEach(({ position, title, icon }) => {
        // Create marker content
        const markerContent = document.createElement("div");
        markerContent.className = "marker-content";
        markerContent.innerHTML = `
          <div style="
            background: #3b82f6;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            white-space: nowrap;
          ">
            ${title || "📍"}
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map,
          title,
          content: markerContent,
        });

        if (onMarkerClick) {
          marker.addListener("click", () => onMarkerClick(marker));
        }

        newMarkers.push(marker);
      });

      setMapMarkers(newMarkers);
    } catch (error) {
      console.error("Error handling markers:", error);
    }
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
            <p className="text-xs text-muted-foreground">
              Check your API key and billing setup
            </p>
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <p>Common issues:</p>
              <ul className="text-left mt-1 space-y-1">
                <li>• API key restrictions don't include this domain</li>
                <li>• Maps JavaScript API not enabled</li>
                <li>• Billing not set up for the project</li>
                <li>• API key is invalid or expired</li>
              </ul>
            </div>
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

  // Debug logging for production troubleshooting
  console.log("Environment check:", {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    apiKeyPrefix: apiKey?.substring(0, 10) + "...",
    environment: import.meta.env.MODE,
    allEnvVars: Object.keys(import.meta.env).filter((key) =>
      key.includes("GOOGLE")
    ),
  });

  // Show fallback if no API key is provided
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    console.warn("Google Maps API key not found or invalid");
    return <MapFallback className={props.className} />;
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent {...props} />
    </Wrapper>
  );
};

export default GoogleMap;
