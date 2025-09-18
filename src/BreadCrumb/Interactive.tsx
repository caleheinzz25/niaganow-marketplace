import { Link } from "@tanstack/solid-router";
import { createMemo, type Component } from "solid-js";

type BreadcrumbProps = {
  path: string; // contoh: "/order/cart"
};

export const Interactive: Component<BreadcrumbProps> = ({ path }) => {
  // Generate segments seperti: ['order', 'cart']
  const segments = createMemo(() =>
    path
      .split("/")
      .filter(Boolean)
  );

  // Gabungkan setiap segment menjadi href bertingkat
  const buildHref = (index: number) =>
    "/" + segments()
      .slice(0, index + 1)
      .join("/");

  return (
    <div class="flex items-center space-x-2 text-sm" id="interactiveBreadcrumb">
      <Link
        to="/"
        class="step-link flex items-center px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
      >
        <span class="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-1">
          <i class="fas fa-home" />
        </span>
        Home
      </Link>

      {segments().map((segment, idx) => (
        <>
          <span class="text-gray-400 breadcrumb-separator">
            <i class="fas fa-angle-right" />
          </span>

          {idx === segments().length - 1 ? (
            <span class="flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
              <span class="w-5 h-5 rounded-full bg-white text-indigo-600 flex items-center justify-center mr-1">
                {idx + 1}
              </span>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </span>
          ) : (
            <Link
              to={buildHref(idx)}
              class="step-link flex items-center px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <span class="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-1">
                {idx + 1}
              </span>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
          )}
        </>
      ))}
    </div>
  );
};
