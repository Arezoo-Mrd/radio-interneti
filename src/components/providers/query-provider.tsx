"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
 // Create a new QueryClient instance for each session
 // This ensures that data is not shared between users and requests
 const [queryClient] = useState(
  () =>
   new QueryClient({
    defaultOptions: {
     queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
     },
    },
   })
 );

 return (
  <QueryClientProvider client={queryClient}>
   {children}
   <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
 );
}
