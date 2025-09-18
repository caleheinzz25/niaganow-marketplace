import { Link } from "@tanstack/solid-router";
import { Index, Match, Switch } from "solid-js";
import { shopSearchParams } from "~/types/searchParam";

interface Props {
  search: shopSearchParams;
}

export const Pagination = ({ search }: Props) => {
    console.log("Pagination", search);
  return (
    <>
      {/* <!-- Pagination --> */}
      <div class="mt-8 flex justify-center">
        <nav
          class="inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <Link
            to="/shop"
            search={{
              limit: search.limit,
              order: search.order,
              pageIndex: search.pageIndex - 1,
              categories: search.categories,
              sortBy: search.sortBy,
            }}
            class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Prev
          </Link>
          {/* <a
                  href="#"
                  class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  1
                </a>
                <a
                  href="#"
                  class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  3
                </a> */}
          <Index
            each={Array.from({ length: search.pageIndex }, (_, i) => i + 1)}
          >
            {(_, index) => {
              const pageIndex = index + 1;
              return (
                <Switch>
                  <Match
                    when={
                      pageIndex !== search.pageIndex &&
                      pageIndex > search.pageIndex - 5
                    }
                  >
                    <Link
                      to="/shop"
                      search={{
                        limit: search.limit,
                        order: search.order,
                        pageIndex: pageIndex,
                        categories: search.categories,
                        sortBy: search.sortBy,
                      }}
                      class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      {pageIndex}
                    </Link>
                  </Match>
                  <Match when={pageIndex === search.pageIndex}>
                    <Link
                      to="/shop"
                      search={{
                        limit: search.limit,
                        order: search.order,
                        pageIndex: pageIndex,
                        categories: search.categories,
                        sortBy: search.sortBy,
                      }}
                      class="px-3 py-2 border border-gray-300 bg-slate-500 text-sm font-medium text-slate-100"
                    >
                      {pageIndex}
                    </Link>
                  </Match>
                </Switch>
              );
            }}
          </Index>
          {(() => {
            const elements = [];

            for (let i = search.pageIndex + 1; i < search.pageIndex + 5; i++) {
              const isCurrent = i === search.pageIndex;

              elements.push(
                <Link
                  to="/shop"
                  search={{
                    limit: search.limit,
                    order: search.order,
                    pageIndex: i,
                    categories: search.categories,
                    sortBy: search.sortBy,
                  }}
                  class={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                    isCurrent
                      ? "bg-slate-500 text-slate-100"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i}
                </Link>
              );
            }

            return elements;
          })()}
          <Link
            to="/shop"
            search={{
              limit: search.limit,
              order: search.order,
              pageIndex: search.pageIndex + 1,
              categories: search.categories,
              sortBy: search.sortBy,
            }}
            class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </Link>
        </nav>
      </div>
    </>
  );
};
