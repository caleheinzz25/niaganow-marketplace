import { queryOptions } from "@tanstack/solid-query";
import axios from "axios";
import { CartDto } from "./fetchCarts";
import { Order, Transaction } from "~/types/order";

const api = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/orders",
  headers: {
    "Content-Type": "application/json",
  },
});

const api2 = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/transaction",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface OrderStatusTags {
  orderStatus: Order["status"];
  label: string;
  colorClass: string;
}
export interface PaymentStatusTag {
  paymentStatus:
    | "PENDING"
    | "REQUIRES_ACTION"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED"
    | "EXPIRED";
  label: string;
  colorClass: string;
}

  export const ORDER_STATUS_TAGS: OrderStatusTags[] = [
    {
      orderStatus: "PENDING_PAYMENT",
      label: "Pending Payment",
      colorClass: "text-yellow-700 bg-yellow-100",
    },
    {
      orderStatus: "REQUIRES_ACTION",
      label: "Requires Action",
      colorClass: "text-orange-700 bg-orange-100",
    },
    {
      orderStatus: "PAID",
      label: "Paid",
      colorClass: "text-green-700 bg-green-100",
    },
    {
      orderStatus: "FAILED_PAYMENT",
      label: "Failed Payment",
      colorClass: "text-red-700 bg-red-100",
    },
    {
      orderStatus: "CANCELED",
      label: "Cancelled",
      colorClass: "text-red-700 bg-red-100",
    },
    {
      orderStatus: "PROCESSING",
      label: "Processing",
      colorClass: "text-blue-700 bg-blue-100",
    },
    {
      orderStatus: "SHIPPED",
      label: "Shipped",
      colorClass: "text-indigo-700 bg-indigo-100",
    },
    {
      orderStatus: "EXPIRED",
      label: "Expired",
      colorClass: "text-gray-700 bg-gray-100",
    },
    {
      orderStatus: "DELIVERED",
      label: "Delivered",
      colorClass: "text-emerald-700 bg-emerald-100",
    },
  ];
export const PAYMENT_STATUS_TAGS: PaymentStatusTag[] = [
  {
    paymentStatus: "PENDING",
    label: "Pending",
    colorClass: "text-yellow-700 bg-yellow-100",
  },
  {
    paymentStatus: "REQUIRES_ACTION",
    label: "Requires Action",
    colorClass: "text-orange-700 bg-orange-100",
  },
  {
    paymentStatus: "SUCCEEDED",
    label: "Paid",
    colorClass: "text-green-700 bg-green-100",
  },
  {
    paymentStatus: "FAILED",
    label: "Failed",
    colorClass: "text-red-700 bg-red-100",
  },
  {
    paymentStatus: "CANCELED",
    label: "Canceled",
    colorClass: "text-red-700 bg-red-100",
  },
  {
    paymentStatus: "EXPIRED",
    label: "Expired",
    colorClass: "text-gray-700 bg-gray-100",
  },
];

export async function fetchOrders(authToken: string): Promise<Order[]> {
  const res = api.get("", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return (await res).data;
}

export function getOrders(authToken: string) {
  return queryOptions({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(authToken),
    staleTime: 0,
  });
}

export async function fetchOrdersByStoreId(
  authToken: string
): Promise<Order[]> {
  const res = await api.get("/store", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
}

export function getOrdersByStoreId(authToken: string) {
  return queryOptions({
    queryKey: ["orders"],
    queryFn: () => fetchOrdersByStoreId(authToken),
    staleTime: Infinity,
  });
}

export async function fetchOrdersByStoreIdLimit(
  authToken: string,
  limit: number = 5
): Promise<Order[]> {
  const res = await api.get(`/store/${limit}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
}

export function getOrdersByStoreIdLimit(authToken: string) {
  return queryOptions({
    queryKey: ["orders"],
    queryFn: () => fetchOrdersByStoreIdLimit(authToken),
    staleTime: Infinity,
  });
}

export async function fetchOrderByRefId(
  authToken: string,
  ref: string
): Promise<Transaction> {
  const res = api.get(`/${ref}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return (await res).data;
}

export function getOrderByRefId(authToken: string, ref: string) {
  return queryOptions({
    queryKey: ["transaction", ref],
    queryFn: () => fetchOrderByRefId(authToken, ref),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}

export async function fetchTransactionByRefId(
  authToken: string,
  ref: string
): Promise<Transaction> {
  const res = await api2.get(`/${ref}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  console.log(res.data);
  return res.data;
}

export function getTransactionByRefId(authToken: string, ref: string) {
  return queryOptions({
    queryKey: ["transaction", ref],
    queryFn: () => fetchTransactionByRefId(authToken, ref),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
