# API Hooks Structure

This folder contains custom React hooks for API functionality.

## Purpose

These hooks encapsulate API logic and state management, providing a clean interface for components to interact with APIs.

## Files

- **`useRestaurantAPI.ts`** - Hook for restaurant search functionality
- **`useRestaurantDetailsAPI.ts`** - Hook for restaurant details functionality
- **`useAPITest.ts`** - Hook for API connectivity testing

## Usage

These hooks are used by the React Router API route components in `src/routes/api/` to manage state and API calls.

## Architecture

```
API Route Components → API Hooks → External APIs
```

The hooks handle:

- State management (loading, error, data)
- API call logic
- Data processing and transformation
- Error handling
