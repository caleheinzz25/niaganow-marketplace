import { queryOptions } from "@tanstack/solid-query";
import axios from "axios";
import { Transaction } from "~/types/order";
import { Product } from "~/types/product";
import { Store } from "~/types/store";
import { SuccessResponse } from "~/types/successReponse";
import { UserFormData } from "~/types/user";
import { User } from "~/types/User";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

// === Users ===
export async function getUsers(authToken: string): Promise<User[]> {
  const response = await api.get<User[]>(`/users`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

export async function disableUser({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.delete<{ message: string }>(
    `/user/${id}/disable`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

export async function enableUser({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.put<{ message: string }>(
    `/user/${id}/enable`,
    null,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

export async function deleteUser({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.delete<{ message: string }>(`/user/${id}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

// Buat user baru
export async function createUser({
  userData,
  authToken,
}: {
  userData: UserFormData;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.post(`/user`, userData, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

// === Products ===
export async function getProducts(authToken: string): Promise<Product[]> {
  const response = await api.get<Product[]>(`/products`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

export async function disableProduct({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.delete<{ message: string }>(
    `/products/${id}/disable`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

export async function enableProduct({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.put<{ message: string }>(
    `/products/${id}/enable`,
    null,

    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

// === Stores ===
export async function getStores(authToken: string): Promise<Store[]> {
  const response = await api.get<Store[]>(`/stores`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

export async function disableStore({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.delete<{ message: string }>(
    `/stores/${id}/disable`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

export async function enableStore({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}): Promise<SuccessResponse> {
  const response = await api.put<{ message: string }>(
    `/stores/${id}/enable`,
    null,

    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return response.data;
}

// === Transactions ===
export async function getTransactions(
  authToken: string
): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>(`/transactions`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
}

export const getUsersQueryOptions = (authToken: string) =>
  queryOptions({
    queryKey: ["users"],
    queryFn: () => getUsers(authToken),
  });
export const getProductsQueryOptions = (authToken: string) =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => getProducts(authToken),
  });
export const getStoresQueryOptions = (authToken: string) =>
  queryOptions({
    queryKey: ["stores"],
    queryFn: () => getStores(authToken),
  });
export const getTransactionsQueryOptions = (authToken: string) =>
  queryOptions({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(authToken),
  });
