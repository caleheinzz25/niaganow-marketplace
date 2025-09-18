import { Link } from "@tanstack/solid-router";
import { Show } from "solid-js";

interface Props {
  fullName: string | undefined;
  role: string | null;
}

export const SideBarProfile = ({ fullName, role }: Props) => {
  return (
    <>
      {/* <!-- Sidebar --> */}
      <div class="w-full md:min-w-64 md:w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
        <div class="flex flex-col items-center mb-8">
          <img
            class="h-24 w-24 rounded-full mb-4 object-cover border-4 border-blue-100"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User profile"
          />

          <h3 class="font-semibold text-gray-800 text-xl">{fullName}</h3>

          {/* <span class="text-xs px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full mt-2">
                  Premium Member
                </span> */}
        </div>
        <ul class="space-y-2">
          <li>
            <Link
              to="/account/my-orders"
              class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
              <i class="fas fa-box-open mr-3"></i>
              My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/account/address"
              class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
              <i class="fas fa-map-marker-alt mr-3"></i>
              Address Book
            </Link>
          </li>
          {/* <li>
                  <Link
                    to="/account/payment"
                    class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
                  >
                    <i class="fas fa-credit-card mr-3"></i>
                    Payment Methods
                  </Link>
                </li> */}
          <li>
            <Link
              to="/account/setting"
              class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
              <i class="fas fa-cog mr-3"></i>
              Account Settings
            </Link>
          </li>
          <li>
            <Link
              to={role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/dashboard" : "/store/dashboard"}
              class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
              <i class="fas fa-shop mr-3"></i>
              {role === "ADMIN" || role === "SUPER_ADMIN" ? "Admin" : "Store"}
            </Link>
          </li>
          <li>
            <Link
              to="/auth/logout"
              class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-medium"
            >
              <i class="fas fa-sign-out-alt mr-3"></i>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
