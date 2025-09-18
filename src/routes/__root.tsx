import {
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
  useMatches,
  HeadContent,
  useChildMatches,
  MatchRoute,
  useLoaderData,
  useRouterState,
} from "@tanstack/solid-router";
import { Navbar } from "~/components/Navbar";
import { For, Suspense, children, lazy } from "solid-js";
import type { AuthContextTypeRoot } from "~/types/auth";
import { FloatingChat } from "~/components/Chat/FloatingChat";
import { Search } from "lucide-solid";
import { Portal } from "solid-js/web";
import { AlertItem } from "~/components/alert/Alerts";

const RouterDevtools = lazy(() => import("../components/Devtools/Router"));
const QueryDevTools = lazy(() => import("../components/Devtools/Query"));
export const Route = createRootRouteWithContext<AuthContextTypeRoot>()({
  staticData: {
    appName: "NiagaNow",
  },
  component: RootComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Belanja murah dan aman di NiagaNow",
      },
      {
        name: "og:type",
        content: "website",
      },
      {
        title: "NiagaNow",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      },
    ],
  }),
});

function RootComponent() {
  const matches = useMatches()();
  const { location } = useRouterState()();

  return (
    <>
      <HeadContent />
      <Navbar appName={matches[0].staticData.appName} />
      <div class="h-[6vh] print:hidden"></div>
      <Portal>
        <div class="fixed top-4 right-4 w-full max-w-md space-y-3 z-50">
          <For each={matches[0].context.alerts()}>
            {(alert) => (
              <AlertItem
                {...alert}
                onClose={() => matches[0].context.removeAlert(alert.id)}
              />
            )}
          </For>
        </div>
      </Portal>
      {/* <MatchRoute to="/shop">
        <div>Hello World</div>
      </MatchRoute> */}
      <div>{location.pathname}</div>
      <Suspense>
        <Outlet />
        <FloatingChat context={matches[0].context} />
      </Suspense>
    </>
  );
}
