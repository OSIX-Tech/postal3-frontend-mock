import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";

const create_test_query_client = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const query_client = create_test_query_client();

  return (
    <QueryClientProvider client={query_client}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

const custom_render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { custom_render as render };
