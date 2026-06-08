"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryProvider = ({ children }) => {
  const [queryClient] = React.useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          // staleTime: 1000 * 60 * 5, // 5 minutes
          // gcTime: 1000 * 60 * 10, // 10 minutes
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          staleTime: Infinity,
          retry: 1,
        },
      },
    }
  ));
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
