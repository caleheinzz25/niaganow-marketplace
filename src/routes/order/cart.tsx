import { useMutation, useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/solid-router";
import { debounce } from "lodash";
import { createEffect, createMemo, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Basic } from "~/BreadCrumb/Basic";
import { Interactive } from "~/BreadCrumb/Interactive";
import { Outline } from "~/BreadCrumb/Outline";
import {
  addCart,
  CartDto,
  CartItemDto,
  CartsDto,
  queryGetCarts,
  removeCartItem,
} from "~/queryFn/fetchCarts";
import { formatToRupiah } from "~/utils/Format";
import { waitUntilWithRefresh } from "~/utils/waitUntil";

export const Route = createFileRoute("/order/cart")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const isReady = await waitUntilWithRefresh(
      () => context.token() !== null,
      context.refresh // ← harus dipastikan hanya 1x dijalankan
    );

    if (!isReady) {
      throw redirect({ to: "/auth/login" });
    }
  },
  loader: async ({ context }) => {
    await context.clientQuery.prefetchQuery(
      queryGetCarts(context.token() || "")
    );
  },
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [carts, setCarts] = createStore<CartDto[]>([]);
  const [selectedItems, setSelectedItems] = createStore<
    Record<number, boolean>
  >({});
  const queryCart = useQuery(() => queryGetCarts(context.token() || ""));

  const removeCart = useMutation(() => ({
    mutationFn: removeCartItem,
  }));

  const updateCartItem = useMutation(() => ({
    mutationFn: addCart,
  }));

  const selectedForCheckout = createMemo(() => {
    return carts
      .flatMap((cart) => cart.items)
      .filter((item) => selectedItems[item.id])
      .map((item) => item.id);
  });

  const debouncedUpdate = debounce((productId: number, qty: number) => {
    updateCartItem.mutate({
      accessToken: context.token() || "",
      item: {
        productId,
        quantity: qty,
      },
    });
  }, 700);

  const removeCartHandle = (cartId: number, cartItemId: number) => {
    setCarts((c) =>
      c.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.filter((item) => item.id !== cartItemId),
            }
          : cart
      )
    );
    removeCart.mutate({
      accessToken: context.token() || "",
      item: {
        id: cartItemId,
      },
    });
  };

  createEffect(() => {
    if (queryCart.isSuccess && queryCart.data) {
      setCarts(() => queryCart.data.carts);
    }
  });

  const increaseQuantity = (
    cartId: number,
    itemId: number,
    productId: number
  ) => {
    let newQty = 0;
    let updatedSubtotal = "";

    setCarts((c) =>
      c.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.map((item) => {
                if (item.id === itemId && item.quantity < item.maxStock) {
                  const newQty = item.quantity + 1;
                  const updatedSubtotal = parseFloat(
                    (item.price * newQty).toFixed(2)
                  );
                  return {
                    ...item,
                    quantity: newQty,
                    subtotal: updatedSubtotal,
                  } satisfies CartItemDto; // optional, for stronger type guarantee
                }
                return item;
              }),
            }
          : cart
      )
    );

    if (newQty > 0) {
      debouncedUpdate(productId, newQty);
    }
  };

  const decreaseQuantity = (
    cartId: number,
    itemId: number,
    productId: number
  ) => {
    let newQty = 0;
    let updatedSubtotal = "";
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.map((item) => {
                if (item.id === itemId && item.quantity > 1) {
                  const newQty = item.quantity - 1;
                  const updatedSubtotal = parseFloat(
                    (item.price * newQty).toFixed(2)
                  );
                  return {
                    ...item,
                    quantity: newQty,
                    subtotal: updatedSubtotal,
                  } satisfies CartItemDto;
                }
                return item;
              }),
            }
          : cart
      )
    );

    if (newQty > 0) {
      debouncedUpdate(productId, newQty);
    }
  };

  const getCartSubTotal = createMemo(() => {
    return carts
      .flatMap((cart) => cart.items)
      .filter((item) => selectedItems[item.id]) // hanya item tercentang
      .reduce((total, item) => total + item.subtotal, 0);
  });

  const getTaxTotal = 2000;
  const getCartTotal = createMemo(() => {
    return getCartSubTotal() + getTaxTotal;
  });
  const breadcrumbs = createMemo(() => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    return segments;
  });
  return (
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <button
        class="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow-sm"
        onClick={() => history.back()}
      >
        ← Kembali
      </button>
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
        <p class="text-gray-600">Review and checkout your items</p>
      </header>
      <Show when={queryCart.isLoading}>
        <div class="text-center text-gray-500">Loading cart...</div>
      </Show>
      <Show when={queryCart.isError}>
        <div class="text-center text-red-500">Failed to load cart data</div>
      </Show>
      <Show when={queryCart.isSuccess && carts.length === 0}>
        <div class="text-center text-gray-500">Your cart is empty.</div>
      </Show>
      <Show when={queryCart.isSuccess && carts.length > 0}>
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/3">
            <div class="bg-white rounded-lg shadow-sm">
              <div class="hidden md:grid grid-cols-12 bg-gray-100 p-4 text-gray-600 font-medium">
                <div class="col-span-1"></div>
                <div class="col-span-4">Product</div>
                <div class="col-span-2 text-center">Price</div>
                <div class="col-span-3 text-center">Quantity</div>
                <div class="col-span-2 text-right">Subtotal</div>
              </div>

              <div>
                <For each={carts}>
                  {(cart) => (
                    <For each={cart.items}>
                      {(item) => (
                        <div
                          class="border-b border-gray-200 p-4 grid grid-cols-2 md:grid-cols-12 gap-4 items-center"
                          data-id={item.id}
                        >
                          <div class="col-span-2 md:col-span-5 flex items-center space-x-4">
                            <input
                              type="checkbox"
                              class="form-checkbox h-5 w-5 text-blue-600"
                              checked={selectedItems[item.id] || false}
                              onInput={(e) =>
                                setSelectedItems(
                                  item.id,
                                  e.currentTarget.checked
                                )
                              }
                            />
                            <Link
                              to="/products/$product"
                              params={{ product: item.productTitle }}
                              search={{ id: item.productId }}
                            >
                              <img
                                src={item.productThumbnail}
                                alt={item.productTitle}
                                class="w-20 h-20 object-cover rounded"
                              />
                            </Link>
                            <div>
                              <h3 class="font-medium text-gray-800">
                                {item.productTitle}
                              </h3>
                              <p class="text-sm text-gray-500">
                                Store: {item.storeName || "-"}
                              </p>
                              <button
                                class="text-xs text-gray-400 hover:text-red-500 mt-1"
                                onClick={() =>
                                  removeCartHandle(cart.id, item.id)
                                }
                              >
                                <i class="fas fa-trash mr-1"></i> Remove
                              </button>
                            </div>
                          </div>

                          <div class="col-span-1 md:col-span-2 text-center text-gray-600">
                            {formatToRupiah(item.price)}
                          </div>
                          <div class="col-span-2 md:col-span-3 flex items-center justify-center">
                            <div class="flex items-center border border-gray-300 rounded-md">
                              <button
                                disabled={item.quantity === 1}
                                class="px-3 py-1"
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    cart.id,
                                    item.id,
                                    item.productId
                                  )
                                }
                              >
                                -
                              </button>
                              <input
                                class="w-10 text-center border-0"
                                value={item.quantity}
                                type="number"
                                name={`quantity-${item.id}`}
                                id={`quantity-${item.id}`}
                              />
                              <button
                                disabled={item.quantity >= item.maxStock}
                                class="px-3 py-1"
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    cart.id,
                                    item.id,
                                    item.productId
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div class="col-span-1 md:col-span-2 text-right font-medium">
                            {formatToRupiah(item.subtotal)}
                          </div>
                        </div>
                      )}
                    </For>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div class="lg:w-1/3">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              <div class="bg-gray-100 p-4">
                <h2 class="font-medium text-lg text-gray-800">Order Summary</h2>
              </div>

              <div class="p-4 text-gray-700 space-y-3">
                <div class="flex justify-between text-sm text-gray-500">
                  <span>Selected Items</span>
                  <span>
                    {Object.values(selectedItems).filter(Boolean).length}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatToRupiah(getCartSubTotal())}</span>
                </div>
                <div class="flex justify-between">
                  <span>Admin Fee</span>
                  <span>{formatToRupiah(getTaxTotal)}</span>
                </div>
                <div class="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatToRupiah(getCartTotal())}</span>
                </div>
                <Link
                  to="/order/checkout"
                  search={{
                    cartItemIds: selectedForCheckout(),
                  }}
                >
                  <button class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
