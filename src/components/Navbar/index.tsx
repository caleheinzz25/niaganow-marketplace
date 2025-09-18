import { Link } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { User, ShoppingCart, ChevronDown, LogIn } from "lucide-solid";
import { CategorySection } from "./CategoriesSection";
import { Search } from "lucide-solid";

interface Props {
  appName?: string;
}

export const Navbar = ({ appName }: Props) => {
  const [showCategories, setShowCategories] = createSignal(false);
  const [search, setSearch] = createSignal("");
  return (
    <div class="fixed top-0 z-20 w-full print:hidden">
      <nav class="flex items-center py-6 px-8 justify-between gap-8 bg-white shadow  h-[6vh]">
        {/* Logo */}
        <div class="flex items-center gap-6">
          <Link to="/">
            <h2 class="text-3xl text-primary font-bold">{appName}</h2>
          </Link>
        </div>
        {/* Search Bar */}
        <div class="flex-1 hidden md:flex justify-center">
          <div class="relative w-2/3">
            <input
              type="text"
              placeholder="Search products..."
              onchange={(e) => setSearch(e.target.value)}
              class="w-full px-4 py-2 pr-12 border placeholder:text-slate-200 hover:placeholder:text-primary-300 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            />
            <Link
              to="/products"
              search={{ q: search(), limit: 9, pageIndex: 1, order: "asc" }}
              class="absolute right-[0.8rem] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 hover:scale-125 transition duration-300"
              aria-label="Search"
            >
              <Search class="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Action Items */}
        <div class="flex items-center gap-6">
          <button
            class="hover:text-primary-500 transition"
            onClick={() => setShowCategories((prev) => !prev)}
            aria-label="Toggle Categories"
          >
            <ChevronDown class="w-6 h-6" />
          </button>
          <Link to="/order/cart" class="hover:text-primary-500">
            <ShoppingCart class="w-6 h-6" />
          </Link>
          <Link to="/account/my-orders" class="hover:text-primary-500">
            <User class="w-6 h-6" />
          </Link>
          <Link to="/auth/login" class="hover:text-primary-500">
            <LogIn class="w-6 h-6" />
          </Link>
        </div>
      </nav>

      <CategorySection showCategories={showCategories} />
    </div>
  );
};
