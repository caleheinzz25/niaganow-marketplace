import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/alerts")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const handleClick = () => {
    context.showAlert("success", "Berhasil menambahkan produk!");
  };

  return (
    <div class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <button
        class="px-4 py-2 bg-purple-600 text-white rounded-md"
        onClick={handleClick}
      >
        Tampilkan Alert
      </button>
    </div>
  );
}
