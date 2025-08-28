import { useState, useEffect } from "react";

interface APITestResult {
  rapidapi: boolean;
  google: boolean;
  timestamp: string;
}

const APITestRoute = () => {
  const [testResult, setTestResult] = useState<APITestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testAPIConnectivity = async () => {
    setLoading(true);

    try {
      const results: APITestResult = {
        rapidapi: false,
        google: false,
        timestamp: new Date().toISOString(),
      };

      // Test RapidAPI
      try {
        const rapidApiUrl = new URL(
          "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng"
        );
        rapidApiUrl.searchParams.append("latitude", "40.7128");
        rapidApiUrl.searchParams.append("longitude", "-74.006");
        rapidApiUrl.searchParams.append("limit", "1");
        rapidApiUrl.searchParams.append("currency", "USD");
        rapidApiUrl.searchParams.append("distance", "1");
        rapidApiUrl.searchParams.append("open_now", "false");
        rapidApiUrl.searchParams.append("lunit", "km");
        rapidApiUrl.searchParams.append("lang", "en_US");

        const rapidApiResponse = await fetch(rapidApiUrl.toString(), {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        });

        if (rapidApiResponse.ok) {
          const data = await rapidApiResponse.json();
          results.rapidapi = !!(data.data && Array.isArray(data.data));
        }
      } catch (error) {
        console.error("RapidAPI test failed:", error);
        results.rapidapi = false;
      }

      // Test Google Places API (will fail due to CORS, but we test the endpoint)
      try {
        const googleUrl = new URL(
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        );
        googleUrl.searchParams.append("location", "40.7128,-74.006");
        googleUrl.searchParams.append("radius", "1000");
        googleUrl.searchParams.append("type", "restaurant");
        googleUrl.searchParams.append(
          "key",
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
        );

        const googleResponse = await fetch(googleUrl.toString());
        // This will likely fail due to CORS, but we can detect if the API key is valid
        results.google = googleResponse.status !== 403; // 403 means forbidden, not CORS
      } catch (error) {
        console.error("Google Places API test failed:", error);
        results.google = false;
      }

      setTestResult(results);
    } catch (error) {
      console.error("API connectivity test failed:", error);
      setTestResult({
        rapidapi: false,
        google: false,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Run test on mount
  useEffect(() => {
    testAPIConnectivity();
  }, []);

  // Return data as JSON
  return (
    <div style={{ display: "none" }}>
      {loading && <div>Testing APIs...</div>}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.apiTestResponse = ${JSON.stringify({
              result: testResult,
              loading,
              timestamp: new Date().toISOString(),
            })};
          `,
        }}
      />
    </div>
  );
};

export default APITestRoute;
