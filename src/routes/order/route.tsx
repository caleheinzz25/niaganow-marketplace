import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
import { Basic } from "~/BreadCrumb/Basic";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { waitUntilWithRefresh } from "~/utils/waitUntil";

export const Route = createFileRoute("/order")({
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
  return (
    <>
      <Outlet />        
    </>
  );
}
