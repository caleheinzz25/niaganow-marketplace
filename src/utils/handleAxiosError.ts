// src/utils/handleAxiosError.ts
import axios, { AxiosError } from "axios";
import { AlertType } from "~/types/alert";
import { AuthContextType } from "~/types/auth";
import type { ErrorResponse } from "~/types/errorResponse";

export function handleAxiosError(
  error: AxiosError,
  context: AuthContextType,
  timeOut?: number,
  type: AlertType = "success"
): void {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as ErrorResponse | undefined;

    // 🔒 Jika 401 Unauthorized, refresh token/session

    // 🛠️ Tampilkan error yang direspons
    if (data) {
      context.showAlert(type, data.message, timeOut);
      data.errors?.forEach((err) => context.showAlert(type, err, timeOut));
    } else {
      console.error("Axios error without structured response:", error.message);
    }
    if (status === 401) {
      console.warn("401 Unauthorized – refreshing session.");
      context.refresh?.(); // Opsional chaining jika context.refresh tidak wajib
      return; // Hentikan eksekusi lebih lanjut setelah refresh
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
