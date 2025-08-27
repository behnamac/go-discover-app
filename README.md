# Go Discover App

A modern travel discovery application built with React, TypeScript, and Tailwind CSS.

## Features

- Interactive travel discovery interface
- Location-based recommendations
- Category-based exploration
- Modern UI with shadcn/ui components
- **Google Maps integration** with interactive markers
- Dark/Light mode toggle

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router (with v7 future flags enabled)
- Lucide React Icons
- **Google Maps React Wrapper**

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- **Google Maps API Key** (for map functionality)

### Google Maps Setup

1. **Get API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create a new project
2. **Enable Maps JavaScript API**: In your project, enable the "Maps JavaScript API"
3. **Create Credentials**: Create an API key for the Maps JavaScript API
4. **Create Map ID** (for Advanced Markers):
   - Go to [Google Cloud Console Maps Management](https://console.cloud.google.com/google/maps-apis/maps-management)
   - Click "Create Map ID"
   - Give it a name (e.g., "go-discover-app-map")
   - Copy the Map ID (format: `map_id_1234567890abcdef`)
5. **Environment Setup**: Create a `.env` file in the root directory:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   VITE_GOOGLE_MAPS_MAP_ID=your_map_id_here
   ```

**Note**: The app will work with just Google Places API. RapidAPI is optional for additional data sources.

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd go-discover-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up your API keys (see above)

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:8083`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # UI components including GoogleMap
│   ├── Home/      # Home page components
│   └── Layout/    # Layout components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/      # API services
├── contexts/      # React contexts
├── lib/           # Utility functions
└── assets/        # Static assets
```

## Features

### Map Features

- **Interactive Google Maps**: Real-time map with markers
- **Location Markers**: Clickable markers for nearby places
- **Responsive Design**: Maps adapt to different screen sizes
- **Custom Styling**: Clean, modern map appearance
- **Marker Interactions**: Click handlers for place details

### Restaurant Features

- **Zoom-based Loading**: Restaurants load when zoomed to level 14+
- **Real-time Data**: Fetches restaurants from Google Places API
- **Location-aware**: Shows restaurants near user's location
- **Debounced Search**: Efficient API calls with debouncing
- **Fallback Data**: Mock data when API is unavailable

### Animation Features

- **GSAP Animations**: Smooth entrance and interaction animations
- **Scroll-triggered**: Animations activate on scroll
- **Hover Effects**: Interactive card and button animations
- **Loading States**: Animated loading indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
