import { useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/solid-router";
import { Show } from "solid-js";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { SideBarProfile } from "~/components/Navbar/SideBarProfile";
import { getProfile } from "~/queryFn/postAuthUser";
import { waitUntilWithRefresh } from "~/utils/waitUntil";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const isReady = await waitUntilWithRefresh(
      () => context.token() !== null,
      context.refresh // ← harus dipastikan hanya 1x dijalankan
    );

    if (!isReady) {
      throw redirect({ to: "/auth/login" });
    }
  },

  pendingComponent: () => <BounceLoading />,
  pendingMs: 200,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const queryProfile = useQuery(() => getProfile());
  return (
    <>
      <div class="w-full h-full min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col md:flex-row gap-8">
            <Show when={queryProfile.isSuccess}>
              <SideBarProfile fullName={queryProfile.data?.profile.fullName} role={context.role()}/>
            </Show>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
