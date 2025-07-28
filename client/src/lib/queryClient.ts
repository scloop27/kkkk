import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }

  return response.json();
}

// Default fetcher for react-query
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey }) => {
      const [url] = queryKey as [string];
      return apiRequest(url);
    },
  },
});