import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Heart,
  Crown,
  Utensils,
  Bed,
  Camera,
  Navigation,
} from "lucide-react";

const SearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("restaurants");

  const categories = [
    { id: "restaurants", name: "Restaurants", icon: Utensils },
    { id: "hotels", name: "Hotels", icon: Bed },
    { id: "attractions", name: "Attractions", icon: Camera },
  ];

  const nearbyPlaces = [
    {
      id: 1,
      name: "Katz's Delicatessen",
      rating: 4.5,
      reviews: 2891,
      image: "IMG",
    },
    {
      id: 2,
      name: "Joe's Pizza",
      rating: 5,
      reviews: 1456,
      image: "IMG",
    },
    {
      id: 3,
      name: "Peter Luger",
      rating: 4.5,
      reviews: 987,
      image: "IMG",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-hero">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Travel Advisor
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="New York, NY, USA"
                className="pl-10 bg-background/50 border-border/40 focus:border-primary/40 transition-smooth"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button variant="hero" className="hidden md:flex">
            Explore new places
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Place Details */}
        <div className="w-1/3 border-r border-border/40 p-6 overflow-y-auto">
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-6">
            <span className="text-muted-foreground">
              Sushi Restaurant Interior
            </span>
          </div>

          {/* Restaurant Name */}
          <h1 className="text-2xl font-bold mb-4">Blue Ribbon Sushi</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">(1,247 reviews)</span>
          </div>

          {/* Price Range & Cuisine */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-muted-foreground">$$$$</span>
            <span className="text-muted-foreground">Japanese, Sushi</span>
          </div>

          {/* Ranking */}
          <div className="mb-4">
            <span className="text-muted-foreground">Ranking</span>
            <p className="font-medium">#12 of 8,456 restaurants in NYC</p>
          </div>

          {/* Badges */}
          <div className="flex space-x-2 mb-6">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Crown className="h-3 w-3" />
              <span>Top Rated</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Utensils className="h-3 w-3" />
              <span>Best Sushi 2025</span>
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Open until 11:00 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>(212) 274-0404</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>97 Sullivan St, New York</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="hero" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Map and Nearby Places */}
        <div className="flex-1 relative">
          {/* Interactive Map */}
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto">
                <Navigation className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Interactive Google Maps View
                </h3>
                <p className="text-muted-foreground">
                  Map integration coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Nearby Restaurants Card */}
          <div className="absolute top-4 right-4 w-80">
            <Card className="bg-background/95 backdrop-blur">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Nearby Restaurants</h3>
                <div className="space-y-3">
                  {nearbyPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        {place.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {place.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(place.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : i < place.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({place.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter Buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "hero" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
