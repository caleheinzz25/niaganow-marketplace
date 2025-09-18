import { Query, useQueries, useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  Navigate,
  useRouterState,
} from "@tanstack/solid-router";
import createEmblaCarousel from "embla-carousel-solid";
import {
  createSignal,
  For,
  Index,
  Switch,
  Match,
  createEffect,
  on,
  createMemo,
  onMount,
  onCleanup,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from "~/queryFn/fetchProducts";
import type { CategoryCheck, Product, CardProduct } from "~/types/product";
import { shopSearchParams } from "~/types/searchParam";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { ProductCard } from "~/components/Card/ProductCard";
import { useInView } from "~/utils/LazyLoadObserver";
import { Footer } from "~/components/Footer";
import { Basic } from "~/BreadCrumb/Basic";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): shopSearchParams => {
    const rawOrder = String(search?.order ?? "asc").toLowerCase();
    return {
      limit: Number(search.limit ?? 9),
      pageIndex: Number(search.pageIndex ?? 1),
      categories: Array.isArray(search.categories)
        ? (search.categories as string[])
        : typeof search.categories === "string"
          ? [search.categories]
          : [],
      sortBy: String(search?.sortBy ?? ""),
      order: String(search.order ?? ""),
      select: Array.isArray(search.select)
        ? (search.select as string[])
        : typeof search.select === "string"
          ? [search.select]
          : [],
      q: String(search.q ?? ""),
    };
  },
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    return {
      search,
    };
  },
  loader: ({ context }) => {
    const clientQuery = context.clientQuery;
    clientQuery.prefetchQuery(getProducts(context.search));
    clientQuery.prefetchQuery(getCategories());
  },
});

