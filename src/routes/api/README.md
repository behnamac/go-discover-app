# API Routes Structure

This folder contains React Router API route components that act as internal API endpoints.

## Purpose

These components are used to proxy external API calls and expose results via the `window` object, avoiding CORS issues and providing a clean interface for the frontend.

## Files

- **`RestaurantAPI.tsx`** - Handles restaurant search API calls
- **`RestaurantDetailsAPI.tsx`** - Handles restaurant details API calls
- **`APITestRoute.tsx`** - Tests API connectivity

## Usage

These routes are mounted under `/api/*` paths in the main App.tsx and are accessed through the `apiService` in `src/services/apiService.ts`.

## Architecture

```
Frontend Components → apiService → React Router API Routes → External APIs
```

The API routes make external API calls and store results in `window.*` objects, which are then read by the `apiService`.
