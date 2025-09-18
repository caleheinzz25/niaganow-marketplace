import { Link } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

export const SideBarStore = () => {
  return (
    <>
      {/* <!-- Sidebar --> */}
      <div class="hidden md:flex md:flex-shrink-0">
        <div class="flex flex-col w-64 gradient-bg text-white">
          <div class="flex items-center justify-center h-16 px-4">
            <div class="flex items-center">
              <i class="fas fa-store mr-2 text-2xl"></i>
              <span class="text-xl font-bold">Ezy Shop</span>
            </div>
          </div>
          <div class="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav class="flex-1 space-y-2">
              <Link
                to="/store/dashboard"
                class="sidebar-item flex items-center px-4 py-3 rounded-lg text-white hover:bg-white hover:opacity-90"
                activeProps={{
                  class: "bg-white/20",
                }}
              >
                <i class="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </Link>
              <Link
                to="/store/products"
                class="sidebar-item flex items-center px-4 py-3 rounded-lg text-white hover:bg-white hover:opacity-90"
                activeProps={{
                  class: "bg-white/20",
                }}
              >
                <i class="fas fa-box-open mr-3"></i>
                Products
              </Link>
              <Link
                to="/store/orders"
                class="sidebar-item flex items-center px-4 py-3 rounded-lg text-white hover:bg-white hover:opacity-90"
              >
                <i class="fas fa-list-alt mr-3"></i>
                Orders
              </Link>
              <a
                href="#"
                class="sidebar-item flex items-center px-4 py-3 rounded-lg text-white hover:bg-white hover:opacity-90"
              >
                <i class="fas fa-cog mr-3"></i>
                Settings
              </a>
            </nav>
            <div class="mt-auto pb-4">
              <div class="px-4 py-3 rounded-lg bg-white/20 hover:opacity-90 flex items-center">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium">Sarah Johnson</p>
                  <p class="text-xs opacity-90">Premium Seller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SideBarStore1 = ({
  role,
  storeName,
}: {
  role: string | null;
  storeName: string | undefined;
}) => {
  const [selected, setSelected] = createSignal("");
  const [storeNav, setStoreNav] = createStore([
    {
      id: "/store/dashboard",
      name: "Dashboard",
      icon: "fas fa-tachometer-alt",
      color: "text-blue-500",
    },
    {
      id: "/store/orders",
      name: "Orders",
      icon: "fas fa-shopping-cart",
      color: "text-blue-500",
    },
    {
      id: "/store/products",
      name: "Products",
      icon: "fas fa-box",
      color: "text-blue-500",
    },
    // { name: "Stores", icon: "fas fa-store-alt", color: "text-blue-500" },
    // { name: "Customers", icon: "fas fa-users", color: "text-blue-500" },
  ]);

  const [adminNav, setAdminNav] = createSignal([
    {
      id: "/admin/dashboard",
      name: "Dashboard",
      icon: "fas fa-tachometer-alt", // Dashboard icon
      color: "text-blue-500",
    },
    {
      id: "/admin/transactions",
      name: "Transactions",
      icon: "fas fa-shopping-cart", // Transactions icon
      color: "text-blue-500",
    },
    {
      id: "/admin/products",
      name: "Products",
      icon: "fas fa-box", // Products icon
      color: "text-blue-500",
    },
    {
      id: "/admin/users",
      name: "Users",
      icon: "fas fa-users", // Users icon
      color: "text-blue-500",
    },
    {
      id: "/admin/stores",
      name: "Stores",
      icon: "fas fa-store", // Stores icon
      color: "text-blue-500",
    },
  ]);

  return (
    <>
      {/* <!-- Sidebar --> */}
      <div class="print:hidden sidebar bg-white w-48 border-r min-w-48 border-gray-200 flex flex-col overflow-y-auto">
        <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div class="flex items-center">
            <i class="fas fa-store text-blue-500 text-2xl mr-2"></i>
            <span class="text-xl font-bold">
              {role === "ADMIN" ? "Admin" : storeName}
            </span>
          </div>
        </div>

        <div class="px-4 py-6">
          {/* <div class="mb-6">
                      <div class="relative">
                          <input type="text" placeholder="Search..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                      </div>
                  </div> */}

          <div>
            {/* <p class="text-xs uppercase font-semibold text-gray-500 mb-3">MAIN</p> */}
            <ul>
              <ul>
                <For each={role === "ADMIN" || role === "SUPER_ADMIN" ? adminNav() : storeNav}>
                  {(nav) => (
                    <li class="mb-1">
                      <Link
                        to={nav.id}
                        activeProps={{
                          class: "bg-gray-100",
                        }}
                        class="menu-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      >
                        <i class={`${nav.icon} mr-3 ${nav.color}`}></i>
                        {nav.name}
                      </Link>
                    </li>
                  )}
                </For>
              </ul>
            </ul>

            {/* <p class="text-xs uppercase font-semibold text-gray-500 mb-3 mt-6">ANALYTICS</p>
                      <ul>
                          <li class="mb-1">
                              <a href="#" class="menu-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
                                  <i class="fas fa-chart-line mr-3 text-blue-500"></i>
                                  Reports
                              </a>
                          </li>
                          <li class="mb-1">
                              <a href="#" class="menu-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
                                  <i class="fas fa-chart-pie mr-3 text-blue-500"></i>
                                  Insights
                              </a>
                          </li>
                      </ul>
                      
                      <p class="text-xs uppercase font-semibold text-gray-500 mb-3 mt-6">SETTINGS</p>
                      <ul>
                          <li class="mb-1">
                              <a href="#" class="menu-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
                                  <i class="fas fa-cog mr-3 text-blue-500"></i>
                                  Settings
                              </a>
                          </li>
                          <li class="mb-1">
                              <a href="#" class="menu-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50">
                                  <i class="fas fa-user-shield mr-3 text-blue-500"></i>
                                  Admin
                              </a>
                          </li>
                      </ul> */}
          </div>
        </div>

        <div class="mt-auto px-4 py-3 border-t border-gray-200">
          <div class="flex items-center">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User"
              class="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p class="font-medium">Sarah Johnson</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
