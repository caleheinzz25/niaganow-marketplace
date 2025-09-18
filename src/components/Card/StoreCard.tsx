import { Store } from "~/types/store";
import { dateFormat } from "~/utils/Format";

export const StoreRow = ({ store }: { store: Store }) => {
  return (
    <tr class="hover:bg-gray-50 cursor-pointer">
      {/* Store Name */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">{store.storeName}</div>
      </td>

      {/* Store Email */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">{store.storeEmail || "-"}</div>
      </td>

      {/* Contact Phone */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">{store.contactPhone || "-"}</div>
      </td>

      {/* Store Type */}
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-gray-900 capitalize">{store.storeType}</span>
      </td>

      {/* Status (Active/Inactive) */}
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            store.enabled
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {store.enabled ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
};