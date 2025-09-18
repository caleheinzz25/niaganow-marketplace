import {
  QueryOptions,
  queryOptions,
  MutateOptions,
} from "@tanstack/solid-query";
import axios from "axios";
import { Search } from "lucide-solid";
import type {
  Product,
  Products,
  Category,
  ProductsCard,
  CardProduct,
  CategoryCheck,
} from "~/types/product";
import { productIdSearchParam, shopSearchParams } from "~/types/searchParam";
import { SuccessResponse } from "~/types/successReponse";

// Tipe untuk dimensi produk
export async function fetchAllProducts({
  limit = 9,
  order = "asc",
  pageIndex = 1,
  sortBy = "",
  q,
  categories = [], // array
  select = [],
}: shopSearchParams): Promise<ProductsCard> {
  const skip = (pageIndex - 1) * limit;

  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("skip", skip.toString());
  params.set("sortBy", sortBy || "");
  params.set("order", order || "");

  if (q) params.set("q", q);
  if (select.length > 0) params.set("select", select.join(","));
  if (categories.length > 0) params.set("category", categories.join(","));

  const res = await axios.get(
    `https://niaganow.site/backend/api/v1/products?${params.toString()}`
  );
  return res.data;
}

export function getProducts(searchParam: shopSearchParams) {
  return queryOptions({
    queryKey: [
      "products",
      searchParam.pageIndex,
      searchParam.limit,
      searchParam.q,
      searchParam.order,
    ],
    queryFn: () => {
      return fetchAllProducts(searchParam);
    },
    staleTime: 10_000, // selalu dianggap stale
  });
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await axios.get(`https://niaganow.site/backend/api/v1/products/${id}`);
  return res.data;
}

export function getProduct({ id }: productIdSearchParam) {
  return queryOptions({
    queryKey: ["product", id],
    queryFn: () => {
      return fetchProduct(id);
    },
  });
}

export async function fetchProductsByStoreId(
  authToken: string,
  limit: number
): Promise<Product[]> {
  const res = await axios.get(
    `https://niaganow.site/backend/api/v1/products/limit/${limit}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return res.data;
}

export function getProductsByStoreId(authToken: string, limit: number = 5) {
  return queryOptions({
    queryKey: ["product", limit],
    queryFn: () => {
      return fetchProductsByStoreId(authToken, limit);
    },
  });
}

export async function delProductByProductId({
  authToken,
  productId,
}: {
  authToken: string;
  productId: number;
}): Promise<SuccessResponse> {
  const res = await axios.delete(
    `https://niaganow.site/backend/api/v1/products/store/${productId}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return res.data;
}

export async function enableProductByProductId({
  authToken,
  productId,
}: {
  authToken: string;
  productId: number;
}): Promise<SuccessResponse> {
  const res = await axios.post(
    `https://niaganow.site/backend/api/v1/products/store/${productId}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return res.data;
}

export async function fetchProductByCategory(
  limit: number,
  category: string
): Promise<ProductsCard> {
  const res = await axios.get(
    `https://niaganow.site/backend/api/v1/products?category=${category}&limit=${limit}`
  );
  return res.data;
}

export function getProductsByCategory(limit: number, category: string) {
  return queryOptions({
    queryKey: ["product", limit, category],
    queryFn: () => {
      return fetchProductByCategory(limit, category);
    },
    staleTime: Infinity,
  });
}

export async function postProduct({
  authToken,
  product,
}: {
  authToken: string;
  product: Product;
}): Promise<SuccessResponse> {
  const res = await axios.post(
    "https://niaganow.site/backend/api/v1/products/add",
    product,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return res.data;
}

export async function putProduct({
  authToken,
  product,
}: {
  authToken: string;
  product: Product;
}): Promise<SuccessResponse> {
  const res = await axios.put(
    `https://niaganow.site/backend/api/v1/products/update/${product.id}`,
    product,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return res.data;
}

export async function fetchCategories(): Promise<CategoryCheck[]> {
  const res = await axios.get(
    "https://niaganow.site/backend/api/v1/products/categories"
  );
  const data: string[] = await res.data;
  const result = data.map((item) => ({
    name: item,
    checked: false,
  })) as CategoryCheck[];
  // if (res.data) {
  //   for (let i = 0; i < res.data.length; i++) {
  //     const amount = await axios.get(
  //       `https://dummyjson.com/products/category/${res.data[i].slug}?select=title`
  //     );
  //     console.log(amount);
  //     data.map((item) => ({ ...item, amount: amount.data.total }));
  //   }
  // }
  return result;
}

export function getCategories() {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: () => {
      return fetchCategories();
    },
    staleTime: Infinity,
  });
}
