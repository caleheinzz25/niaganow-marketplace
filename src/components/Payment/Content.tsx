import { useMutation } from "@tanstack/solid-query";
import {
  Accessor,
  createEffect,
  createSignal,
  onCleanup,
  Setter,
} from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export type PaymentTab = "va" | "qris" | "ewallet";
export interface PaymentMethodOption {
  id: string;
  label: string;
  color: string;
  type: "PAY" | "PAY_AND_SAVE" | "REUSABLE_PAYMENT_CODE" | "SAVE";
  desc?: string; // optional, hanya ada di VA (bankPayment)
}
export interface PaymentSelectorProps {
  activeTab: Accessor<PaymentTab>;
  setActiveTab: Setter<PaymentTab>;

  selectedPayment: PaymentMethodOption;
  setSelectedPayment: SetStoreFunction<PaymentMethodOption>;
}

export const PaymentSelection = ({
  activeTab,
  selectedPayment,
  setActiveTab,
  setSelectedPayment,
}: PaymentSelectorProps) => {
  const ewalletPayment = [
    {
      id: "DANA",
      label: "DANA",
      color: "blue",
      type: "PAY",
      src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",
    },
    // { id: "OVO", label: "OVO", color: "purple", type: "PAY" src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",},
    // { id: "SHOPEEPAY", label: "ShopeePay", color: "orange", type: "PAY" src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",},
    {
      id: "GOPAY",
      label: "GOPAY",
      color: "green",
      type: "PAY",
      src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",
    },
  ];
  const bankPayment = [
    {
      id: "BCA_VIRTUAL_ACCOUNT",
      label: "BCA Virtual Account",
      desc: "Payment code will be generated",
      color: "blue",
      type: "PAY",
      src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",
    },
    // {
    //   id: "MANDIRI_VIRTUAL_ACCOUNT",
    //   label: "Mandiri Virtual Account",
    //   desc: "Payment code will be generated",
    //   color: "green",
    //   type: "PAY",
    // src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",
    // },
    // {
    //   id: "BNI_VIRTUAL_ACCOUNT",
    //   label: "BNI Virtual Account",
    //   desc: "Payment code will be generated",
    //   color: "yellow",
    //   type: "PAY",
    // src: "http://localhost:8080/api/v1/images/view/dana-e-wallet-app-seeklogo.png",
    // },
  ];

  const tabClasses = (tab: string) =>
    `payment-tab flex-1 py-4 px-2 text-center ${activeTab() === tab ? "active border-b-2 border-blue-600" : ""}`;

  return (
    <div>
      {/* Tabs */}
      <div class="flex border-b">
        <button class={tabClasses("va")} onClick={() => setActiveTab("va")}>
          <i class="fas fa-university mr-2" /> Virtual Account
        </button>
        <button class={tabClasses("qris")} onClick={() => setActiveTab("qris")}>
          <i class="fas fa-qrcode mr-2" /> QRIS
        </button>
        <button
          class={tabClasses("ewallet")}
          onClick={() => setActiveTab("ewallet")}
        >
          <i class="fas fa-wallet mr-2" /> E-Wallet
        </button>
      </div>

      {/* Payment Content */}
      <div class="p-6">
        {/* Virtual Account Content */}
        {activeTab() === "va" && (
          <div id="va-content">
            <div class="mb-4">
              <div class="space-y-3">
                {bankPayment.map((bank) => (
                  <div class="flex items-center">
                    <input
                      type="radio"
                      name="va"
                      id={`va-${bank.id}`}
                      class="hidden"
                      value={bank.id}
                      checked={selectedPayment.id === bank.id}
                      onInput={(e) =>
                        setSelectedPayment("id", e.currentTarget.value)
                      }
                    />

                    <label
                      for={`va-${bank.id}`}
                      class={`flex items-center p-4 border-2 rounded-lg cursor-pointer w-full transition-all duration-200 gap-4
          ${
            selectedPayment.id === bank.id
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
                    >
                      <div
                        class={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 relative
            ${
              selectedPayment.id === bank.id
                ? "border-blue-500"
                : "border-gray-300"
            }`}
                      >
                        {selectedPayment.id === bank.id && (
                          <div class="w-3 h-3 rounded-full bg-blue-500 absolute inset-0 m-auto animate-scaleIn" />
                        )}
                      </div>

                      <div class="flex items-center gap-3">
                        <div
                          class={`bg-${bank.color}-100 text-${bank.color}-600 rounded-full p-2`}
                        >
                          <i class="fas fa-university"></i>
                        </div>
                        <div>
                          <div class="font-medium text-gray-800">
                            {bank.label}
                          </div>
                          <div class="text-sm text-gray-600">{bank.desc}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div id="va-details" class="payment-details">
              <div class="border rounded-lg p-4 mb-4 bg-gray-50">
                <h4 class="font-semibold mb-2">Payment Instruction:</h4>
                <ol class="list-decimal pl-5 space-y-1 text-sm">
                  <li>Go to your mobile/internet banking</li>
                  <li>Select Virtual Account/Payment menu</li>
                  <li>Enter the virtual account number below</li>
                  <li>Confirm payment</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* QRIS Content */}
        {activeTab() === "qris" && (
          <div id="qris-content" class="text-center">
            <div class="bg-white p-4 rounded-lg inline-block mb-4">
              <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-qrcode text-gray-400 text-6xl" />
              </div>
              <p class="text-sm text-gray-600 mb-4">
                Scan this QR code with your banking/mobile payment app
              </p>
            </div>

            <div class="border-t pt-4 text-left">
              <h3 class="font-semibold mb-2">How to pay with QRIS:</h3>
              <ol class="list-decimal pl-5 text-sm space-y-1">
                <li>
                  Open your mobile payment app (Dana, OVO, ShopeePay, LinkAja,
                  etc)
                </li>
                <li>Select "Scan QR" or similar option</li>
                <li>Point your camera at the QR code</li>
                <li>Confirm the amount and complete payment</li>
              </ol>
            </div>
          </div>
        )}

        {/* E-Wallet Content */}
        {/* E-Wallet Content */}
        {activeTab() === "ewallet" && (
          <div id="ewallet-content">
            <div class="space-y-3">
              {ewalletPayment.map((wallet) => (
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="ewallet"
                    id={`ewallet-${wallet.id}`}
                    class="hidden"
                    value={wallet.id}
                    checked={selectedPayment.id === wallet.id}
                    onInput={(e) =>
                      setSelectedPayment("id", e.currentTarget.value)
                    }
                  />

                  <label
                    for={`ewallet-${wallet.id}`}
                    class={`flex items-center p-4 border-2 rounded-lg cursor-pointer w-full transition-all duration-200 gap-4
              ${
                selectedPayment.id === wallet.id
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
                  >
                    <div
                      class={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 relative
                ${
                  selectedPayment.id === wallet.id
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                    >
                      {selectedPayment.id === wallet.id && (
                        <div class="w-3 h-3 rounded-full bg-blue-500 absolute inset-0 m-auto animate-scaleIn" />
                      )}
                    </div>

                    <div class="flex items-center gap-3">
                      <div
                        class={`bg-${wallet.color}-100 text-${wallet.color}-600 rounded-full p-2`}
                      >
                        <i class="fas fa-mobile-alt" />
                      </div>
                      <div>
                        <div class="font-medium text-gray-800">
                          {wallet.label}
                        </div>
                        <div class="text-sm text-gray-600">
                          Pay with {wallet.label} balance
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
