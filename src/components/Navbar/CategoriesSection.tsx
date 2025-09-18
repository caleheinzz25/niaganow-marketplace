import { Link } from "@tanstack/solid-router";
import { Search } from "lucide-solid";

interface Props {
  showCategories: () => boolean;
}

export const CategorySection = ({ showCategories }: Props) => {
  return (
    <>

      {/* Categories Section */}
      <div
        class={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-4  ${
          showCategories() ? "max-h-40 py-4" : "max-h-0"
        } bg-gray-50 px-8`}
      >

        <ul class="flex gap-8 text-gray-600 overflow-auto font-semibold">
          <li>
            <Link
              class="hover:text-slate-800"
              to="/category/$categoryId"
              params={{ categoryId: "electronics" }}
            >
              Electronics
            </Link>
          </li>
          <li>
            <Link
              class="hover:text-slate-800"
              to="/category/$categoryId"
              params={{ categoryId: "fashion" }}
            >
              Fashion
            </Link>
          </li>
          <li>
            <Link
              class="hover:text-slate-800"
              to="/category/$categoryId"
              params={{ categoryId: "smartphones" }}
            >
              Smartphones
            </Link>
          </li>
          <li>
            <Link
              class="hover:text-slate-800"
              to="/category/$categoryId"
              params={{ categoryId: "beauty" }}
            >
              Beauty
            </Link>
          </li>
          <li>
            <Link
              class="hover:text-slate-800"
              to="/category/$categoryId"
              params={{ categoryId: "sports" }}
            >
              Sports
            </Link>
          </li>
        </ul>
                
        {/* Search Bar */}
        <div class="flex-1 flex md:hidden justify-center">
          <div class="relative w-2/3">
            <input
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 pr-12 border placeholder:text-slate-200 hover:placeholder:text-primary-300 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            />
            <button
              class="absolute right-[0.8rem] top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 hover:scale-125 transition duration-300"
              aria-label="Search"
            >
              <Search class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
