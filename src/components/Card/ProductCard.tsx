import { Link } from "@tanstack/solid-router";
import slugify from "slugify";
import { CardProduct } from "~/types/product";
import { formatToRupiah } from "~/utils/Format";

interface Props {
  product: CardProduct;
}

export const ProductCard = ({ product }: Props) => {
  const slug = slugify(product.title, { lower: true, strict: true });
  return (
    <>
      {/* <!-- Product --> */}
      <Link
        to="/products/$product"
        params={{
          product: slug,
        }}
        search={{
          id: product.id,
        }}
      >
        <div
          class="product-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer flex flex-col h-[420px]" // fixed height
          data-category={product.category}
          data-price={product.price}
          data-rating={product.rating}
          data-availability="in-stock"
        >
          {/* <!-- Image --> */}
          <div class="relative">
            <div class="h-60 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* <!-- Product details --> */}
          <div class="flex flex-col justify-between flex-grow p-5">
            {/* <!-- Brand & title --> */}
            <div class="mb-2">
              <p class="text-xs text-gray-400 font-medium line-clamp-1">
                {product.category}
              </p>
              <h3 class="text-lg font-normal text-gray-800 mt-1 line-clamp-2">
                {product.title}
              </h3>
            </div>

            {/* <!-- Rating --> */}
            <div class="flex items-center mb-3 gap-1">
              <div class="flex text-amber-400 text-xs">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
              <span class="text-xs text-gray-400 ml-1">({product.rating})</span>
            </div>

            {/* <!-- Price --> */}
            <div class="flex items-center justify-between pt-2 border-t border-gray-100">
              <span class="text-xl font-semibold text-gray-900">
                {formatToRupiah(product.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  stock: number;
  enabled: boolean;
}

interface ProductsCardProps {
  product: Product;
}

export default function ProductCard1({ product }: ProductsCardProps) {
  return (
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img
              class="h-10 w-10 rounded"
              src={product.thumbnail}
              alt={product.title}
            />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">{product.title}</div>
            <div class="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">{formatToRupiah(product.price)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">{product.stock}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.enabled
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.enabled ? "Active" : "Disabled"}
        </span>
      </td>
    </tr>
  );
}
