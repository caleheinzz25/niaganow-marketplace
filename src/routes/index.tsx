import { useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  useMatch,
  useMatches,
} from "@tanstack/solid-router";
import createEmblaCarousel from "embla-carousel-solid";
import { use } from "marked";
import { For } from "solid-js";
import { Footer } from "~/components/Footer";
import { ProductCard } from "~/components/Card/ProductCard";
import { getProducts } from "~/queryFn/fetchProducts";
import { CardProduct, Product } from "~/types/product";

const observer = new IntersectionObserver(() => {});

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getProducts({ limit: 12, order: "asc", pageIndex: 1 })
    );
  },
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const queryProducts = useQuery(() =>
    getProducts({ limit: 12, order: "asc", pageIndex: 1 })
  );
  return (
    <>
      {/* <!-- Hero Section --> */}
      <section
        class="hero-parallax  h-screen-fit bg-cover bg-center relative"
        style={{ "background-image": "url('/img/hero.png')" }}
      >
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative h-full flex items-center">
          <div class="max-w-3xl mx-auto text-center px-4 text-white animate-fadeIn">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Elevate Your Everyday
            </h1>
            <p class="text-xl md:text-2xl mb-8">
              Discover handpicked, premium products that transform your daily
              routine into a luxurious experience.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                class="px-8 py-3 bg-primary-500 hover:bg-primary-400 rounded-md font-medium transition-colors duration-200"
                search={{
                  limit: 9,
                  pageIndex: 1,
                  order: "asc",
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- New Arrivals --> */}
      <section class="grid py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-4">
        {/* <!-- Top section spanning all columns --> */}
        <div class="col-span-full mb-12">
          <div class="flex justify-between items-center">
            <h2 class="text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/products"
              search={{
                limit: 9,
                pageIndex: 1,
                order: "asc",
              }}
              class="text-primary-500 hover:text-primary-400 font-medium flex items-center"
            >
              View all <i class="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>

        {/* <!-- Products grid - 4 columns that can extend infinitely --> */}
        <div class="flex flex-wrap justify-center gap-6 col-span-full">
          <For each={queryProducts.data?.products}>
            {(product: CardProduct) => (
              <div class="flex-grow basis-[240px] max-w-[260px]">
                <ProductCard product={product} />
              </div>
            )}
          </For>
        </div>
      </section>
      <Footer />
    </>
  );
}
