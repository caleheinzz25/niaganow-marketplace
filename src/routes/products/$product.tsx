import { useMutation, useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/solid-router";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Basic } from "~/BreadCrumb/Basic";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { ProductCard } from "~/components/Card/ProductCard";
import { addCart } from "~/queryFn/fetchCarts";
import { getProduct, getProductsByCategory } from "~/queryFn/fetchProducts";
import { Product } from "~/types/product";
import { productIdSearchParam } from "~/types/searchParam";
import { formatToRupiah } from "~/utils/Format";

export const Route = createFileRoute("/products/$product")({
  validateSearch: (search: Record<string, unknown>): productIdSearchParam => {
    return {
      id: Number(search.id),
    };
  },
  component: RouteComponent,
  beforeLoad: async ({ search }) => {
    return {
      search,
    };
  },
  loader: async ({ context }) => {
    const clientQuery = context.clientQuery;
    clientQuery.prefetchQuery(getProduct(context.search));
  },
});

function RouteComponent() {
  const search = Route.useSearch()();
  const context = Route.useRouteContext()();
  const [quantity, setQuantity] = createSignal(0);
  const [primaryImg, setPrimaryImg] = createSignal("");
  const productQuery = useQuery(() => getProduct(search));
  const [product, setProduct] = createStore<Product>({
    id: 0,
    title: "",
    description: "",
    category: "",
    price: 0,
    rating: 0,
    stock: 0,
    tags: [],
    brand: "",
    sku: "",
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "",
    reviews: [],
    returnPolicy: "",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "",
      updatedAt: "",
      barcode: "",
      qrCode: "",
    },
    images: [],
    thumbnail: "",
    enabled: false
  });

  const mutate = useMutation(() => ({
    mutationKey: ["addCart", product.id],
    mutationFn: addCart,
  }));

  const productsByCategory = useQuery(() =>
    productQuery.isSuccess
      ? getProductsByCategory(9, productQuery.data.category)
      : getProductsByCategory(9, "")
  );

  const handlePrimaryImg = (e: MouseEvent) => {
    const imgSrc = (e.currentTarget as HTMLImageElement).src;
    setPrimaryImg(imgSrc);
  };

  const handleAddCart = () => {
    mutate.mutate({
      accessToken: context.token() || "",
      item: {
        productId: product.id,
        quantity: quantity(),
      },
    });
  };

  createEffect(() => {
    if (productQuery.isSuccess && productQuery.data) {
      setProduct(productQuery.data);
      console.log(product);
      console.log(productQuery.data);
    }
  });

  const { location } = useRouterState()();
  return (
    <>
      {/* <!-- Main Product Section --> */}
      <main class="container mx-auto px-4 py-12">
        <Switch>
          <Match when={productQuery.isPending}>
            <BounceLoading />
          </Match>
          <Match when={productQuery.isError}>error</Match>
          <Match when={productQuery.isSuccess}>
            <Basic path={location.href} />
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* <!-- Product Images --> */}
              <div class="space-y-6 fade-in">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    id="mainImage"
                    src={primaryImg() || product?.images[0]}
                    alt={product?.title}
                    class="w-full h-96 object-contain"
                  />
                </div>
                <div class="grid grid-cols-4 gap-3">
                  <For each={product?.images}>
                    {(img, index) => (
                      <div class="gallery-thumbnail cursor-pointer border-2 border-transparent hover:border-primary-500 rounded-lg overflow-hidden">
                        <img
                          src={img}
                          onclick={(e) => handlePrimaryImg(e)}
                          class="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* <!-- Product Info --> */}
              <div class="fade-in" style="animation-delay: 0.2s;">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">
                  {product?.title}
                </h1>
                <div class="flex items-center mb-4">
                  <Switch>
                    <Match when={product?.rating === undefined}>
                      <div class="flex text-yellow-400">
                        <i class="fas fa-star text-gray-300"></i>
                        <i class="fas fa-star text-gray-300"></i>
                        <i class="fas fa-star text-gray-300"></i>
                        <i class="fas fa-star text-gray-300"></i>
                        <i class="fas fa-star text-gray-300"></i>
                      </div>
                      <span class="ml-2 text-gray-600">{product?.rating}</span>
                    </Match>
                    <Match
                      when={
                        typeof product?.rating === "number" &&
                        product!.rating! > 0
                      }
                    >
                      <div class="flex text-yellow-400">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                      </div>
                      <span class="ml-2 text-gray-600">{product?.rating}</span>
                    </Match>
                  </Switch>
                </div>
                <div class="mb-6">
                  <span class="text-3xl font-bold text-gray-900">
                    {formatToRupiah(product.price)}
                  </span>
                </div>
                <div class="mb-6">
                  <p class="text-gray-700">{product?.description}</p>
                </div>

                {/* <!-- Quantity --> */}
                <div class="mb-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Quantity
                  </h3>
                  <div class="flex items-center">
                    <button
                      class="bg-gray-200 hover:bg-gray-300 rounded-l-lg p-2"
                      onclick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <i class="fas fa-minus"></i>
                    </button>

                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product?.stock ?? 10}
                      class="w-16 text-center bg-gray-100 border-t border-b border-gray-200 py-2"
                      value={quantity()}
                      onInput={(e) => {
                        const val = parseInt(e.currentTarget.value, 10);
                        if (!isNaN(val)) {
                          const stock = product?.stock ?? 10;
                          setQuantity(Math.max(1, Math.min(val, stock)));
                        }
                      }}
                    />

                    <button
                      class="bg-gray-200 hover:bg-gray-300 rounded-r-lg p-2"
                      onclick={() =>
                        product && quantity() < product.stock
                          ? setQuantity(quantity() + 1)
                          : null
                      }
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {/* <!-- Add to Cart --> */}
                <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                  <button
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center pulse-animation"
                    onClick={handleAddCart}
                  >
                    <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                  </button>
                </div>

                {/* <!-- Features List --> */}
                <div class="bg-gray-50 rounded-lg p-5 mb-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-flag text-blue-600 mt-1 mr-3.5"></i>
                      <div>
                        <h4 class="font-medium">Brand</h4>
                        <p class="text-sm text-gray-600">{product?.brand}</p>
                      </div>
                    </div>
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-battery-full text-blue-600 mt-1"></i>
                      <div>
                        <h4 class="font-medium">Weight</h4>
                        <p class="text-sm text-gray-600">{product?.weight}</p>
                      </div>
                    </div>
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-truck text-blue-600 mt-1"></i>
                      <div>
                        <h4 class="font-medium">Shipping</h4>
                        <p class="text-sm text-gray-600">
                          {product?.shippingInformation}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-shield-alt text-blue-600 mt-1"></i>
                      <div>
                        <h4 class="font-medium">
                          {product?.warrantyInformation}
                        </h4>
                        <p class="text-sm text-gray-600">Guaranteed quality</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Payment Options --> */}
                {/* <div class="border-t border-gray-200 pt-4">
                  <h3 class="text-sm font-medium text-gray-900 mb-2">
                    Secure Payment
                  </h3>
                  <div class="flex space-x-4">
                    <i class="fab fa-cc-visa text-gray-600 text-2xl"></i>
                    <i class="fab fa-cc-mastercard text-gray-600 text-2xl"></i>
                    <i class="fab fa-cc-amex text-gray-600 text-2xl"></i>
                    <i class="fab fa-cc-paypal text-gray-600 text-2xl"></i>
                    <i class="fab fa-cc-apple-pay text-gray-600 text-2xl"></i>
                  </div>
                </div> */}
              </div>
            </div>
          </Match>
        </Switch>
      </main>

      {/* <!-- Related Products --> */}
      <section class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">
            You May Also Like
          </h2>
          {/* <!-- Products Grid --> */}

          <Switch>
            <Match when={productsByCategory.isPending}>
              <BounceLoading />
            </Match>
            <Match when={productsByCategory.isSuccess}>
              <div
                id="products-grid"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                <For each={productsByCategory?.data?.products}>
                  {(product, index) => (
                    <>
                      {/* <!-- Product --> */}
                      <ProductCard product={product} />
                    </>
                  )}
                </For>
              </div>
            </Match>
          </Switch>
        </div>
      </section>
    </>
  );
}





























