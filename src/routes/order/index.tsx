import { createFileRoute, redirect } from "@tanstack/solid-router";
import { BounceLoading } from "~/components/Loading/BounceLoading";

export const Route = createFileRoute("/order/")({
  beforeLoad: ({}) => {
    redirect({ to: "/order/cart" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <BounceLoading />;
}
