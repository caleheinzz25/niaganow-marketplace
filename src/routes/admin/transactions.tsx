import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { TransactionCard } from "~/components/Card/TransactionCard";
import { getTransactionsQueryOptions } from "~/queryFn/fetchAdmin";
import { getOrdersByStoreId, ORDER_STATUS_TAGS } from "~/queryFn/fetchOrders";
import { Order, Transaction, TRANSACTION_STATUS_TAGS } from "~/types/order";
import { dateFormat, formatToRupiah } from "~/utils/Format";
export const Route = createFileRoute("/admin/transactions")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getTransactionsQueryOptions(context.token() || "")
    );
  },
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [transactions, setTransactions] = createStore<Transaction[]>([]);
  const queryTransactions = useQuery(() =>
    getTransactionsQueryOptions(context.token() || "")
  );

  const totalTransactions = createMemo(() => transactions.length);
  const totalRevenue = createMemo(() =>
    transactions
      .filter((transaction) => transaction.status === "SUCCEEDED")
      .reduce((acc, order) => acc + (order.totalAmount ?? 0), 0)
  );
  const avgOrderValue = createMemo(() => {
    const count = transactions.length;
    return count > 0 ? totalRevenue() / count : 0;
  });
  const totalSuccessTransactions = createMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === "SUCCEEDED"
    ).length;
  });
  const transactionFilter = createMemo(() => {
    return transactions.reduce<
      Record<Transaction["status"] | "ALL", Transaction[]>
    >(
      (acc, transaction) => {
        const status = transaction.status ?? "REQUIRES_ACTION";

        // Jika belum ada array-nya, inisialisasi
        if (!acc[status]) acc[status] = [];
        acc[status].push(transaction);

        // Simpan juga ke "ALL"
        acc.ALL.push(transaction);

        return acc;
      },
      {
        SUCCEEDED: [],
        CANCELED: [],
        FAILED: [],
        EXPIRED: [],
        PENDING: [],
        REQUIRES_ACTION: [],
        ALL: [],
      }
    );
  });
  const [selectedStatus, setSelectedStatus] =
    createSignal<keyof ReturnType<typeof transactionFilter>>("ALL");

  createEffect(() => {
    if (queryTransactions.isSuccess) {
      setTransactions(queryTransactions.data);
    }
  });
  return (
    <>
      {/* <!-- Main Content --> */}
      <main class="px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* <!-- Filters and Actions --> */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div class="flex space-x-2">
            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onInput={(e) =>
                  setSelectedStatus(
                    e.currentTarget.value as keyof ReturnType<
                      typeof transactionFilter
                    >
                  )
                }
              >
                <option value={"ALL"}>All Status</option>
                <For each={TRANSACTION_STATUS_TAGS}>
                  {(stat) => (
                    <option value={stat.transactionStatus}>{stat.label}</option>
                  )}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button class="flex items-center space-x-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <i class="fas fa-file-export"></i>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* <!-- Stats Overview --> */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* <!-- Total Transactions --> */}
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">
                  Total Transactions
                </p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                  {totalTransactions()}
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
                <p class="text-sm font-medium text-gray-500">Revenue</p>
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
                <p class="text-sm font-medium text-gray-500">
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

        {/* <!-- Transactions List --> */}
        <div>
          <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trasnsaction ID
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
                <For each={transactionFilter()[selectedStatus()]}>
                  {(transaction) => (
                    <TransactionCard transaction={transaction} />
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
