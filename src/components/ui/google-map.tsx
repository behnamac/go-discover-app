import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  mapId?: string;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (marker: any) => void;
}

const MapComponent = ({
  center = { lat: 40.7128, lng: -74.006 }, // Default to NYC
  zoom = 13,
  className = "",
  mapId = "DEMO_MAP_ID",
  markers = [],
  onMapClick,
  onMarkerClick,
}: GoogleMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      try {
        console.log("Creating Google Map...");
        const newMap = new google.maps.Map(ref.current, {
          center,
          zoom,
          mapId, // Use the mapId prop
          // Only add styles if not using a Map ID (Map ID controls styles via cloud console)
          ...(mapId === "DEMO_MAP_ID" && {
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }),
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
      mapMarkers.forEach((marker) => {
        if (marker.map) {
          marker.map = null;
        }
      });

      const newMarkers: any[] = [];

      // Add new markers with fallback support
      markers.forEach(({ position, title, icon }) => {
        let marker: any;

        // Check if AdvancedMarkerElement is available and properly loaded
        const isAdvancedMarkerAvailable =
          google.maps.marker &&
          google.maps.marker.AdvancedMarkerElement &&
          typeof google.maps.marker.AdvancedMarkerElement === "function";

        if (isAdvancedMarkerAvailable) {
          try {
            // Create marker content for AdvancedMarkerElement
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

            marker = new google.maps.marker.AdvancedMarkerElement({
              position,
              map,
              title,
              content: markerContent,
            });
          } catch (advancedError) {
            console.warn(
              "AdvancedMarkerElement failed, falling back to traditional Marker:",
              advancedError
            );
            // Fall through to traditional marker
          }
        }

        // Use traditional Marker if AdvancedMarkerElement failed or isn't available
        if (!marker) {
          marker = new google.maps.Marker({
            position,
            map,
            title,
            label: title || "📍",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
                  </svg>
                `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12),
            },
          });
        }

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
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

  // Show fallback if no API key is provided
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    console.warn("Google Maps API key not found or invalid");
    return <MapFallback className={props.className} />;
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["marker"]}>
      <MapComponent {...props} mapId={mapId} />
    </Wrapper>
  );
};

export default GoogleMap;
