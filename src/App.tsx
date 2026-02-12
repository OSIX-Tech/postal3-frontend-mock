import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { query_client } from "@/lib/query-client";
import { router } from "@/router";

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="testsoposiciones-theme">
      <QueryClientProvider client={query_client}>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
