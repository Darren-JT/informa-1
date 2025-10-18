"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function RootLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="en">
      <head>
        <title>Crime Awareness Platform</title>
        <meta
          name="description"
          content="Community crime awareness and reporting platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