const Tabs = () => {
  const [tab, setTab] = createSignal(0);

  return (
    <>
      {/* <!-- Product Details Tabs --> */}
      <div class="mt-16 fade-in" style="animation-delay: 0.4s;">
        <div class="border-b border-gray-200">
          <nav class="flex flex-col sm:flex-row -mb-px">
            <button
              class="tab-button py-4 px-6 border-b-2 font-medium text-sm"
              classList={{
                "text-blue-600 border-blue-600": tab() === 0,
                "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300":
                  tab() !== 0,
              }}
              onClick={() => setTab(0)}
            >
              Description
            </button>
            <button
              class="tab-button py-4 px-6 border-b-2 font-medium text-sm"
              classList={{
                "text-blue-600 border-blue-600": tab() === 1,
                "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300":
                  tab() !== 1,
              }}
              onClick={() => setTab(1)}
            >
              Specifications
            </button>
            <button
              class="tab-button py-4 px-6 border-b-2 font-medium text-sm"
              classList={{
                "text-blue-600 border-blue-600": tab() === 2,
                "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300":
                  tab() !== 2,
              }}
              onClick={() => setTab(2)}
            >
              Reviews
            </button>
            <button
              class="tab-button py-4 px-6 border-b-2 font-medium text-sm"
              classList={{
                "text-blue-600 border-blue-600": tab() === 3,
                "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300":
                  tab() !== 3,
              }}
              onClick={() => setTab(3)}
            >
              Support
            </button>
          </nav>
        </div>
      </div>
      {/* <!-- Tab Contents --> */}
      <div class="py-8">
        <Switch>
          <Match when={tab() === 0}>
            {/* <!-- Description Tab --> */}
            <div id="description" class="tab-content active">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Premium Sound Quality
                  </h3>
                  <p class="text-gray-700 mb-4">
                    The SoundScape Pro delivers an unparalleled listening
                    experience with our proprietary 40mm drivers that reproduce
                    a full range of frequencies with incredible clarity and
                    depth. Whether you're a music lover, gamer, or frequent
                    caller, you'll hear every detail.
                  </p>
                  <p class="text-gray-700">
                    Our advanced acoustic platform combines cutting-edge digital
                    signal processing with premium materials to deliver balanced
                    audio across all volume levels. Experience deep bass, clear
                    mids, and sparkling highs without distortion.
                  </p>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Next-Gen Comfort
                  </h3>
                  <p class="text-gray-700 mb-4">
                    Designed for prolonged use, the SoundScape Pro features
                    memory foam ear cushions wrapped in soft, breathable protein
                    leather. The adjustable headband ensures a perfect fit while
                    minimizing pressure points for all-day comfort.
                  </p>
                  <h4 class="font-medium text-gray-900 mt-6 mb-2">
                    What's in the Box
                  </h4>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>SoundScape Pro Headphones</li>
                    <li>Premium Hard-shell Carrying Case</li>
                    <li>1.5m Audio Cable (3.5mm)</li>
                    <li>USB-C Charging Cable</li>
                    <li>Quick Start Guide</li>
                    <li>Warranty Information</li>
                  </ul>
                </div>
              </div>
            </div>
          </Match>

          <Match when={tab() === 1}>
            {/* <!-- Specifications Tab --> */}
            <div id="specs" class="tab-content">
              <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="specs-scroll overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Model
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          SSP-2023
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Weight
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          245g (without cable)
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Driver Type
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          40mm dynamic with Neodymium magnets
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Frequency Response
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          5Hz - 40kHz
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Impedance
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          32Ω
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Sensitivity
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          108dB SPL/mW
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Battery Life
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          Up to 30 hours (ANC on)
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Charging Time
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          2 hours (USB-C)
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Wireless
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          Bluetooth 5.3, 10m range
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          Water Resistance
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                          IPX4 (splash resistant)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Match>

          <Match when={tab() === 2}>
            {/* <!-- Reviews Tab --> */}
            <div id="reviews" class="tab-content">
              <div class="space-y-8">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h4 class="font-bold text-lg text-gray-900">
                        Excellent Sound Quality
                      </h4>
                      <div class="flex items-center mt-1">
                        <div class="flex text-yellow-400">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                        <span class="ml-2 text-sm text-gray-600">
                          Verified Purchase • 2 days ago
                        </span>
                      </div>
                    </div>
                    <span class="text-gray-500 text-sm mt-2 md:mt-0">
                      Alex R.
                    </span>
                  </div>
                  <p class="text-gray-700">
                    These headphones exceeded my expectations! The noise
                    cancellation is fantastic - I can't hear any office noise
                    when I'm working. The sound is crisp and balanced, with deep
                    but not overpowering bass. Battery life is as advertised.
                    Very comfortable even during long calls.
                  </p>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h4 class="font-bold text-lg text-gray-900">
                        Great Value for Money
                      </h4>
                      <div class="flex items-center mt-1">
                        <div class="flex text-yellow-400">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span class="ml-2 text-sm text-gray-600">
                          Verified Purchase • 1 week ago
                        </span>
                      </div>
                    </div>
                    <span class="text-gray-500 text-sm mt-2 md:mt-0">
                      Sarah K.
                    </span>
                  </div>
                  <p class="text-gray-700">
                    I compared several brands in this price range and these came
                    out on top. The build quality feels premium, and they look
                    more expensive than they are. Battery life could be a bit
                    better, but quick charge makes up for it. The carrying case
                    is sturdy and provides good protection.
                  </p>
                </div>

                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h4 class="font-bold text-lg text-gray-900">
                        Perfect for Travel
                      </h4>
                      <div class="flex items-center mt-1">
                        <div class="flex text-yellow-400">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                        <span class="ml-2 text-sm text-gray-600">
                          Verified Purchase • 3 weeks ago
                        </span>
                      </div>
                    </div>
                    <span class="text-gray-500 text-sm mt-2 md:mt-0">
                      Michael T.
                    </span>
                  </div>
                  <p class="text-gray-700">
                    Used these on a 10-hour flight and they were amazing. The
                    noise cancellation made the plane engine sound almost
                    silent. Comfortable enough to wear the entire flight without
                    irritation. They also folded nicely into my backpack. Highly
                    recommended for frequent travelers!
                  </p>
                </div>
              </div>
            </div>
          </Match>
          <Match when={tab() === 3}>
            {/* <!-- Support Tab --> */}
            <div id="support" class="tab-content">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Contact Support
                  </h3>
                  <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="space-y-4">
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-phone-alt text-blue-600 mr-2"></i>{" "}
                          Phone Support
                        </h4>
                        <p class="text-gray-700">
                          1-800-555-0199 (Mon-Fri, 9AM-6PM EST)
                        </p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-envelope text-blue-600 mr-2"></i>{" "}
                          Email Support
                        </h4>
                        <p class="text-gray-700">
                          support@soundscape.com (response within 24hrs)
                        </p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-comment-alt text-blue-600 mr-2"></i>{" "}
                          Live Chat
                        </h4>
                        <p class="text-gray-700">
                          Available through our mobile app or website (Mon-Fri,
                          9AM-5PM EST)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Warranty & Returns
                  </h3>
                  <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="space-y-4">
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-shield-alt text-blue-600 mr-2"></i>{" "}
                          Warranty
                        </h4>
                        <p class="text-gray-700">
                          All SoundScape Pro headphones come with a 2-year
                          limited warranty covering manufacturing defects.
                        </p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-exchange-alt text-blue-600 mr-2"></i>{" "}
                          Returns
                        </h4>
                        <p class="text-gray-700">
                          30-day hassle-free returns. Items must be in original
                          condition with all accessories.
                        </p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 mb-2">
                          <i class="fas fa-tools text-blue-600 mr-2"></i>{" "}
                          Repairs
                        </h4>
                        <p class="text-gray-700">
                          Our authorized service centers provide repairs during
                          and after warranty period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </>
  );
};
