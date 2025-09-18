import { queryOptions } from "@tanstack/solid-query";
import axios from "axios";
import type { Address } from "~/types/address"; // Sesuaikan path jika berbeda

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/address",
  headers: {
    "Content-Type": "application/json",
  },
});

interface AddressRequest {
  authToken: string;
  address: Address;
}

interface AddressResponse {
  address: Address;
}

interface AddressesResponse {
  addresses: Address[];
}

export async function fetchAddresses(
  authToken: string
): Promise<AddressesResponse> {
  const response = await api.get("", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
}

export function getAddresses(authToken: string) {
  return queryOptions({
    queryKey: ["addresses"],
    queryFn: () => fetchAddresses(authToken),
  });
}

export async function registerAddress({
  address,
  authToken,
}: AddressRequest): Promise<void> {
  try {
    const response = await api.post("", address, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Alamat berhasil didaftarkan:", response.data);
  } catch (error: any) {
    console.error(
      "Gagal mendaftarkan alamat:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateDefaultAddress({
  addressId,
  authToken,
}: {
  addressId: number;
  authToken: string;
}): Promise<void> {
  try {
    const response = await api.put(
      `/${addressId}/default`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log("Alamat berhasil diperbarui:", response.data);
  } catch (error: any) {
    console.error(
      "Gagal memperbarui alamat:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function deleteAddress({
  addressId,
  authToken,
}: {
  addressId: number;
  authToken: string;
}): Promise<void> {
  try {
    const response = await api.delete(`/${addressId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("Alamat berhasil diperbarui:", response.data);
  } catch (error: any) {
    console.error(
      "Gagal memperbarui alamat:",
      error.response?.data || error.message
    );
    throw error;
  }
}
