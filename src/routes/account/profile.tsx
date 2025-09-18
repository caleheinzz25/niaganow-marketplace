import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link, redirect } from "@tanstack/solid-router";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { getProfile, Profile, ProfileResponse } from "~/queryFn/postAuthUser";
import dayjs from "dayjs";

export const Route = createFileRoute("/account/profile")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.clientQuery.prefetchQuery(getProfile());
  },
});

function RouteComponent() {
  let queryProfile = useQuery(() => getProfile());

  const [profile, setProfile] = createSignal<Profile>();

  createEffect(() => {
    if (queryProfile.isSuccess) {
      setProfile(queryProfile.data.profile);
    }
    console.log(profile());
    if (queryProfile.isError) {
    }
  });

  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex-1  space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          {/* <!-- Profile Overview --> */}
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">
              Profile Overview
            </h2>
            <Link
              to="/account/setting"
              class="text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
            >
              Edit Profile
            </Link>
          </div>

          <Switch>
            <Match when={queryProfile.isSuccess}>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p class="mt-1 text-gray-800">{profile()?.fullName}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      Email Address
                    </label>
                    <p class="mt-1 text-gray-800">{profile()?.email}</p>
                  </div>
                  {/* <div>
                      <label class="block text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p class="mt-1 text-gray-800">+1 (555) 123-4567</p>
                    </div> */}
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      Join Date
                    </label>
                    <p class="mt-1 text-gray-800">
                      {dayjs(profile()?.createdAt || "").format("DD MMM YYYY")}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p class="mt-1 text-gray-800">{profile()?.phoneNumber}</p>
                  </div>
                  {/* <div>
                      <label class="block text-sm font-medium text-gray-500">
                        Member Status
                      </label>
                      <p class="mt-1 text-gray-800">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Premium Member
                        </span>
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">
                        Loyalty Points
                      </label>
                      <p class="mt-1 text-gray-800">1,250 points</p>
                    </div> */}
                </div>
              </div>
            </Match>
          </Switch>
        </div>

        {/* <!-- Recent Orders --> */}
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order #
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
                    Items
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-78945
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    May 12, 2023
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3 items
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $145.99
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">
                      View
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-67834
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 28, 2023
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1 item
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $59.99
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Shipped
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">
                      Track
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-56723
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 15, 2023
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5 items
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $210.50
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">
                      Reorder
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* <!-- Current Order Status --> */}
        {/* <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">
            Current Order Status
          </h2>

          <div class="order-status space-y-8 relative">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center z-10">
                <i class="fas fa-check text-xs"></i>
              </div>
              <div class="ml-4 pt-1">
                <h4 class="text-sm font-medium text-blue-600">
                  Order Confirmed
                </h4>
                <p class="text-sm text-gray-500 mt-1">
                  Your order has been placed successfully
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  May 20, 2023 at 02:45 PM
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full border-4 border-white active-status flex items-center justify-center z-10">
                <i class="fas fa-truck text-xs"></i>
              </div>
              <div class="ml-4 pt-1">
                <h4 class="text-sm font-medium text-blue-600">Shipped</h4>
                <p class="text-sm text-gray-500 mt-1">
                  Your order is on its way to you
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Estimated delivery: May 25, 2023
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center z-10"></div>
              <div class="ml-4 pt-1">
                <h4 class="text-sm font-medium text-gray-600">
                  Out for Delivery
                </h4>
                <p class="text-sm text-gray-500 mt-1">
                  Waiting for delivery confirmation
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center z-10"></div>
              <div class="ml-4 pt-1">
                <h4 class="text-sm font-medium text-gray-600">Delivered</h4>
                <p class="text-sm text-gray-500 mt-1">
                  Waiting for delivery confirmation
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <!-- Wishlist -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-gray-800">
                    My Wishlist
                  </h2>
                  <a
                    href="#"
                    class="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All
                  </a>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <!-- Wishlist Item -->
                  <div class="wishlist-item relative group bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="absolute top-3 right-3 wishlist-actions flex gap-2">
                      <button class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <i class="fas fa-times"></i>
                      </button>
                      <button class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                        <i class="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                    <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src="https://m.media-amazon.com/images/I/71S8qt+K8yL._AC_UF894,1000_QL80_.jpg"
                        alt="Product"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <h3 class="text-gray-800 font-medium line-clamp-1">
                      Wireless Headphones Bluetooth 5.0 with Mic
                    </h3>
                    <div class="mt-2 flex items-center text-yellow-400">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star-half-alt"></i>
                      <span class="text-gray-500 text-sm ml-1">(128)</span>
                    </div>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-lg font-bold text-gray-800">
                        $59.99
                      </span>
                      <span class="text-sm line-through text-gray-400">
                        $79.99
                      </span>
                    </div>
                  </div>

                  <!-- Wishlist Item -->
                  <div class="wishlist-item relative group bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="absolute top-3 right-3 wishlist-actions flex gap-2">
                      <button class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <i class="fas fa-times"></i>
                      </button>
                      <button class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                        <i class="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                    <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src="https://rukminim1.flixcart.com/image/832/832/xif0q/mobile/u/1/o/-original-imaggjzufw8rgsge.jpeg"
                        alt="Product"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <h3 class="text-gray-800 font-medium line-clamp-1">
                      Smartphone 128GB RAM 6GB Dual Camera
                    </h3>
                    <div class="mt-2 flex items-center text-yellow-400">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="far fa-star"></i>
                      <span class="text-gray-500 text-sm ml-1">(256)</span>
                    </div>
                    <div class="mt-2 flex items-center justify-between">
                      <span class="text-lg font-bold text-gray-800">
                        $299.99
                      </span>
                      <span class="text-sm text-green-600">25% OFF</span>
                    </div>
                  </div>
                </div>
              </div> */}
      </div>
    </>
  );
}
