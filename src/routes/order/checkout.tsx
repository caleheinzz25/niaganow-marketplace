import { useMutation, useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/solid-router";
import createEmblaCarousel from "embla-carousel-solid";
import { get } from "lodash";
import { format } from "path";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { PaymentSelection } from "~/components/Payment/Content";
import { getAddresses } from "~/queryFn/fetchAddress";
import {
  CartDto,
  queryGetCarts,
  queryGetCartsByItemIds,
} from "~/queryFn/fetchCarts";
import { createPayment, PaymentResponse } from "~/queryFn/fetchPayment";
import { Address } from "~/types/address";
import { formatToRupiah } from "~/utils/Format";
import { waitUntilWithRefresh } from "~/utils/waitUntil";

interface CheckoutSearch {
  cartItemIds: number[];
}

interface Addresses {
  selected: number;
  addresses: Address[];
  options: {
    addressType: string;
    apartment: string;
    city: string;
    icon: string;
  }[];
}

export interface PaymentMethodOption {
  id: string;
  label: string;
  color: string;
  src: string;
  type: "PAY" | "PAY_AND_SAVE" | "REUSABLE_PAYMENT_CODE" | "SAVE";
  desc?: string; // optional, hanya ada di VA (bankPayment)
}

export const Route = createFileRoute("/order/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => {
    const rawItem = search.cartItemIds;
    const cartItemIds: number[] = Array.isArray(rawItem)
      ? (rawItem as string[]).map((s) => Number(s))
      : rawItem != null
        ? [Number(rawItem)]
        : [];
    return {
      cartItemIds,
    };
  },
  beforeLoad: async ({ context, search }) => {
    const isReady = await waitUntilWithRefresh(
      () => context.token() !== null,
      context.refresh // ← harus dipastikan hanya 1x dijalankan
    );
    if (!isReady) {
      throw redirect({ to: "/auth/login" });
    }

    return {
      search,
    };
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.clientQuery.prefetchQuery(
      queryGetCartsByItemIds(context.token(), context.search.cartItemIds)
    );
  },
});

