// src/utils/handleAxiosSuccess.ts
import { AlertType } from "~/types/alert";
import { AuthContextType } from "~/types/auth";
import { SuccessResponse } from "~/types/successReponse";

export function handleAxiosSuccess<T extends SuccessResponse>(
  response: T,
  context: AuthContextType,
  timeOut?: number,
  type: AlertType = "success"
): void {
  if (response?.message && context) {
    context.showAlert(type, response.message, timeOut);
  } else {
    console.info("Request succeeded without message:", response);
  }
}
