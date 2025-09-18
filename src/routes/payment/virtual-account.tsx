import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
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
import { Transaction } from "~/types/order";
import { formatToRupiah } from "~/utils/Format";
import { getTimeLeft } from "~/utils/waitUntil";

interface OrderDetailsSearch {
  ref: string;
}

export const Route = createFileRoute("/payment/virtual-account")({
  validateSearch: (search): OrderDetailsSearch => {
    const ref = search.ref;

    if (typeof ref !== "string" || !/^test-\d{10}$/.test(ref)) {
      throw new Error("Invalid reference ID");
    }

    return { ref };
  },
  beforeLoad: ({ search }) => search,
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

  const [flipped, setFlipped] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [paymentChecked, setPaymentChecked] = createSignal(false);
  const [paymentStatus, setPaymentStatus] = createSignal("Awaiting payment");

  const [timeLeft, setTimeLeft] = createSignal("");

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transaction.actionValue || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPaymentStatus = async () => {
    setPaymentStatus("Checking...");
    try {
      const result = await queryTransacion.refetch(); // ⬅️ query ulang

      if (result.isSuccess) {
        setTransaction(result.data);
      }

      const status = result.data?.status;
      if (!status) {
        setPaymentStatus("Unable to check payment status.");
        return;
      }

      const label =
        PAYMENT_STATUS_TAGS.find((tag) => tag.paymentStatus === status)
          ?.label || status;
      if (status === "SUCCEEDED") {
        setPaymentChecked(true);
        setPaymentStatus(`✅ Payment received (${label})`);
      } else {
        setPaymentChecked(false);
        setPaymentStatus(`❌ Not paid yet (${label})`);
      }
    } catch (err) {
      setPaymentStatus("⚠️ Failed to check payment status.");
    }
  };

  createEffect(() => {
    if (queryTransacion.data && queryTransacion.isSuccess) {
      setTransaction(queryTransacion.data); // tetap disimpan kalau kamu perlu
      setPaymentStatus(queryTransacion.data.status || "");
      const expiresAt = queryTransacion.data.expiresAt;
      console.log(transaction);
      if (expiresAt) {
        const expiryTime = new Date(expiresAt);
        setTimeLeft(getTimeLeft(expiryTime));
      }
    }
  });

  onMount(() => {
    const flipTimeout = setTimeout(() => {
      setFlipped(true);
      const unflipTimeout = setTimeout(() => setFlipped(false), 3000);
      onCleanup(() => clearTimeout(unflipTimeout));
    }, 5000);
    onCleanup(() => clearTimeout(flipTimeout));
  });
  const expiryTime = createMemo(() => {
    const exp = queryTransacion.data?.expiresAt;
    return exp ? new Date(exp) : null;
  });

  onMount(() => {
    const interval = setInterval(() => {
      if (expiryTime()) {
        setTimeLeft(getTimeLeft(expiryTime()!));
      }
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <Show when={queryTransacion.isSuccess}>
      <div class="bg-gray-50 min-h-screen flex flex-col items-center justify-start py-8 px-4">
        <div class="max-w-2xl w-full">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              BCA Virtual Account Payment
            </h1>
            <p class="text-gray-600">Pay to this virtual account number</p>
          </div>

          <div
            class="card-container mb-10 mx-auto"
            style="max-width: 400px"
            onClick={() => setFlipped(!flipped())}
          >
            <div class={`card ${flipped() ? "flipped" : ""}`}>
              <Switch>
                <Match when={transaction.channelCode === "BCA_VIRTUAL_ACCOUNT"}>
                  <>
                    <div class="card-front bg-gradient-to-br from-blue-700 to-blue-900 text-white relative overflow-hidden">
                      <div class="absolute inset-0 shine"></div>
                      <div class="relative z-10 h-full flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                          <div class="flex items-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
                              alt="BCA Logo"
                              class="h-8 mr-2"
                            />
                            <div class="text-sm font-medium">
                              VIRTUAL ACCOUNT
                            </div>
                          </div>
                          <div class="text-xs bg-white/20 rounded-full px-2 py-1">
                            Active
                          </div>
                        </div>

                        <div class="my-4">
                          <div class="text-xs opacity-80 mb-1">
                            Virtual Account Number
                          </div>
                          <div class="font-mono text-2xl tracking-widest">
                            {transaction.actionValue}
                          </div>
                        </div>

                        <div class="flex justify-between items-end">
                          <div>
                            <div class="text-xs opacity-80">Account Name</div>
                            <div class="font-medium">Ezy Shop</div>
                          </div>
                          <div>
                            <div class="text-xs opacity-80">Expires</div>
                            <div class="text-sm">{timeLeft()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-back text-white relative overflow-hidden p-6">
                      <div class="absolute inset-0 shine"></div>
                      <div class="relative z-10 h-full flex flex-col">
                        <div class="flex justify-between items-center mb-2">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
                            class="h-8"
                          />
                          <div class="text-xl font-bold">BCA</div>
                        </div>
                        <div class="my-4 text-xs">
                          <div class="mb-1">For payments via:</div>
                          <div class="bg-white/10 rounded-lg p-2">
                            <div class="mb-1">
                              <i class="fas fa-mobile-alt mr-2"></i> m-BCA:
                              Transfer &gt; Virtual Account
                            </div>
                            <div class="mb-1">
                              <i class="fas fa-desktop mr-2"></i> KlikBCA: Fund
                              Transfer &gt; Virtual Account
                            </div>
                            <div>
                              <i class="fas fa-atm mr-2"></i> ATM BCA: Transfer
                              &gt; Virtual Account
                            </div>
                          </div>
                        </div>
                        <div class="mt-auto text-center text-xs">
                          <div>Customer Service: 1500888</div>
                          <div class="mt-1">
                            This is a virtual account for one-time payments
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </Match>
                <Match when={transaction.channelCode === "BNI_VIRTUAL_ACCOUNT"}>
                  <>
                    <div class="card-front bg-gradient-to-br from-yellow-600 to-yellow-800 text-white relative overflow-hidden">
                      <div class="absolute inset-0 shine"></div>
                      <div class="relative z-10 h-full flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                          <div class="flex items-center">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/5/55/BNI_logo.svg"
                              alt="BNI Logo"
                              class="h-8 mr-2"
                            />
                            <div class="text-sm font-medium">
                              VIRTUAL ACCOUNT
                            </div>
                          </div>
                          <div class="text-xs bg-white/20 rounded-full px-2 py-1">
                            Active
                          </div>
                        </div>

                        <div class="my-4">
                          <div class="text-xs opacity-80 mb-1">
                            Virtual Account Number
                          </div>
                          <div class="font-mono text-2xl tracking-widest">
                            {transaction.actionValue}
                          </div>
                        </div>

                        <div class="flex justify-between items-end">
                          <div>
                            <div class="text-xs opacity-80">Account Name</div>
                            <div class="font-medium">Ezy Shop</div>
                          </div>
                          <div>
                            <div class="text-xs opacity-80">Expires</div>
                            <div class="text-sm">{timeLeft()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-back bg-gradient-to-br from-yellow-600 to-yellow-800 text-white relative overflow-hidden p-6">
                      <div class="absolute inset-0 shine"></div>
                      <div class="relative z-10 h-full flex flex-col">
                        <div class="flex justify-between items-center mb-2">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/55/BNI_logo.svg"
                            class="h-8"
                          />
                          <div class="text-xl font-bold">BNI</div>
                        </div>
                        <div class="my-4 text-xs">
                          <div class="mb-1">For payments via:</div>
                          <div class="bg-white/10 rounded-lg p-2">
                            <div class="mb-1">
                              <i class="fas fa-mobile-alt mr-2"></i>
                            </div>
                            <div class="mb-1">
                              <i class="fas fa-desktop mr-2"></i>
                            </div>
                            <div>
                              <i class="fas fa-atm mr-2"></i>
                            </div>
                          </div>
                        </div>
                        <div class="mt-auto text-center text-xs">
                          <div>Customer Service: 1500046</div>
                          <div class="mt-1">
                            This is a virtual account for one-time payments
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </Match>
              </Switch>
            </div>
          </div>

          <div class="flex justify-center mb-10">
            <button
              onClick={handleCopy}
              class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition flex items-center"
            >
              <i
                class={copied() ? "fas fa-check mr-2" : "far fa-copy mr-2"}
              ></i>
              {copied() ? "Copied!" : "Copy Virtual Account Number"}
            </button>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              Payment Details
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500 mb-1">Payment Amount</div>
                <div class="text-xl font-bold">
                  {formatToRupiah(transaction.totalAmount)}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">Due Date</div>
                <div class="text-xl font-bold">
                  {new Date(transaction.expiresAt || "").toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">
              How to Pay via BCA
            </h2>
            <For
              each={[
                "m-BCA (Mobile Banking)",
                "KlikBCA (Internet Banking)",
                "ATM BCA",
              ]}
            >
              {(method, i) => (
                <div class="flex mb-6">
                  <div class="mr-4 flex flex-col items-center">
                    <div class="step-number bg-blue-600 text-white">
                      {i() + 1}
                    </div>
                    {i() < 2 && <div class="divider"></div>}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800 mb-2">Via {method}</h3>
                    <ul class="list-disc pl-5 text-gray-600 space-y-2 text-sm">
                      <li>
                        Follow steps to transfer to virtual account number
                      </li>
                      <li>
                        Use number:{" "}
                        <span class="font-mono font-bold">
                          {transaction.actionValue}
                        </span>
                      </li>
                      <li>
                        Amount:{" "}
                        <span class="font-bold">
                          {formatToRupiah(transaction.totalAmount)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div class="flex items-start">
              <div class="text-yellow-500 mr-3 mt-1">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div class="text-yellow-700 text-sm">
                <h3 class="font-medium text-yellow-800 mb-1">
                  Important Notes
                </h3>
                <ul class="list-disc pl-5 space-y-1">
                  <li>
                    This virtual account is valid for one-time payment only
                  </li>
                  <li>Payment must be made before the due date</li>
                  <li>Make sure to enter the correct virtual account number</li>
                  <li>Payment verification may take up to 5 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              Payment Verification
            </h2>
            <div class="flex items-center mb-4">
              <div
                class={`w-3 h-3 rounded-full mr-2 ${statusPayment()?.colorClass}`}
              ></div>
              <span class="text-sm">{paymentStatus()}</span>
            </div>
            <button
              onClick={checkPaymentStatus}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition flex items-center justify-center"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              {paymentChecked() ? "Check Again" : "Check Payment Status"}
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Payment Success Modal (hidden by default) --> */}
      <div
        id="successModal"
        class={`fixed inset-0 bg-black/50 items-center justify-center z-50 ${paymentChecked() ? "flex" : "hidden"}`}
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-95">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-check text-green-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p class="text-gray-500 mb-6">
              Your payment of {formatToRupiah(transaction.totalAmount)} has been
              processed successfully.
            </p>
            <div class="flex flex-col space-y-3">
              <Link
                to="/order/details"
                search={{
                  ref: context.ref,
                }}
                class="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium cursor-pointer"
              >
                View Receipt
              </Link>
              <button
                id="closeModalBtn"
                onclick={() => setPaymentChecked(false)}
                class="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
