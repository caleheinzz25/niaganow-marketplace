import { createFileRoute, useLoaderData } from "@tanstack/solid-router";
import { createEffect, createSignal, For, Show } from "solid-js";
import axios from "axios";

export const Route = createFileRoute("/category/$categoryId/")({
  loader: async ({ params }) => {
    const response = await axios.get(
      `https://dummyjson.com/products/category/${params.categoryId}`
    );
    return response.data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const product: Products = Route.useLoaderData()();

  return (
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <For each={product.products} fallback={<div>Loading products...</div>}>
        {(item) => {
          const [loaded, setLoaded] = createSignal(false);
          const [error, setError] = createSignal(false);

          return (
            <div class="border p-4 rounded shadow">
              <h2 class="text-lg font-semibold mb-2">{item.title}</h2>
              <p class="text-sm text-gray-600 mb-4">{item.description}</p>

              <div class="relative w-full h-48 bg-gray-100 overflow-hidden rounded">
                <Show when={!loaded() && !error()}>
                  <div class="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-200">
                    <span class="text-gray-400 text-sm">Loading image...</span>
                  </div>
                </Show>

                <Show when={error()}>
                  <div class="absolute inset-0 flex items-center justify-center bg-red-100">
                    <span class="text-red-500 text-sm">Image failed</span>
                  </div>
                </Show>

                <img
                  src={item.images[0]}
                  alt={item.title}
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                  class={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    loaded() ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}


// Tipe untuk dimensi produk
type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

// Tipe untuk ulasan produk
interface Review {
  rating: number;
  comment: string;
  date: string; // ISO date string
  reviewerName: string;
  reviewerEmail: string;
}

// Tipe untuk informasi metadata
interface MetaInfo {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  barcode: string;
  qrCode: string;
}

// Tipe utama untuk produk
interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: MetaInfo;
  images: string[];
  thumbnail: string;
}

export interface Products {
  products: Product[];
}
