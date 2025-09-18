import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { get } from "lodash";
import { createEffect, createMemo, For, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import {
  ORDER_STATUS_TAGS,
  PAYMENT_STATUS_TAGS,
  getOrders,
} from "~/queryFn/fetchOrders";
import { Order } from "~/types/order";

export const Route = createFileRoute("/account/my-orders")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(getOrders(context.token() || ""));
  },
});

function RouteComponent() {
  const context = Route.useRouteContext()();

  const [orders, setOrders] = createStore<Order[]>([]);

  const queryOrders = useQuery(() => getOrders(context.token() || ""));

  createEffect(() => {
    if (queryOrders.isSuccess) {
      setOrders(queryOrders.data);
    }
  });
  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          {/* <!-- Header --> */}
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-800">My Orders</h1>
          </div>

          {/* <!-- Orders List --> */}
          <div
            class="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto py-2 px-1"
            id="orders-container"
          >
            <Switch>
              <Match when={queryOrders.isSuccess}>
                <For each={orders}>
                  {(order) => {
                    const statusTag = PAYMENT_STATUS_TAGS.find(
                      (s) => s.paymentStatus === order.status?.toUpperCase()
                    );

                    return (
                      <div
                        class="order-card fade-in bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 ease-in-out"
                        data-status={order.status}
                      >
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <div class="flex items-center">
                              <span
                                class={`inline-block px-2 py-1 text-xs font-semibold leading-tight rounded-full mr-3 ${
                                  statusTag?.colorClass ||
                                  "text-gray-700 bg-gray-100"
                                }`}
                              >
                                {statusTag?.label || order.status}
                              </span>
                              <span class="text-gray-500 text-sm">
                                Order #{order.id}
                              </span>
                            </div>
                            <p class="text-gray-500 text-sm mt-1">
                              Placed on{" "}
                              {new Date(
                                order.createdAt ?? ""
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Link
                            to="/order/details"
                            search={{
                              ref: order.referenceId || "",
                            }}
                            class="mt-3 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                          >
                            View Details
                          </Link>
                        </div>

                        <div class="border-t border-b border-gray-100 py-3 mb-4">
                          <div class="flex flex-col space-y-4">
                            <For each={order.items}>
                              {(item) => (
                                <div class="flex items-start space-x-4">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    class="w-20 h-20 object-cover rounded"
                                  />
                                  <div class="flex-1">
                                    <h3 class="font-medium text-gray-800">
                                      {item.productName}
                                    </h3>
                                    <p class="text-gray-500 text-sm mt-1">
                                      {item.quantity} item · $
                                      {item.price?.toFixed(2)}
                                    </p>
                                  </div>
                                  <div class="text-right">
                                    <p class="font-medium text-gray-800">
                                      ${item.subtotal?.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </For>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </Match>
              <Match when={queryOrders.isPending}>
                <BounceLoading />
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
}

// {
//   /* <!-- Filter tabs --> */
// }
// <div class="relative mt-4 md:mt-0">
//   <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
//     <button
//       class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none filter-btn active"
//       data-filter="all"
//     >
//       All Orders
//     </button>
//     <button
//       class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none filter-btn"
//       data-filter="completed"
//     >
//       Completed
//     </button>
//     <button
//       class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none filter-btn"
//       data-filter="processing"
//     >
//       Processing
//     </button>
//     <button
//       class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none filter-btn"
//       data-filter="cancelled"
//     >
//       Cancelled
//     </button>
//   </div>
// </div>;