function RouteComponent() {
  const search = Route.useSearch()();
  // Gunakan query bergantung pada limit
  const [limit, setLimit] = createSignal(search.limit);
  const queryProducts = useQuery(() =>
    getProducts({ ...search, limit: limit() })
  );
  const queryCategories = useQuery(() => getCategories());
  // const [pagination, setPagination] = createSignal(true);
  const [categories, setCategories] = createStore<CategoryCheck[]>([]);
  const [products, setProducts] = createStore<CardProduct[]>([]);
  const checkedSlugs = createMemo(() =>
    categories.filter((c) => c.checked).map((c) => c.name)
  );

  const productsQueries = useQueries(() => ({
    queries: checkedSlugs().map((name) =>
      getProductsByCategory(limit() / checkedSlugs().length, name)
    ),
    combine: (results) => results.map((res) => res),
    staleTime: Infinity,
  }));

  const [emblaRefCategories] = createEmblaCarousel(() => ({
    axis: "y",
    slidesToScroll: 1,
  }));

  const [starCategories, setStarCategories] = createStore([
    {
      upTo: 4,
      checked: false,
    },
    {
      upTo: 3,
      checked: false,
    },
    {
      upTo: 2,
      checked: false,
    },
  ]);

  const unCheckAll = () => {
    categories.forEach((_, index) => {
      setCategories(index, "checked", false);
    });
    starCategories.forEach((_, index) => {
      setStarCategories(index, "checked", false);
    });
  };
  // Setup intersection observer untuk lazy load
  let loaderRef: HTMLDivElement | undefined;
  useInView({
    ref: () => loaderRef,
    callback: () => {
      if (queryProducts.isSuccess && !queryProducts.isPending) {
        setLimit((prev) => {
          if (prev >= 21) {
            return prev;
          }
          return prev + 6;
        });
      }
    },
    rootMargin: "10px",
    threshold: 1,
  });

  // Effect update kategori & produk
  createEffect(() => {
    if (queryCategories.isSuccess) {
      setCategories(queryCategories.data);
    }

    if (queryProducts.isSuccess && limit() > search.limit) {
      setProducts((prev) => {
        const newProducts = queryProducts.data.products;

        // Cek jika item baru tidak duplikat berdasarkan ID atau slug
        const added = newProducts.filter(
          (p) => !prev.some((old) => old.id === p.id)
        );
        return [...prev, ...added];
      });
    }

    if (queryProducts.isSuccess && limit() === search.limit) {
      setProducts(queryProducts.data.products);
    }

    if (productsQueries.some((q) => q.isSuccess)) {
      const newProducts = productsQueries
        .filter((q) => q.isSuccess && q.data?.products)
        .map((q) => q.data?.products)
        .flat();

      if (newProducts.every((p) => p !== undefined)) {
        setProducts(newProducts);
      }
    }
  });
  const { location } = useRouterState()();

  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sticky ">
        {/* <!-- Breadcrumbs --> */}
        <Basic path={location.href} />

        <div class="flex flex-col lg:flex-row gap-8">
          {/* <!-- Filters Sidebar --> */}
          <div class="lg:w-1/4">
            <div class="bg-white rounded-lg shadow-sm p-6 top-4">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-medium">Filters</h2>
                <button
                  id="clear-filters"
                  class="text-sm text-blue-600 hover:text-blue-800 hover:underline "
                  onClick={unCheckAll}
                >
                  Clear all
                </button>
              </div>
              {/* <!-- Categories Filter --> */}
              <div class="mb-6 ">
                <h3 class="text-sm font-medium text-gray-800 mb-3">
                  Categories
                </h3>
                <div class="embla" ref={emblaRefCategories}>
                  <div class="embla__container flex-col h-[40vh]">
                    <Switch>
                      <Match when={queryCategories.isPending}>
                        <BounceLoading />
                      </Match>
                      <Match when={queryCategories.isSuccess}>
                        <For each={categories}>
                          {(category, index) => (
                            <div class="embla__slide_10">
                              <label class="flex items-center filter-option rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                                  data-filter="category"
                                  value="beauty"
                                  checked={category.checked}
                                  onChange={(e) => {
                                    setCategories(
                                      index(),
                                      "checked",
                                      e.currentTarget.checked
                                    );
                                  }}
                                />
                                <span class="ml-3 text-gray-700">
                                  {category.name}
                                </span>
                                {/* <span class="ml-auto text-xs text-gray-500">
                                  ({category.amount})
                                </span> */}
                              </label>
                            </div>
                          )}
                        </For>
                      </Match>
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Products Section --> */}
          <div class="lg:w-3/4">
            {/* <!-- Sorting and View Options --> */}
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div class="mb-4 sm:mb-0">
                <span class="text-sm text-gray-600">
                  Showing <span id="showing-count">{0}</span> of{" "}
                  <span id="total-count">{products.length}</span> products
                </span>
              </div>
            </div>

            {/* <!-- Products Grid --> */}

            <Switch>
              <Match when={products}>
                <div
                  id="products-grid"
                  class="grid grid-cols-2 md:grid-cols-3 gap-6"
                >
                  <For each={products}>
                    {(product) => (
                      <>
                        {/* <!-- Product --> */}
                        <ProductCard product={product} />
                      </>
                    )}
                  </For>
                </div>
              </Match>
            </Switch>
            <Show when={queryProducts.isPending && products.length > 9}>
              <BounceLoading />
            </Show>
            <Show when={limit() >= 21}>
              {/* <!-- Pagination --> */}
              <div class="mt-8 flex justify-center">
                <nav
                  class="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <Link
                    to="/products"
                    search={{
                      limit: limit(),
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
                    each={Array.from(
                      { length: search.pageIndex },
                      (_, i) => i + 1
                    )}
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
                              to="/products"
                              search={{
                                limit: limit(),
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
                              to="/products"
                              search={{
                                limit: limit(),
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

                    for (
                      let i = search.pageIndex + 1;
                      i < search.pageIndex + 5;
                      i++
                    ) {
                      const isCurrent = i === search.pageIndex;

                      if (products.length >= 21) {
                        elements.push(
                          <Link
                            to="/products"
                            search={{
                              limit: limit(),
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
                    }

                    return elements;
                  })()}
                  <Link
                    to="/products"
                    search={{
                      limit: limit(),
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
            </Show>
          </div>
        </div>
      </div>

      {/* Lazy Load */}
      <div ref={loaderRef} class="p-10"></div>

      <Footer />
    </>
  );
}

const PriceRange = () => {
  const [priceRange, setPriceRange] = createSignal("");

  return (
    <>
      {/* <!-- Price Range Filter --> */}
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-800 mb-3">Price Range</h3>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500">$10</span>
          <span class="text-xs text-gray-500">$500</span>
        </div>
        <input
          type="range"
          id="price-range"
          min="10"
          max="500"
          value="500"
          onInput={(e) => setPriceRange(e.target.value)}
          class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div class="text-center mt-2">
          <span id="price-value" class="text-sm font-medium">
            Up to ${priceRange()}
          </span>
        </div>
      </div>
    </>
  );
};
