import { useAPITest } from "@/hooks/api";

const APITestRoute = () => {
  const { testResult, loading } = useAPITest();

  // Return data as JSON
  return (
    <div style={{ display: 'none' }}>
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
