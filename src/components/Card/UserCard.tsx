import { User } from "~/types/User";
import { dateFormat } from "~/utils/Format";

export const UserRow = ({ user }: { user: User }) => {
  return (
    <tr class="hover:bg-gray-50 cursor-pointer">
      {/* Full Name */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">{user.fullName}</div>
      </td>

      {/* Email */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">{user.email}</div>
      </td>

      {/* Phone */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">{user.phoneNumber}</div>
      </td>

      {/* Role */}
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-gray-900 capitalize">{user.role}</span>
      </td>

      {/* Status */}
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {user.enabled ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Created Date */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">
          {user.createdAt ? dateFormat(user.createdAt) : "-"}
        </div>
      </td>
    </tr>
  );
};
