import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { create } from "lodash";
import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  getTransactionByRefId,
  PAYMENT_STATUS_TAGS,
  PaymentStatusTag,
} from "~/queryFn/fetchOrders";
import { Address } from "~/types/address";
import { Transaction } from "~/types/order";
import { dateFormat, formatToRupiah } from "~/utils/Format";
import { getTimeLeft } from "~/utils/waitUntil";

interface OrderDetailsSearch {
  ref: string;
}

export const Route = createFileRoute("/order/details")({
  validateSearch: (search): OrderDetailsSearch => {
    const ref = search.ref;

    if (typeof ref !== "string" || !/^test-\d{10}$/.test(ref)) {
      throw new Error("Invalid reference ID");
    }

    return { ref };
  },
  beforeLoad: async ({ search }) => search,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getTransactionByRefId(context.token() || "", context.ref)
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch()();
  const context = Route.useRouteContext()();
  const [status, setStatus] = createSignal<string>("");
  const [paymentStatus, setPaymentStatus] = createSignal<string>();
  const [transaction, setTransaction] = createStore<Transaction>({
    status: "REQUIRES_ACTION",
  });
  const queryTransacion = useQuery(() =>
    getTransactionByRefId(context.token() || "", search.ref)
  );
  const statusPayment = createMemo((): PaymentStatusTag | undefined => {
    const data = queryTransacion.data;
    if (!data) return undefined;

    const tag = PAYMENT_STATUS_TAGS.find(
      (t) => t.paymentStatus === data.status
    );
    return tag;
  });
  const handleClick = async () => {
    setStatus("checking");

    // Simulasi API call
    try {
      const result = await queryTransacion.refetch(); // ⬅️ query ulang

      if (result.isSuccess) {
        setTransaction(result.data);
      }

      const status = result.data?.status;
      if (!status) {
        setStatus("Unable to check payment status.");
        return;
      }

      const label =
        PAYMENT_STATUS_TAGS.find((tag) => tag.paymentStatus === status)
          ?.label || status;
      if (status === "SUCCEEDED") {
        setPaymentStatus(`✅ Payment received (${label})`);
      } else {
        setPaymentStatus(`❌ Not paid yet (${label})`);
      }

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (err) {
      setPaymentStatus("⚠️ Failed to check payment status.");
    }
  };
  createEffect(() => {
    if (queryTransacion.data && queryTransacion.isSuccess) {
      setTransaction(queryTransacion.data); // tetap disimpan kalau kamu perlu
      setPaymentStatus(queryTransacion.data.status || "PENDING_PAYMENT");
      console.log(queryTransacion.data);
      const expiresAt = queryTransacion.data.expiresAt;
    }
  });

  const handlePayNow = createMemo(() => {
    if (transaction.channelCode?.includes("VIRTUAL_ACCOUNT")) {
      return "virtual-account";
    }
    if (transaction.channelCode === "QRIS") {
      return "qris";
    }
    return "cancel";
  });

  const printTransaction = () => {
    window.print();
  };
  return (
    <>
      <Show when={queryTransacion.isSuccess}>
        <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden print-container">
          {/* <!-- Header with print button --> */}
          <div class="bg-indigo-700 text-white p-4 flex justify-between items-center no-print">
            <div class="flex items-center">
              <i class="fas fa-shopping-bag text-2xl mr-2"></i>
              <h1 class="logo text-xl font-bold">Ezy Shop</h1>
            </div>
            <div class="flex space-x-2">
              <button
                onclick={() => window.print()}
                class="bg-white text-indigo-700 px-4 py-2 rounded-md flex items-center hover:bg-indigo-100 transition"
              >
                <i class="fas fa-print mr-2"></i> Print
              </button>
              <Link
                to={`/payment/${handlePayNow()}`}
                search={{
                  ref: search.ref,
                }}
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center transition animate-pulse"
                style="animation-iteration-count: infinite; animation-duration: 1.5s;"
              >
                <i class="fas fa-credit-card mr-2"></i> Pay Now
              </Link>
              <div>
                <button
                  onClick={handleClick}
                  disabled={status() === "checking"}
                  class={`btn-expand px-6 py-2.5 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-300
                ${
                  status() === "shipped"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                >
                  <span class="btn-text">
                    {status() === "checking"
                      ? "Checking..."
                      : "Check Transaction Status"}
                  </span>
                  {status() === "checking" && (
                    <span class="ml-2">
                      <i class="fas fa-circle-notch animate-spin"></i>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Order info header --> */}
          <div class="p-6 border-b">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">
                  Transaction Details
                </h2>
                <p class="text-gray-500">
                  Transaction ID: #{transaction.referenceId}
                </p>
              </div>
              <div class="mt-4 md:mt-0">
                <div
                  class={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    statusPayment()?.colorClass
                  }`}
                >
                  <span class="btn-text">
                    {status() === "checking" ? "Checking..." : paymentStatus()}
                  </span>
                  {status() === "checking" && (
                    <span class="ml-2">
                      <i class="fas fa-circle-notch animate-spin"></i>
                    </span>
                  )}
                </div>
                <p class="text-gray-500 text-sm mt-1">
                  Placed on {dateFormat(transaction.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Shipping and Payment Info --> */}
          <div class="md:flex border-b">
            <div class="p-6 md:w-1/2 border-b md:border-b-0 md:border-r">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <i class="fas fa-truck mr-2 text-indigo-600"></i> Shipping
                Information
              </h3>
              <address class="not-italic">
                <p class="font-medium">
                  {transaction.shippingAddress?.firstName}{" "}
                  {transaction.shippingAddress?.lastName}
                </p>
                <p>{transaction.shippingAddress?.streetAddress}</p>
                <Show when={transaction.shippingAddress?.apartment}>
                  <p>{transaction.shippingAddress?.apartment}</p>
                </Show>
                <p>
                  {transaction.shippingAddress?.city},{" "}
                  {transaction.shippingAddress?.stateProvince}{" "}
                  {transaction.shippingAddress?.postalCode}
                </p>
                <p>{transaction.shippingAddress?.country}</p>
                <p class="mt-2">
                  <i class="fas fa-phone mr-2 text-gray-500"></i>
                  {transaction.shippingAddress?.phoneNumber}
                </p>
                {/* <Show when={user?.email}>
                  <p>
                    <i class="fas fa-envelope mr-2 text-gray-500"></i>
                    {user.email}
                  </p>
                </Show> */}
              </address>
            </div>

            <div class="p-6 md:w-1/2">
              <h3 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <i class="fas fa-credit-card mr-2 text-indigo-600"></i> Payment
                Information
              </h3>
              <div>
                <p class="font-medium">Visa ending in 4242</p>
                <p>Payment method: {transaction.channelCode}</p>
                <p>Subtotal: {formatToRupiah(transaction.subTotal)}</p>
                <p>Shipping: {formatToRupiah(transaction.shippingCost)}</p>
                <p>Tax: {formatToRupiah(transaction.tax)}</p>
                <p class="font-bold mt-2">
                  Total: {formatToRupiah(transaction.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Order Items --> */}
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Order Items</h3>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {transaction.orders?.map((order) =>
                    order.items?.map((item) => (
                      <tr class="item-row">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <Switch>
                                <Match when={queryTransacion.isSuccess}>
                                  <img src={item.productImage} alt="" />
                                </Match>
                                <Match when={queryTransacion.isPending}>
                                  <i class="fas fa-tshirt text-gray-400"></i>
                                </Match>
                              </Switch>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {item.productName}
                              </div>
                              <div class="text-sm text-gray-500">
                                Brand: {item.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.productSku}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.store.storeName}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatToRupiah(item.price)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatToRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  )}

                  {/* <tr class="item-row">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <i class="fas fa-tshirt text-gray-400"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            Premium Cotton T-Shirt
                          </div>
                          <div class="text-sm text-gray-500">
                            Color: Black, Size: M
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $29.99
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      $59.98
                    </td>
                  </tr>

                  <tr class="item-row">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <i class="fas fa-socks text-gray-400"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            Running Socks
                          </div>
                          <div class="text-sm text-gray-500">Size: 9-11</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $9.99
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      $29.97
                    </td>
                  </tr>

                  <tr class="item-row">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <i class="fas fa-watch text-gray-400"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            Sports Watch
                          </div>
                          <div class="text-sm text-gray-500">Color: Blue</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $60.00
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      $60.00
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>

          {/* <!-- Order Summary --> */}
          <div class="p-6 bg-gray-50">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-2">Shipping Method</h4>
                <p class="text-sm text-gray-500">Standard Shipping</p>
                <p class="text-sm text-gray-500">
                  Estimated delivery: October 20, 2023
                </p>
                <p class="text-sm text-gray-500">
                  Tracking #: {transaction.referenceId}
                </p>
              </div>

              <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-2">Billing Address</h4>
                <p class="text-sm text-gray-500">Same as shipping address</p>
              </div>

              <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-2">Payment Summary</h4>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-500">Subtotal:</span>
                  <span>{formatToRupiah(transaction.subTotal)}</span>
                </div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-500">Shipping:</span>
                  <span>{formatToRupiah(transaction.shippingCost)}</span>
                </div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-500">Tax:</span>
                  <span>{formatToRupiah(transaction.tax)}</span>
                </div>
                <div class="flex justify-between font-medium mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatToRupiah(transaction.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Footer --> */}
          <div class="p-4 bg-gray-100 text-center text-sm text-gray-500 border-t no-print">
            <p>
              Thank you for shopping with us! Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </Show>
    </>
  );
}
function getOrderByRefId(
  arg0: string,
  ref: string
): import("@tanstack/solid-query").SolidQueryOptions<
  unknown,
  Error,
  unknown,
  readonly unknown[]
> & { initialData?: undefined } {
  throw new Error("Function not implemented.");
}
