    import { useQuery } from "@tanstack/solid-query";
    import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
    import { BounceLoading } from "~/components/Loading/BounceLoading";
    import { SideBarStore, SideBarStore1 } from "~/components/Navbar/SideBarStore";
    import { getStoreUSer } from "~/queryFn/postAuthUser";
    import { waitUntilWithRefresh } from "~/utils/waitUntil";

    export const Route = createFileRoute("/admin")({
      component: RouteComponent,
      beforeLoad: async ({ context }) => {
        const isReady = await waitUntilWithRefresh(
          () => context.role() !== null,
          context.refresh
        );
        console.log(context.role());
        if (!isReady || context.role() !== "ADMIN" && context.role() !== "SUPER_ADMIN") {
          throw redirect({ to: "/" });
        }
      },
      pendingComponent: () => <BounceLoading />,
    });

    function RouteComponent() {
      const context = Route.useRouteContext();
      return (
        <>
          {/* <!-- Main Container --> */}
          <div class="flex h-screen-fit overflow-hidden">
            <SideBarStore1 role={context().role()} storeName={undefined} />
            <Outlet />
          </div>
        </>
      );
    }
