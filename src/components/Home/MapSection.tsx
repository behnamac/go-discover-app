import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GoogleMap from "@/components/ui/google-map";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Navigation,
  Layers,
} from "lucide-react";

const MapSection = () => {
  // Mock nearby places data
  const nearbyPlaces = [
    {
      id: 1,
      name: "Coastal Breeze Restaurant",
      category: "Restaurant",
      rating: 4.8,
      distance: "0.3 km",
      price: "$$",
      image: "🏖️",
      description: "Fresh seafood with ocean views",
      position: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: "Sunset Beach",
      category: "Beach",
      rating: 4.9,
      distance: "0.8 km",
      price: "Free",
      image: "🏖️",
      description: "Crystal clear waters and white sand",
      position: { lat: 40.7089, lng: -74.009 },
    },
    {
      id: 3,
      name: "Vista Hotel",
      category: "Hotel",
      rating: 4.6,
      distance: "1.2 km",
      price: "$$$",
      image: "🏨",
      description: "Luxury accommodation with panoramic views",
      position: { lat: 40.7168, lng: -74.003 },
    },
  ];

  // Convert places to map markers
  const mapMarkers = nearbyPlaces.map((place) => ({
    position: place.position,
    title: place.name,
  }));

  const handleMarkerClick = (marker: google.maps.Marker) => {
    console.log("Marker clicked:", marker.getTitle());
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">
                Explore Your
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {" "}
                  Area
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Interactive map with real-time location and nearby
                recommendations
              </p>
            </div>

            {/* Map Container */}
            <Card className="relative h-96 border-border/40 overflow-hidden">
              <GoogleMap
                center={{ lat: 40.7128, lng: -74.006 }}
                zoom={14}
                markers={mapMarkers}
                onMarkerClick={handleMarkerClick}
                className="w-full h-full"
              />

              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button variant="glass" size="icon">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button variant="glass" size="icon">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-cta"></div>
                <span>Recommendations</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span>Popular Spots</span>
              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Nearby Places</h3>
              <p className="text-muted-foreground">
                Discover what's around you right now
              </p>
            </div>

            <div className="space-y-4">
              {nearbyPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="hover:shadow-card transition-smooth cursor-pointer border-border/40"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{place.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {place.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {place.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {place.category}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{place.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{place.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{place.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              View All Nearby Places
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
