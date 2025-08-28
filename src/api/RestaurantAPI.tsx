import { useRestaurantAPI } from "@/hooks/api";

const RestaurantAPI = () => {
  const { restaurants, loading, error } = useRestaurantAPI();

  // Return data as JSON
  return (
    <div style={{ display: 'none' }}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.restaurantAPIResponse = ${JSON.stringify({
              restaurants,
              loading,
              error,
              timestamp: new Date().toISOString(),
            })};
          `,
        }}
      />
    </div>
  );
};

export default RestaurantAPI;
