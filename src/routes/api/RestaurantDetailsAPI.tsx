import { useRestaurantDetailsAPI } from "@/hooks/api";

const RestaurantDetailsAPI = () => {
  const { restaurant, loading, error } = useRestaurantDetailsAPI();

  // Return data as JSON
  return (
    <div style={{ display: "none" }}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.restaurantDetailsAPIResponse = ${JSON.stringify({
              restaurant,
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

export default RestaurantDetailsAPI;