function RouteComponent() {
  const search = Route.useSearch()();
  const context = Route.useRouteContext()();
  const queryAddresses = useQuery(() => getAddresses(context.token() || ""));
  const [addressStore, setAddressStore] = createStore<Addresses>({
    selected: 0,
    addresses: [],
    options: [
      {
        addressType: "Office",
        apartment: "Floor 22, Suite 2205",
        city: "New York, NY 10017",
        icon: "fas fa-briefcase",
      },
      {
        addressType: "Warehouse",
        apartment: "Building C, Unit 12",
        city: "Brooklyn, NY 11205",
        icon: "fas fa-warehouse",
      },
      {
        addressType: "Home",
        apartment: "Apartment 7A, Maple Street",
        city: "Queens, NY 11101",
        icon: "fas fa-home",
      },
    ],
  });

  const queryCartsById = useQuery(() =>
    queryGetCartsByItemIds(context.token(), search.cartItemIds)
  );
  const [activeTab, setActiveTab] = createSignal<"va" | "qris" | "ewallet">(
    "va"
  );
  const navigate = useNavigate();

  const adminFee = 2000;
  const [selectedPayment, setSelectedPayment] =
    createStore<PaymentMethodOption>({
      color: "",
      id: "",
      label: "",
      desc: "",
      type: "PAY",
      src: "",
    });

  const mutateOrder = useMutation(() => ({
    mutationKey: ["order"],
    mutationFn: createPayment,
    onSuccess: (data: PaymentResponse) => {
      console.log("success");
      console.log("data", data);
      if (data.actions[0].descriptor === "WEB_URL") {
        window.location.href = data.actions[0].value;
        console.log("kdasdsad");
      }
      if (data.actions[0].descriptor === "VIRTUAL_ACCOUNT_NUMBER") {
        navigate({
          to: "/payment/virtual-account",
          search: {
            ref: data.reference_id,
          },
        });
      }
      if (data.channel_code === "QRIS") {
        navigate({
          to: "/payment/qris",
          search: {
            ref: data.reference_id,
          },
        });
      }
    },
    onError: (err) => {
      console.log("error", err);
    },
  }));

  const handlePlaceOrder = () => {
    const payment = mutateOrder.mutate({
      authToken: context.token() || "",
      paymentRequest: {
        channel_code: selectedPayment.id,
        type: selectedPayment.type,
        shipping_type: getShippingType()!,
        tax: adminFee,
        channel_properties: {
          display_name: context.username() || "USER",
        },
        carts: carts,
        shipping_address: getShippingAddress()!,
      },
    });
    console.log("handlePlaceOrder", {
      authToken: context.token() || "",
      paymentRequest: {
        channel_code: selectedPayment.id,
        type: selectedPayment.type,
        shipping_type: getShippingType()!,
        tax: adminFee,
        channel_properties: {
          display_name: context.username() || "USER",
        },
        carts: carts,
        shipping_address: getShippingAddress()!,
      },
    });
  };

  const [carts, setCarts] = createStore<CartDto[]>([]);

  const selectAddress = (id: number) => setAddressStore("selected", id);

  const [shipping, setShipping] = createStore({
    selected: "STANDARD",
    options: [
      {
        id: "STANDARD",
        label: "Standard Shipping",
        info: "Delivery in 5-7 business days",
        price: 20000,
      },
      {
        id: "EXPRESS",
        label: "Express Shipping",
        info: "Delivery in 2-3 business days",
        price: 44000,
      },
      {
        id: "OVERNIGHT",
        label: "Overnight Shipping",
        info: "Delivery by tomorrow",
        price: 70000,
      },
    ],
  });

  const getShippingType = createMemo(() => {
    return shipping.options.find((option) => option.id === shipping.selected)
      ?.id;
  });

  const getShippingFee = createMemo(() => {
    return shipping.options.find((option) => option.id === shipping.selected)
      ?.price;
  });

  const getShippingAddress = createMemo(() => {
    return addressStore.addresses.find(
      (address) => address.id === addressStore.selected
    );
  });

  const getCartTotal = createMemo(() => {
    return queryCartsById.isSuccess
      ? carts
          .flatMap((cart) => cart.items)
          .reduce((total, item) => total + item.subtotal, 0)
      : 0;
  });
  const getCostTotal = createMemo(() => {
    return queryCartsById.isSuccess
      ? Math.round(getCartTotal() + getShippingFee()! + adminFee)
      : 0;
  });

  const selectStore = (id: string) => {
    setShipping("selected", id);
  };

  createEffect(() => {
    if (queryCartsById.data && queryCartsById.isSuccess) {
      setCarts(queryCartsById.data.carts);
      console.log(queryCartsById.data.carts);
    }
  });

  createEffect(() => {
    if (queryAddresses.isSuccess) {
      setAddressStore("addresses", queryAddresses.data.addresses);
      setAddressStore(
        "selected",
        addressStore.addresses.find((address) => address.defaultShipping)?.id ||
          0
      );
    }
  });

  createEffect(() => {
    if (activeTab() === "qris") {
      setSelectedPayment("id", "QRIS");
    }
    console.log(selectedPayment.id);
  });

  return (
    <>
      <div class="min-h-screen flex flex-col lg:flex-row">
        {/* <!-- Left Column - Order Summary --> */}
        <div class="lg:w-2/5 p-6 lg:p-10 bg-white shadow-lg animate-fade-in delay-1">
          <div
            class="flex items-center mb-8 border-2 border-white  rounded-lg  p-1 hover:border-blue-500 cursor-pointer"
            onclick={() => history.back()}
          >
            <a href="#" class="text-blue-500 hover:text-blue-700 mr-4">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-2xl font-bold text-gray-800">Back</h1>
          </div>

          <div class="mb-8 animate-fade-in delay-2 flex flex-col gap-3">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-700 flex items-center">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  1
                </span>
                <span>Shipping Address</span>
              </h2>

              <Link
                to="/account/address"
                class="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                Add new Address
              </Link>
            </div>

            <For each={addressStore.addresses}>
              {(addr) => (
                <div class="flex items-center">
                  <input
                    type="radio"
                    name="address"
                    id={`address-${addr.id}`}
                    class="hidden"
                    value={addr.id}
                    checked={addressStore.selected === addr.id}
                    onChange={() => selectAddress(addr.id || 0)}
                  />
                  <label
                    for={`address-${addr.id}`}
                    class={`flex items-center p-4 border-2 rounded-lg cursor-pointer w-full transition-all duration-200 gap-4
                      ${
                        addressStore.selected === addr.id
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div
                      class={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 relative
                        ${
                          addressStore.selected === addr.id
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                    >
                      {addressStore.selected === addr.id && (
                        <div class="w-3 h-3 rounded-full bg-blue-500 absolute inset-0 m-auto animate-scaleIn" />
                      )}
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="bg-gray-100 text-gray-800 rounded-full p-2">
                        <i
                          class={
                            addressStore.options.find(
                              (o) => o.addressType === addr.addressType
                            )?.icon
                          }
                        />
                      </div>
                      <div>
                        <div class="font-medium text-gray-800">
                          {addr.addressType}
                        </div>
                        <div class="text-sm text-gray-600">
                          {addr.streetAddress} | {addr.apartment}
                        </div>
                        <div class="text-sm text-gray-600">{addr.city}</div>
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </For>
          </div>

          <div class="mb-8 animate-fade-in delay-2">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                2
              </span>
              Delivery Options
            </h2>

            <div class="space-y-3">
              <Index each={shipping.options}>
                {(option) => (
                  <div class="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      id={option().id}
                      class="hidden"
                      value={option().id}
                      checked={shipping.selected === option().id}
                      onChange={() => selectStore(option().id)}
                    />
                    <label
                      for={option().id}
                      class={`radio-label flex items-center p-4 border-2 rounded-lg cursor-pointer w-full transition-all duration-200 ${
                        shipping.selected === option().id
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        class={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 relative ${
                          shipping.selected === option().id
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {shipping.selected === option().id && (
                          <div class="w-3 h-3 rounded-full bg-blue-500 absolute inset-0 m-auto animate-scaleIn" />
                        )}
                      </div>
                      <div class="flex-1">
                        <div class="font-medium text-gray-800 flex justify-between">
                          <span>{option().label}</span>
                          <span class="text-blue-600 font-semibold">
                            {formatToRupiah(option().price)}
                          </span>
                        </div>
                        <div class="text-sm text-gray-500 mt-1">
                          {option().info}
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </Index>

              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <div class="text-gray-700">
                  Selected option:{" "}
                  <strong class="text-blue-600">
                    {shipping.selected
                      ? shipping.options.find((o) => o.id === shipping.selected)
                          ?.label
                      : "None"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Right Column - Payment & Order Summary --> */}
        <div class="lg:w-3/5 bg-gray-100 p-6 lg:p-10 animate-fade-in delay-3">
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                3
              </span>
              Payment Method
            </h2>

            {/* <!-- Payment Method Tabs --> */}
            {/* Payment Options */}
            <PaymentSelection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>

          {/* <!-- Order Summary --> */}
          <div class="bg-white rounded-lg shadow-md p-6 animate-fade-in delay-4">
            <h2 class="text-lg font-semibold text-gray-700 mb-4">
              Order Summary
            </h2>

            <Switch>
              <Match when={queryCartsById.isSuccess}>
                <div class="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  <For each={carts}>
                    {(cart) => (
                      <For each={cart.items}>
                        {(item) => (
                          <div class="flex items-center mb-4">
                            <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                              <img
                                src={item.productThumbnail}
                                alt={item.productTitle}
                                class="w-full h-full object-cover"
                              />
                            </div>
                            <div class="ml-4">
                              <div class="font-medium text-gray-800">
                                {item.productTitle}
                              </div>
                              <div class="text-sm text-gray-500">
                                SKU: {item.productSku} · Qty: {item.quantity}
                              </div>
                            </div>
                            {/* <div class="ml-auto text-right">
                              <div class="font-medium text-gray-800">
                                Rp{" "}
                                {Number(item.subtotal).toLocaleString("id-ID")}
                              </div>
                              {Number(item.discountPercentage) > 0 && (
                                <div class="text-xs text-red-500">
                                  {item.discountPercentage}% off
                                </div>
                              )}
                            </div> */}
                          </div>
                        )}
                      </For>
                    )}
                  </For>
                </div>
                <div class="border-t border-gray-200 pt-4 flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatToRupiah(getCartTotal())}</span>
                </div>

                <div class="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatToRupiah(getShippingFee())}</span>
                </div>

                <div class="flex justify-between font-medium pb-4">
                  <span>Admin fee</span>
                  <span>{formatToRupiah(adminFee)}</span>
                </div>
              </Match>
              <Match when={queryCartsById.isPending}>
                <BounceLoading />
              </Match>
            </Switch>

            <div class="border-t border-gray-200 pt-4 mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                {formatToRupiah(
                  Math.round(getCartTotal() + getShippingFee()! + adminFee)
                )}
              </span>
            </div>

            <button
              id="place-order"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-md font-bold text-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              onclick={handlePlaceOrder}
            >
              Place Order
            </button>

            <div class="text-xs text-gray-500 mt-4 text-center">
              By placing your order, you agree to our{" "}
              <a href="#" class="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" class="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>

          <div class="mt-6 flex items-center justify-center space-x-4">
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <i class="fab fa-cc-visa text-2xl"></i>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <i class="fab fa-cc-mastercard text-2xl"></i>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <i class="fab fa-cc-amex text-2xl"></i>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-700">
              <i class="fab fa-cc-discover text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
