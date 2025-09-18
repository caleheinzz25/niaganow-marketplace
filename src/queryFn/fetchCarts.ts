import { queryOptions } from "@tanstack/solid-query";
import axios from "axios";

interface CartItemInputDto {
  id?: number;
  productId?: number;
  quantity?: number;
}
export interface CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  total: string; // BigDecimal → string
  checkedOut: boolean;
  createdAt: string; // LocalDateTime → ISO string
  updatedAt: string; // LocalDateTime → ISO string
}
// CartItemDto.ts
export interface CartItemDto {
  id: number;
  productId: number;
  productTitle: string;
  productThumbnail: string;
  productSku: string;
  price: number; // BigDecimal → string
  quantity: number;
  subtotal: number; // BigDecimal → string
  maxStock: number;
  storeName?: string; // opsional
}

export interface CartsDto {
  carts: CartDto[];
}

interface CartInputDto {
  item: CartItemInputDto;
  accessToken: string;
}

const api = axios.create({
  baseURL: "https://niaganow.site/backend/api/v1/cart",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function addCart({
  item,
  accessToken,
}: CartInputDto): Promise<void> {
  try {
    const response = await api.post<CartDto>("/items", item, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    console.error("Failed to add to cart:", error);
    throw error?.response?.data || error;
  }
}

export async function getCarts(accessToken: string): Promise<CartsDto> {
  try {
    const response = await api.get("", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch cart data:", error);
    throw error?.response?.data || error;
  }
}
export async function getCartsByItemIds(
  accessToken: string | null,
  cartItemIds: number[]
): Promise<CartsDto> {
  try {
    const response = await api.get("", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { cartItemIds },
      paramsSerializer: (params) =>
        (params.cartItemIds as number[])
          .map((id) => `cartItemIds=${id}`)
          .join("&"),
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch carts by item IDs:", error);
    throw error?.response?.data || new Error("Unknown error occurred");
  }
}

export function queryGetCartsByItemIds(
  accessToken: string | null,
  cartItemIds: number[]
) {
  return queryOptions({
    queryKey: ["carts", cartItemIds],
    queryFn: () => getCartsByItemIds(accessToken, cartItemIds),
    staleTime: Infinity,
  });
}

export function queryGetCarts(accessToken: string) {
  return queryOptions({
    queryKey: ["carts"],
    queryFn: () => getCarts(accessToken),
  });
}

export async function removeCartItem({
  item,
  accessToken,
}: CartInputDto): Promise<void> {
  try {
    await api.delete(`/items/${item.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    console.error(`Failed to remove cart item: ${item.id}`, error);
    throw error?.response?.data || error;
  }
}

export async function increaseQuantity(
  cartItemId: number,
  amount: number,
  accessToken: string
): Promise<CartDto> {
  try {
    const response = await api.patch<CartDto>(
      `/items/${cartItemId}/increase`,
      null,
      {
        params: { amount },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to increase quantity for cartItemId=${cartItemId}`,
      error
    );
    throw error?.response?.data || error;
  }
}
