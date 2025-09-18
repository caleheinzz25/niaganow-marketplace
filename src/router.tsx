import { createRouter as createTanstackSolidRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "./components/NotFound/NotFoundRoot";
import { createAuthContext } from "./context/authProviders";
import { AxiosError } from "axios";
import { QueryClient } from "@tanstack/solid-query";

export const clientQuery = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity     ,
    },
  }
});

export function createRouter() {
  const auth = createAuthContext();
  const router = createTanstackSolidRouter({
    defaultErrorComponent: (err) => <div>{err.error.stack}</div>,
    routeTree,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
    scrollRestoration: true,
    defaultNotFoundComponent: () => <NotFoundPage />,
    notFoundMode: "root",
    context: {
      ...auth,
      clientQuery,
    },
  });
  return router;
}

export const router = createRouter();

// Register things for typesafety
declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
    defaultError: AxiosError;
  }
  interface StaticDataRouteOption {
    appName?: string;
  }
}
