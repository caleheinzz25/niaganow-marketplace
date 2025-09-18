import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { getOrdersByStoreId, ORDER_STATUS_TAGS } from "~/queryFn/fetchOrders";
import { Order } from "~/types/order";
import { dateFormat, formatToRupiah } from "~/utils/Format";

export const Route = createFileRoute("/store/orders")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getOrdersByStoreId(context.token() || "")
    );
  },
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [orders, setOrders] = createStore<Order[]>([]);
  const queryOrders = useQuery(() => getOrdersByStoreId(context.token() || ""));

  const totalOrders = createMemo(() => orders.length);
  const totalRevenue = createMemo(() =>
    orders
      .filter(
        (order) =>
          order.status === "PAID" ||
          order.status === "DELIVERED" ||
          order.status === "PROCESSING" ||
          order.status === "REQUIRES_ACTION"
      )
      .reduce((acc, order) => acc + (order.totalAmount ?? 0), 0)
  );
  const avgOrderValue = createMemo(() => {
    const count = orders.length;
    return count > 0 ? totalRevenue() / count : 0;
  });
  const orderFilter = createMemo(() => {
    return orders.reduce<Record<Order["status"] | "ALL", Order[]>>(
      (acc, order) => {
        const status = order.status ?? "PENDING_PAYMENT";

        // Jika belum ada array-nya, inisialisasi
        if (!acc[status]) acc[status] = [];
        acc[status].push(order);

        // Simpan juga ke "ALL"
        acc.ALL.push(order);

        return acc;
      },
      {
        PENDING_PAYMENT: [],
        REQUIRES_ACTION: [],
        PAID: [],
        FAILED_PAYMENT: [],
        CANCELED: [],
        PROCESSING: [],
        SHIPPED: [],
        EXPIRED: [],
        DELIVERED: [],
        ALL: [],
      }
    );
  });
  const [selectedStatus, setSelectedStatus] =
    createSignal<keyof ReturnType<typeof orderFilter>>("ALL");

  createEffect(() => {
    if (queryOrders.isSuccess) {
      setOrders(queryOrders.data);
      console.log("Orders fetched:", queryOrders.data);
    }
  });
  const totalSuccessTransactions = createMemo(() => {
    return orders.filter(
      (order) => order.status === "SUCCEEDED"
    ).length;
  });
  return (
    <>
      {/* <!-- Main Content --> */}
      <main class="px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* <!-- Filters and Actions --> */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div class="flex space-x-2 print:hidden">
            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onInput={(e) =>
                  setSelectedStatus(
                    e.currentTarget.value as keyof ReturnType<
                      typeof orderFilter
                    >
                  )
                }
              >
                <option value={"ALL"}>All Status</option>
                <For each={ORDER_STATUS_TAGS}>
                  {(stat) => (
                    <option value={stat.orderStatus}>{stat.label}</option>
                  )}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              class="flex items-center space-x-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
              onclick={() => window.print()}
            >
              <i class="fas fa-file-export"></i>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* <!-- Stats Overview --> */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* <!-- Total Orders --> */}
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm print:text-xs font-medium text-gray-500">
                  Total Orders
                </p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                  {totalOrders()}
                </h3>
              </div>
              <div class="bg-blue-100 p-3 rounded-full">
                <i class="fas fa-shopping-cart text-blue-600"></i>
              </div>
            </div>
          </div>
          {/* <!-- Revenue --> */}
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm print:text-xs font-medium text-gray-500">
                  Revenue
                </p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                  {formatToRupiah(totalRevenue())}
                </h3>
              </div>
              <div class="bg-green-100 p-3 rounded-full">
                <i class="fas fa-dollar-sign text-green-600"></i>
              </div>
            </div>
          </div>
          {/* <!-- Average Order Value --> */}
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm print:text-xs font-medium text-gray-500">
                  Avg. Order Value
                </p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                  {formatToRupiah(avgOrderValue())}
                </h3>
              </div>
              <div class="bg-purple-100 p-3 rounded-full">
                <i class="fas fa-chart-line text-purple-600"></i>
              </div>
            </div>
          </div>
          {/* <!-- Total Success --> */}
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Success</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                  {totalSuccessTransactions()}
                </h3>
              </div>
              <div class="bg-yellow-100 p-3 rounded-full">
                <i class="fas fa-check-circle text-yellow-600"></i>
              </div>
            </div>
          </div>{" "}
        </div>

        {/* <!-- Orders List --> */}
        <div>
          <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {/* <!-- Order 1 --> */}
                <For each={orderFilter()[selectedStatus()]}>
                  {(order) => <OrderCard order={order} />}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export const OrderCard = ({ order }: { order: Order }) => {
  const orderStatus = createMemo(() =>
    ORDER_STATUS_TAGS.find((tag) => tag.orderStatus === order.status)
  );

  return (
    <>
      <tr class="hover:bg-gray-50 cursor-pointer">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm print:text-xs font-medium text-blue-600">
            #{order.referenceId}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img
                class="h-10 w-10 rounded-full"
                src={order.userImage}
                alt=""
              />
            </div>
            <div class="ml-4">
              <div class="text-sm print:text-xs font-medium text-gray-900">
                {order.userFullName}
              </div>
              <div class="text-sm print:text-xs text-gray-500">
                {order.userEmail}
              </div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm print:text-xs text-gray-900">
            {dateFormat(order.createdAt)}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm print:text-xs text-gray-900">
            {formatToRupiah(order.totalAmount)}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span
            class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${orderStatus()?.colorClass}`}
          >
            {orderStatus()?.label}
          </span>
        </td>
      </tr>
    </>
  );
};

const RecentActivity = () => {
  return (
    <>
      {/* <!-- Recent Activity --> */}
      <div class="mt-8 print:text-xs">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div class="space-y-4">
            {/* <!-- Activity Item 1 --> */}
            <div class="flex">
              <div class="flex-shrink-0 mr-3">
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="fas fa-shipping-fast text-blue-500 text-sm print:text-xs"></i>
                </div>
              </div>
              <div class="flex-1 border-b border-gray-200 pb-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm print:text-xs font-medium text-gray-800">
                    Order #ORD-8764 has been shipped
                  </p>
                  <span class="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p class="text-sm print:text-xs text-gray-500 mt-1">
                  Tracking number: XYZ123456789
                </p>
              </div>
            </div>

            {/* <!-- Activity Item 2 --> */}
            <div class="flex">
              <div class="flex-shrink-0 mr-3">
                <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="fas fa-check-circle text-green-500 text-sm print:text-xs"></i>
                </div>
              </div>
              <div class="flex-1 border-b border-gray-200 pb-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm print:text-xs font-medium text-gray-800">
                    Payment received for Order #ORD-8765
                  </p>
                  <span class="text-xs text-gray-500">5 hours ago</span>
                </div>
                <p class="text-sm print:text-xs text-gray-500 mt-1">
                  Amount: $125.99 via Credit Card
                </p>
              </div>
            </div>

            {/* <!-- Activity Item 3 --> */}
            <div class="flex">
              <div class="flex-shrink-0 mr-3">
                <div class="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="fas fa-exclamation-circle text-yellow-500 text-sm print:text-xs"></i>
                </div>
              </div>
              <div class="flex-1 border-b border-gray-200 pb-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm print:text-xs font-medium text-gray-800">
                    Order #ORD-8761 cancelled by customer
                  </p>
                  <span class="text-xs text-gray-500">1 day ago</span>
                </div>
                <p class="text-sm print:text-xs text-gray-500 mt-1">
                  Refund processed successfully
                </p>
              </div>
            </div>

            {/* <!-- Activity Item 4 --> */}
            <div class="flex">
              <div class="flex-shrink-0 mr-3">
                <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <i class="fas fa-truck text-purple-500 text-sm print:text-xs"></i>
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm print:text-xs font-medium text-gray-800">
                    New order #ORD-8766 received
                  </p>
                  <span class="text-xs text-gray-500">1 day ago</span>
                </div>
                <p class="text-sm print:text-xs text-gray-500 mt-1">
                  Customer: James Wilson, Total: $210.50
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
