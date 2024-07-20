"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider as Provider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function SessionProvider({ children }: Props) {
  const queryClient = new QueryClient();
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
