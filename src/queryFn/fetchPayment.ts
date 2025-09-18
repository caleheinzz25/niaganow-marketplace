import axios from "axios";
import { create } from "lodash";
import { CartDto } from "./fetchCarts";
import { Address } from "~/types/address";

const api = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/payments",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PaymentRequest {
  reference_id?: string;
  type?: "PAY" | "PAY_AND_SAVE" | "REUSABLE_PAYMENT_CODE" | "SAVE";
  country?: string;
  currency?: string;
  capture_method?: string;
  channel_code?: string;
  shipping_address: Address;
  channel_properties?: ChannelProperties;
  tax: number;
  shipping_type: string;
  account_balance?: number;
  account_name?: string;
  account_point_balance?: string;
  account_number?: string;
  carts: CartDto[];
  description?: string;
  metadata?: Record<string, any>;
}

export interface ChannelProperties {
  success_return_url?: string;
  failure_return_url?: string;
  cancel_return_url?: string;
  pending_return_url?: string;

  expires_at?: string;
  payer_name?: string;
  display_name?: string;
  payment_code?: string;
  virtual_account_number?: string;
  suggested_amount?: number;
  cash_tag?: string;

  card_details?: CardDetails;
  billing_information?: BillingInformation;
  statement_descriptor?: string;
  recurring_configuration?: RecurringConfiguration;

  account_email?: string;
  account_mobile_number?: string;
  card_last_four?: string;
  card_expiry?: string;
  enable_otp?: boolean;
  allowed_payment_options?: string[];
  redeem_points?: string;
  device_type?: string;
  payer_ip_address?: string;
  skip_three_ds?: boolean;
  card_on_file_type?: string;

  installment_configuration?: InstallmentConfiguration;
}

export interface CardDetails {
  cvn?: string;
  card_number?: string;
  expiry_year?: string;
  expiry_month?: string;
  cardholder_name?: string;
  masked_card_number?: string;
  fingerprint?: string;
  type?: string;
  network?: string;
  country?: string;
  issuer?: string;
}

export interface BillingInformation {
  city?: string;
  country?: string;
  postal_code?: string;
  street_line1?: string;
  street_line2?: string;
  province_state?: string;
}

export interface RecurringConfiguration {
  recurring_expiry?: string;
  recurring_frequency?: number;
}

export interface InstallmentConfiguration {
  terms?: number[];
  interval?: string;
}

export interface PaymentAction {
  type: string;
  descriptor: string;
  value: string;
}

export interface PaymentAction {
  type: string; // ex: "PRESENT_TO_CUSTOMER"
  descriptor: string; // ex: "VIRTUAL_ACCOUNT_NUMBER"
  value: string; // ex: "381659999685556"
}

export interface PaymentResponse {
  payment_request_id: string;
  reference_id: string;
  country: string;
  currency: string;
  business_id: string;
  created: string; // ISO date
  updated: string; // ISO date
  status:
    | "REQUIRES_ACTION"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED"
    | "EXPIRED"
    | "PENDING"; // sesuai enum kamu

  capture_method: "AUTOMATIC" | "MANUAL"; // optional tergantung implementasi
  channel_code: string; // tambahkan sesuai ChannelCode enum kamu

  request_amount: number;

  channel_properties: {
    expires_at?: string; // ISO 8601 with nanoseconds
    display_name: string;
    virtual_account_number?: string;
    succes_return_url?: string;
    failed_return_url?: string;
    cancel_return_url?: string;
  };

  type: "PAY";

  actions: PaymentAction[];

  first_action_type: string;
  first_action_value: string;
  first_action_descriptor: string;
}

interface createPayment {
  authToken: string;
  paymentRequest: PaymentRequest;
}

export async function createPayment({
  authToken,
  paymentRequest,
}: createPayment): Promise<PaymentResponse> {
  const res = api.post(paymentRequest.channel_code!, paymentRequest, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return (await res).data;
}
