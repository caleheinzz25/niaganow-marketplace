import { queryOptions } from "@tanstack/solid-query";
import axios from "axios";
import { StoreRegistrationForm } from "~/types/auth";
import { Store } from "~/types/store";
import { SuccessResponse } from "~/types/successReponse";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  fullName: string;
  terms: boolean;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  accessToken: string;
  role: string;
}

export interface RegisterResponse {
  username: string;
  accessToken: string;
  role: string;

  // tambahkan field jika backend Anda mendukung (misal: roles, avatar)
}

export interface Profile {
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt?: string;
}

export interface ProfileResponse {
  profile: Profile;
}

// Konfigurasi axios instance (opsional, agar DRY)
const api = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/auth",
  withCredentials: true, // penting untuk cookie HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

const api2 = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/store",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fungsi login
export async function postLoginUser(
  input: LoginInput
): Promise<SuccessResponse> {
  const res = await api.post("/login", input);
  return res.data;
}

// Fungsi register
export async function postRegisterUser(
  input: RegisterInput
): Promise<SuccessResponse> {
  const res = await api.post<SuccessResponse>("/register", input);
  return res.data;
}

export async function postLogoutUser(): Promise<SuccessResponse> {
  const res = await api.post("/logout");
  return res.data;
}

export async function fetchProfileUser(): Promise<ProfileResponse> {
  const res = await api.get("/profile");
  return res.data;
}

export async function putProfileUser(input: Profile): Promise<Profile> {
  console.log(input);
  const res = await api.put<Profile>("/profile", input);
  return res.data;
}

export function getProfile() {
  return queryOptions({
    queryKey: ["profile"],
    queryFn: () => {
      return fetchProfileUser();
    },
    staleTime: Infinity,
  });
}

export async function registerSeller({
  authToken,
  store,
}: {
  authToken: string;
  store: StoreRegistrationForm;
}) {
  const res = await api.post("/register/seller", store, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
}

// Store

export async function fetchStoreUser(
  authToken: string
): Promise<Store> {
  const res = await api2.get("", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
}

export function getStoreUSer(authToken: string) {
  return queryOptions({
    queryKey: ["store"],
    queryFn: () => fetchStoreUser(authToken),
  });
}
