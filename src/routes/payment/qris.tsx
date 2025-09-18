import { useQuery } from "@tanstack/solid-query";
import QRCode from "qrcode";
import { createFileRoute, Link } from "@tanstack/solid-router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  getTransactionByRefId,
  PAYMENT_STATUS_TAGS,
  PaymentStatusTag,
} from "~/queryFn/fetchOrders";
import { Transaction } from "~/types/order";
import { dateFormat, formatToRupiah } from "~/utils/Format";
import { getTimeLeft } from "~/utils/waitUntil";

interface OrderDetailsSearch {
  ref: string;
}

export const Route = createFileRoute("/payment/qris")({
  validateSearch: (search): OrderDetailsSearch => {
    const ref = search.ref;

    if (typeof ref !== "string" || !/^test-\d{10}$/.test(ref)) {
      throw new Error("Invalid reference ID");
    }

    return { ref };
  },
  beforeLoad: ({ search }) => search,
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getTransactionByRefId(context.token() || "", context.ref)
    );
  },
});

function RouteComponent() {
  const search = Route.useSearch()();
  const context = Route.useRouteContext()();
  const [qrcode, setQrcode] = createSignal("");
  const [flipped, setFlipped] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [paymentChecked, setPaymentChecked] = createSignal(false);
  const [paymentStatus, setPaymentStatus] = createSignal("Awaiting payment");

  const [timeLeft, setTimeLeft] = createSignal("");

  const [transaction, setTransaction] = createStore<Transaction>();

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
      QRCode.toDataURL(transaction.actionValue || "").then(setQrcode);
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
    <>
      <div class="flex items-center justify-center h-screen-fit bg-gray-50">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-4 transform transition-all duration-300 hover:shadow-xl">
          {/* <!-- Header with merchant info --> */}
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 opacity-10">
              <svg
                width="150"
                height="150"
                viewBox="0 0 150 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M75 0L150 75L75 150L0 75L75 0Z" fill="currentColor" />
              </svg>
            </div>
            <div class="flex justify-between items-center relative z-10">
              <div>
                <h1 class="text-2xl font-bold flex items-center">
                  <i class="fas fa-qrcode mr-2"></i> QRIS Payment
                </h1>
                <p class="text-indigo-100 text-sm flex items-center mt-1">
                  <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Indonesian Standard QR Code
                </p>
              </div>
              <div class="bg-white bg-opacity-20 p-3 rounded-full animate-float">
                <i class="fas fa-mobile-alt text-xl"></i>
              </div>
            </div>
          </div>

          {/* <!-- Payment Info Section --> */}
          <div class="p-6 border-b border-gray-200 relative">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-gray-500 font-medium text-sm">Merchant Name</h2>
                <p class="text-lg font-semibold">Ezy Shop</p>
                <p class="text-gray-500 text-sm mt-1 flex items-center">
                  <span class="text-gray-400 text-xs">
                    powered by{" "}
                    <span class="text-blue-500 font-semibold">Xendit</span>
                  </span>
                </p>
              </div>
              <div class="text-right">
                <h2 class="text-gray-500 font-medium text-sm">
                  Transaction ID
                </h2>
                <p class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {transaction.referenceId}
                </p>
                <div class="mt-2">
                  <div class="text-xs text-gray-500">
                    Status:{" "}
                    <span class="font-medium text-indigo-600">
                      {transaction.status}
                    </span>
                  </div>
                  <div class="progress-wrapper mt-1">
                    <div id="progressBar" class="progress-bar"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h2 class="text-gray-500 font-medium text-sm">Amount to Pay</h2>
              <p class="text-3xl font-bold text-indigo-600">{formatToRupiah(transaction.totalAmount)}</p>
              <div class="flex justify-between text-sm text-gray-500 mt-1">
                <span>{dateFormat(transaction.createdAt)}</span>
              </div>
            </div>

            {/* <!-- Payment timer --> */}
            <div class="mt-4 bg-indigo-50 p-3 rounded-lg flex items-center">
              <i class="fas fa-clock text-indigo-500 mr-2"></i>
              <span class="text-sm text-indigo-600 font-medium">
                Auto-expires in:{" "}
                <span id="countdown" class="font-bold">
                  {timeLeft()}
                </span>
              </span>
            </div>
          </div>

          {/* <!-- QR Code Section --> */}
          <div class="p-6 flex flex-col items-center">
            <div class="qr-container mb-6 relative">
              <img
                src={qrcode()}
                alt="QRIS Payment Code"
                class="w-full h-full border-4 border-indigo-50 rounded-xl"
              />
              <div class="qr-overlay hidden">
                <div class="progress-spinner"></div>
              </div>
              <div class="scanner-line"></div>
            </div>

            <p class="text-gray-500 text-center mb-6 leading-relaxed">
              <i class="fas fa-info-circle text-indigo-500 mr-1"></i>
              Scan this QR code with your mobile banking or e-wallet app to
              complete the payment
            </p>

            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <span class="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center">
                <i class="fas fa-university mr-1"></i> Bank Transfer
              </span>
              <span class="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center">
                <i class="fas fa-wallet mr-1"></i> E-Wallet
              </span>
              <span class="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center">
                <i class="fas fa-qrcode mr-1"></i> QRIS Standard
              </span>
            </div>
          </div>

          {/* <!-- Supported Banks & E-Wallets --> */}
          {/* <div class="p-6 bg-gray-50 border-t border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-gray-500 font-medium">Supported Payment Apps</h3>
              <button class="text-xs text-indigo-600 font-medium">
                See all
              </button>
            </div>
            <div class="grid grid-cols-5 gap-3">
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
                  alt="BCA"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Bank_Mandiri_logo.svg"
                  alt="Mandiri"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6e/BRI_logo.svg"
                  alt="BRI"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/84/Logo_DANA.svg"
                  alt="DANA"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg"
                  alt="OVO"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/LinkAja_logo.svg"
                  alt="LinkAja"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8a/ShopeePay_logo.svg"
                  alt="ShopeePay"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/bf/BNI_logo.svg"
                  alt="BNI"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/86/GoPay_logo.svg"
                  alt="GoPay"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="payment-method bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                <span class="text-xs font-bold text-indigo-600">+15 more</span>
              </div>
            </div>
          </div> */}

          {/* <!-- Action Buttons --> */}
          <div class="p-6 flex flex-col space-y-3">
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
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition flex items-center justify-center"
            >
              <i class="fas fa-sync-alt mr-2"></i>
              {paymentChecked() ? "Check Again" : "Check Payment Status"}
            </button>
            <button
              id="refreshBtn"
              class="bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all"
            >
              <i class="fas fa-sync-alt"></i>
              <span>Refresh QR Code</span>
            </button>
          </div>

          {/* <!-- Help Section --> */}
          <div class="p-4 bg-indigo-50 text-center">
            <p class="text-sm text-indigo-600 flex items-center justify-center">
              <i class="fas fa-question-circle mr-2"></i>
              Need help with payment?{" "}
              <a href="#" class="font-medium ml-1">
                Contact Support
              </a>
            </p>
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
              Your payment of Rp 125,000 has been processed successfully.
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
    </>
  );
}
