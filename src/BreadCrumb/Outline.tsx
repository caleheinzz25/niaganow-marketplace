import { Link } from "@tanstack/solid-router";
import { createMemo, type Component } from "solid-js";

type InteractiveBreadcrumbProps = {
  path: string; // contoh: "/products/electronics/smartphones"
};

export const Outline: Component<InteractiveBreadcrumbProps> = ({ path }) => {
  const segments = createMemo(() =>
    path.split("/").filter(Boolean)
  );

  const buildHref = (index: number) =>
    "/" + segments().slice(0, index + 1).join("/");

  return (
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Outline Style</h2>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/"
          class="breadcrumb-item px-3 py-1 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
        >
          Home
        </Link>

        {segments().map((segment, idx) => (
          <>
            <span class="text-gray-400 breadcrumb-separator">
              <i class="fas fa-angle-right" />
            </span>

            {idx === segments().length - 1 ? (
              <span class="breadcrumb-item px-3 py-1 rounded-full border border-gray-200 text-gray-500 bg-gray-50">
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            ) : (
              <Link
                to={buildHref(idx)}
                class="breadcrumb-item px-3 py-1 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

