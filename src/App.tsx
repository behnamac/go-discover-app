import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocationProvider } from "@/contexts/LocationContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import RestaurantAPI from "./routes/api/RestaurantAPI";
import RestaurantDetailsAPI from "./routes/api/RestaurantDetailsAPI";
import APITestRoute from "./routes/api/APITestRoute";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />

              {/* API Routes */}
              <Route
                path="/api/restaurants/search"
                element={<RestaurantAPI />}
              />
              <Route
                path="/api/restaurants/:id"
                element={<RestaurantDetailsAPI />}
              />
              <Route path="/api/test" element={<APITestRoute />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocationProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
