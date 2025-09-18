import { createMemo } from "solid-js";
import { Transaction, TRANSACTION_STATUS_TAGS } from "~/types/order";
import { dateFormat, formatToRupiah } from "~/utils/Format";

export const TransactionCard = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const transactionStatus = createMemo(() =>
    TRANSACTION_STATUS_TAGS.find(
      (tag) => tag.transactionStatus === transaction.status
    )
  );

  return (
    <tr class="hover:bg-gray-50 cursor-pointer">
      {/* Transaction ID */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-blue-600">
          #{transaction.referenceId}
        </div>
      </td>

      {/* Customer */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">{transaction.userFullName}</div>
        <div class="text-sm text-gray-500">{transaction.userEmail}</div>
      </td>

      {/* Date */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">
          {dateFormat(transaction.createdAt)}
        </div>
      </td>

      {/* Amount */}
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">
          {formatToRupiah(transaction.totalAmount ?? 0)}
        </div>
      </td>

      {/* Status */}
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transactionStatus()?.colorClass}`}
        >
          {transactionStatus()?.label}
        </span>
      </td>
    </tr>
  );
};
