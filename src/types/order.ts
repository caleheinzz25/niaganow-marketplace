export const TRANSACTION_STATUS_TAGS = [
  {
    transactionStatus: "PENDING",
    colorClass: "bg-gray-500 text-white",
    label: "Pending Payment",
  },
  {
    transactionStatus: "REQUIRES_ACTION",
    colorClass: "bg-yellow-500 text-white",
    label: "Action Required",
  },
  {
    transactionStatus: "SUCCEEDED",
    colorClass: "bg-green-600 text-white",
    label: "Payment Successful",
  },
  {
    transactionStatus: "FAILED",
    colorClass: "bg-red-600 text-white",
    label: "Payment Failed",
  },
  {
    transactionStatus: "CANCELED",
    colorClass: "bg-gray-400 text-white",
    label: "Canceled",
  },
  {
    transactionStatus: "EXPIRED",
    colorClass: "bg-orange-600 text-white",
    label: "Expired",
  },
];

export const ORDER_STATUS_TAGS = [
  {
    orderStatus: "PAID",
    colorClass: "bg-green-600 text-white",
    label: "Paid",
  },
  {
    orderStatus: "CANCELED",
    colorClass: "bg-gray-400 text-white",
    label: "Canceled",
  },
  {
    orderStatus: "PROCESSING",
    colorClass: "bg-blue-500 text-white",
    label: "Processing",
  },
  {
    orderStatus: "SHIPPED",
    colorClass: "bg-indigo-600 text-white",
    label: "Shipped",
  },
  {
    orderStatus: "DELIVERED",
    colorClass: "bg-teal-600 text-white",
    label: "Delivered",
  },
  {
    orderStatus: "PENDING_PAYMENT",
    colorClass: "bg-yellow-500 text-white",
    label: "Pending Payment",
  },
  {
    orderStatus: "EXPIRED",
    colorClass: "bg-orange-600 text-white",
    label: "Expired",
  },
];
