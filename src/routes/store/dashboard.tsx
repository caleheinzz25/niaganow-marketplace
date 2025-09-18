import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { createMemo, For } from "solid-js";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import {
  getOrdersByStoreId,
  getOrdersByStoreIdLimit,
} from "~/queryFn/fetchOrders";
import { getProductsByStoreId } from "~/queryFn/fetchProducts";
import {  formatToRupiah } from "~/utils/Format";
import { OrderCard } from "./orders";

export const Route = createFileRoute("/store/dashboard")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getOrdersByStoreIdLimit(context.token() || "")
    );
    context.clientQuery.prefetchQuery(
      getProductsByStoreId(context.token() || "")
    );
  },
  pendingComponent: () => <BounceLoading></BounceLoading>,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const queryOrders = useQuery(() => getOrdersByStoreId(context.token() || ""));
  const queryProducts = useQuery(() =>
    getProductsByStoreId(context.token() || "")
  );

  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex-1 overflow-auto">
        {/* <!-- Mobile Header --> */}
        <div class="md:hidden flex items-center justify-between px-4 py-3 gradient-bg text-white">
          <button class="text-white focus:outline-none">
            <i class="fas fa-bars text-xl"></i>
          </button>
          <span class="text-xl font-bold">ShopHub Pro</span>
          <div class="flex items-center space-x-4">
            <i class="fas fa-bell"></i>
            <img
              class="h-8 w-8 rounded-full"
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
            />
          </div>
        </div>

        {/* <!-- Main Content Area --> */}
        <div class="p-4 md:p-8">
          {/* <!-- Header --> */}
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                Seller Dashboard
              </h1>
              <p class="text-gray-600">
                Welcome back, {context.username()} Your store is doing great.
              </p>
            </div>
          </div>

          {/* <!-- Dashboard Stats --> */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Revenue</p>
                  <h3 class="text-2xl font-bold mt-1">$12,845</h3>
                  <p class="text-green-600 text-sm mt-1 flex items-center">
                    <i class="fas fa-arrow-up mr-1"></i> 24.6%
                  </p>
                </div>
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i class="fas fa-dollar-sign text-xl"></i>
                </div>
              </div>
            </div> */}

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Orders</p>
                  <h3 class="text-2xl font-bold mt-1">{queryOrders.data?.length}</h3>
                </div>
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i class="fas fa-shopping-bag text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Products</p>
                  <h3 class="text-2xl font-bold mt-1">
                    {queryProducts.data?.length}
                  </h3>
                </div>
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <i class="fas fa-boxes text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Recent Products --> */}
          <div class="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Products</h2>
                <button class="text-purple-600 hover:text-purple-800 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <For each={queryProducts.data}>
                    {(product) => (
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img
                                class="h-10 w-10 rounded"
                                src={product.thumbnail}
                                alt="Wireless Earbuds"
                              />
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {product.title}
                              </div>
                              <div class="text-sm text-gray-500">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {formatToRupiah(product.price)}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {product.stock}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {product.enabled ? "Active" : "Disable"}
                          </span>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>

          {/* <!-- Recent Orders --> */}
          <div class="bg-white rounded-xl shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Orders</h2>
                <button class="text-purple-600 hover:text-purple-800 font-medium">
                  View All
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {/* <!-- Order 1 --> */}
                  <For each={queryOrders.data}>
                    {(order) => <OrderCard order={order} />}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
