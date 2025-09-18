import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createEffect, createMemo, For } from "solid-js";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import {
  getOrdersByStoreId,
  getOrdersByStoreIdLimit,
} from "~/queryFn/fetchOrders";
import { getProductsByStoreId } from "~/queryFn/fetchProducts";
import { formatToRupiah } from "~/utils/Format";
import { OrderCard } from "~/routes/store/orders";
import {
  getProductsQueryOptions,
  getStores,
  getStoresQueryOptions,
  getTransactionsQueryOptions,
  getUsers,
  getUsersQueryOptions,
} from "~/queryFn/fetchAdmin";
import { TransactionCard } from "~/components/Card/TransactionCard";
import ProductCard1 from "~/components/Card/ProductCard";
import { UserRow } from "~/components/Card/UserCard";
import { StoreRow } from "~/components/Card/StoreCard";
export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getStoresQueryOptions(context.token() || "")
    );
    context.clientQuery.prefetchQuery(
      getUsersQueryOptions(context.token() || "")
    );
    context.clientQuery.prefetchQuery(
      getProductsQueryOptions(context.token() || "")
    );
    context.clientQuery.prefetchQuery(
      getProductsQueryOptions(context.token() || "")
    );
    context.clientQuery.prefetchQuery(
      getTransactionsQueryOptions(context.token() || "")
    );
  },
  pendingComponent: () => <BounceLoading></BounceLoading>,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const queryTransactions = useQuery(() =>
    getTransactionsQueryOptions(context.token() || "")
  );
  const queryProducts = useQuery(() =>
    getProductsQueryOptions(context.token() || "")
  );
  const queryStores = useQuery(() =>
    getStoresQueryOptions(context.token() || "")
  );
  const queryUsers = useQuery(() =>
    getUsersQueryOptions(context.token() || "")
  );
  createEffect(() => {
    console.log(queryStores.data);
  });
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
                Admin Dashboard
              </h1>
              <p class="text-gray-600">Welcome back, {context.username()}.</p>
            </div>
          </div>

          {/* <!-- Dashboard Stats --> */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Transactions</p>
                  <h3 class="text-2xl font-bold mt-1">
                    {queryTransactions.data?.length}
                  </h3>
                </div>
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i class="fas fa-shopping-bag text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Stores</p>
                  <h3 class="text-2xl font-bold mt-1">
                    {queryStores.data?.length}
                  </h3>
                </div>
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i class="fas fa-store text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Users</p>
                  <h3 class="text-2xl font-bold mt-1">
                    {queryUsers.data?.length}
                  </h3>
                </div>
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i class="fas fa-users text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Recent Products --> */}
          <div class="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Products</h2>
                <Link
                  to="/admin/products"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </Link>
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
                  <For each={queryProducts.data?.slice(0, 5)}>
                    {(product) => <ProductCard1 product={product} />}
                  </For>
                </tbody>
              </table>
            </div>
          </div>

          {/* <!-- Recent Orders --> */}
          <div class="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Transactions</h2>
                <Link
                  to="/admin/transactions"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
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
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {/* <!-- Order 1 --> */}
                  <For each={queryTransactions.data?.slice(0, 5)}>
                    {(transaction) => (
                      <TransactionCard transaction={transaction} />
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Users</h2>
                <Link
                  to="/admin/users"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <For each={queryUsers.data?.slice(0, 5)}>
                    {(user) => <UserRow user={user} />}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow overflow-hidden">
            {/* Header Section */}
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Stores</h2>
                <Link
                  to="/admin/stores"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Table Section */}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody class="bg-white divide-y divide-gray-200">
                  <For each={queryStores.data?.slice(0, 5)}>
                    {(store) => <StoreRow store={store} />}
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
