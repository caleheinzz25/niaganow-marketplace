import { Link } from "@tanstack/solid-router";
import { createMemo, type Component } from "solid-js";

type InteractiveBreadcrumbProps = {
  path: string; // contoh: "/products/smartphones"
};

export const Basic: Component<InteractiveBreadcrumbProps> = ({ path }) => {
  const cleanPath = createMemo(() => path.split("?")[0]);
  // Split berdasarkan '/'
  const segments = createMemo(() => cleanPath().split("/").filter(Boolean));

  const buildHref = (index: number) =>
    "/" +
    segments()
      .slice(0, index + 1)
      .join("/");

  return (
    <div class="mb-8">
      <div class="flex items-center space-x-2 text-sm">
        <Link
          to="/"
          class="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Home
        </Link>
        {segments().map((segment, idx) => (
          <>
            <span class="text-gray-400">
              <i class="fas fa-chevron-right" />
            </span>
            {idx === segments().length - 1 ? (
              <span class="text-gray-500">
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            ) : (
              <Link
                to={buildHref(idx)}
                class="text-indigo-600 hover:text-indigo-800 hover:underline"
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
