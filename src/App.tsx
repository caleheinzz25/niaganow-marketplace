import { clientQuery, router } from "./router";
import { RouterProvider } from "@tanstack/solid-router";
import { QueryClientProvider } from "@tanstack/solid-query";

export default function App() {
  return (
    <QueryClientProvider client={clientQuery}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
