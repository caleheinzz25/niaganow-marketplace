import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { AxiosError } from "axios";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Back } from "~/components/button/Back";
import { TagInput } from "~/components/TagInput";
import { getCategories, postProduct } from "~/queryFn/fetchProducts";
import { Product } from "~/types/product";
import { SuccessResponse } from "~/types/successReponse";
import { handleAxiosError } from "~/utils/handleAxiosError";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";

export const Route = createFileRoute("/store/add-product")({
  component: RouteComponent,
});

interface ImageInfo {
  filename: string;
  url: string;
}

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [tabs, setTabs] = createSignal("basic-info-section");
  const [status, setStatus] = createSignal("Add New Product");
  const queryCategory = useQuery(() => getCategories());

  const productMutate = useMutation(() => ({
    mutationKey: ["product"],
    mutationFn: postProduct,
  }));

  const [product, setProduct] = createStore<Product>({
    id: 0,
    title: "",
    description: "",
    category: "",
    price: 0,
    rating: 0,
    stock: 0,
    tags: ["product"],
    brand: "",
    sku: "",
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "IN_STOCK",
    returnPolicy: "",
    minimumOrderQuantity: 1,
    images: [],
    thumbnail: "",
    enabled: false,
  });

  const handleTabClick = (tab: string) => {
    setTabs(tab);
  };

  const handleAddProduct = () => {
    productMutate.mutate(
      {
        authToken: context.token() || "",
        product: product,
      },
      {
        onSuccess: (data: SuccessResponse) => {
          handleAxiosSuccess(data, context);
        },
        onError: (error: Error) => {
          handleAxiosError(error as AxiosError, context);
        }
      }
    );
  };

  const [uploadedImages, setUploadedImages] = createSignal<ImageInfo[]>([]);
  const [thumbnail, setThumbnail] = createSignal<ImageInfo | null>(null);
  const [errorMsg, setErrorMsg] = createSignal("");
  const uploadImagesMutation = useMutation(() => ({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file); // key harus sama dengan @RequestParam("files")
      });

      const res = await fetch(
        "https://niaganow.site/backend/api/v1/images/upload/images",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      return (await res.json()) as ImageInfo[];
    },
    onSuccess: (data) => {
      setUploadedImages((prev) => [...prev, ...data]);
      data.map((item) => setProduct("images", [...product.images, item.url]));
    },
  }));

  const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      uploadImagesMutation.mutate(files);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setProduct(
      "images",
      product.images.filter((_, i) => i !== index)
    );
  };

  const uploadThumbnailMutation = useMutation(() => ({
    mutationFn: async (file: File) => {
      if (file.size > 300 * 1024) {
        throw new Error("File size exceeds 300 KB");
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "https://niaganow.site/backend/api/v1/images/upload/thumbnail",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Thumbnail upload failed");
      const data: ImageInfo = await res.json(); // Expecting { filename, url }
      return data;
    },
    onSuccess: (data) => {
      setErrorMsg("");
      setThumbnail(data);
      setProduct("thumbnail", data.url);
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
    },
  }));

  const handleThumbnailChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      uploadThumbnailMutation.mutate(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setProduct("thumbnail", "");
  };

  createEffect(() => {
    console.log(product.images);
    console.log(product.thumbnail);
  });
  return (
    <>
      <div class="bg-gray-50 w-full">
        {/* <!-- Main Content --> */}
        <main class="flex-1">
          <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {/* <!-- Page Header --> */}
            <div class="flex justify-between items-center mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <p class="text-gray-600">
                  Fill out the form below to add a new product to your store
                </p>
              </div>
              <Back text="Back To Product" />
            </div>

            {/* <!-- Form Container --> */}
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="p-6">
                {/* <!-- Form Tabs --> */}
                <div class="border-b border-gray-200">
                  <nav class="-mb-px flex space-x-8">
                    <button
                      id="basic-info-tab"
                      onclick={() => handleTabClick("basic-info-section")}
                      class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                        ${tabs() === "basic-info-section" ? "border-indigo-500 text-indigo-600 " : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                      `}
                    >
                      Basic Information
                    </button>
                    <button
                      id="details-tab"
                      onclick={() => handleTabClick("details-section")}
                      class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                        ${tabs() === "details-section" ? "border-indigo-500 text-indigo-600 " : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                      `}
                    >
                      Product Details
                    </button>
                    <button
                      id="media-tab"
                      onclick={() => handleTabClick("media-section")}
                      class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                        ${tabs() === "media-section" ? "border-indigo-500 text-indigo-600 " : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                      `}
                    >
                      Media & Images
                    </button>
                  </nav>
                </div>

                {/* <!-- Form Sections --> */}
                <div id="product-form" class="mt-6">
                  <Switch>
                    <Match when={tabs() === "basic-info-section"}>
                      {/* <!-- Basic Information Tab --> */}
                      <div id="basic-info-section" class="space-y-6">
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div class="sm:col-span-6">
                            <label
                              for="title"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Product Title
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="text"
                                name="title"
                                id="title"
                                value={product.title}
                                onchange={(e) =>
                                  setProduct("title", e.target.value)
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-6">
                            <label
                              for="description"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={product.description}
                                onchange={(e) =>
                                  setProduct("description", e.target.value)
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              ></textarea>
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="brand"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Brand
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="text"
                                name="brand"
                                id="brand"
                                value={product.brand}
                                onchange={(e) =>
                                  setProduct("brand", e.target.value)
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="category"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Category
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <select
                                id="category"
                                name="category"
                                onchange={(e) =>
                                  setProduct("category", e.target.value)
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="beauty" selected>
                                  --- select ---
                                </option>
                                <Show when={queryCategory.isSuccess}>
                                  {queryCategory.data?.map((category) => (
                                    <option value={category.name}>
                                      {category.name}
                                    </option>
                                  ))}
                                </Show>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Match>
                    <Match when={tabs() === "details-section"}>
                      {/* <!-- Product Details Tab --> */}
                      <div id="details-section" class="space-y-6">
                        <div class="flex flex-col gap-2">
                          <div class="sm:col-span-2">
                            <label
                              for="price"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Price ($)
                            </label>
                            <div class="mt-1 relative input-focus-effect rounded-md">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                value={product.price}
                                onchange={(e) =>
                                  setProduct("price", Number(e.target.value))
                                }
                                step="0.01"
                                min="0"
                                class="py-2 pl-7 pr-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-2">
                            <label
                              for="stock"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Stock
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="stock"
                                id="stock"
                                value={product.stock}
                                onchange={(e) =>
                                  setProduct("stock", Number(e.target.value))
                                }
                                min="0"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="sku"
                              class="block text-sm font-medium text-gray-700"
                            >
                              SKU
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="text"
                                name="sku"
                                id="sku"
                                value={product.sku}
                                onchange={(e) =>
                                  setProduct("sku", e.target.value)
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="weight"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Weight (g)
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="weight"
                                id="weight"
                                value={product.weight}
                                onchange={(e) =>
                                  setProduct("weight", Number(e.target.value))
                                }
                                min="0"
                                step="0.01"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-2">
                            <label
                              for="width"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Width (cm)
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="width"
                                id="width"
                                value={product.dimensions.width}
                                onchange={(e) =>
                                  setProduct(
                                    "dimensions",
                                    "width",
                                    Number(e.target.value)
                                  )
                                }
                                min="0"
                                step="0.01"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-2">
                            <label
                              for="height"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Height (cm)
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="height"
                                id="height"
                                value={product.dimensions.height}
                                onchange={(e) =>
                                  setProduct(
                                    "dimensions",
                                    "height",
                                    Number(e.target.value)
                                  )
                                }
                                min="0"
                                step="0.01"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-2">
                            <label
                              for="depth"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Depth (cm)
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="depth"
                                id="depth"
                                value={product.dimensions.depth}
                                onchange={(e) =>
                                  setProduct(
                                    "dimensions",
                                    "depth",
                                    Number(e.target.value)
                                  )
                                }
                                min="0"
                                step="0.01"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="warrantyInformation"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Warranty Information
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="text"
                                name="warrantyInformation"
                                id="warrantyInformation"
                                value={product.warrantyInformation}
                                onchange={(e) =>
                                  setProduct(
                                    "warrantyInformation",
                                    e.target.value
                                  )
                                }
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="minimumOrderQuantity"
                              class="block text-sm font-medium text-gray-700"
                            >
                              Minimum Order Quantity
                            </label>
                            <div class="mt-1 input-focus-effect rounded-md">
                              <input
                                type="number"
                                name="minimumOrderQuantity"
                                id="minimumOrderQuantity"
                                value={product.minimumOrderQuantity}
                                onchange={(e) =>
                                  setProduct(
                                    "minimumOrderQuantity",
                                    Number(e.target.value)
                                  )
                                }
                                min="1"
                                class="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <TagInput
                            setProduct={setProduct}
                            product={product}
                          ></TagInput>
                        </div>
                      </div>
                    </Match>
                    <Match when={tabs() === "media-section"}>
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Gallery Images
                        </label>

                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <For each={uploadedImages()}>
                            {(img, index) => (
                              <div class="relative group">
                                <div class="w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                                  <img
                                    src={img.url}
                                    alt={img.filename}
                                    class="w-full h-full object-cover"
                                  />
                                </div>
                                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index())}
                                    class="p-1 bg-white rounded-full shadow-md text-red-500 hover:text-red-700"
                                  >
                                    <i class="fas fa-trash text-xs"></i>
                                  </button>
                                </div>
                              </div>
                            )}
                          </For>

                          {/* Add new gallery image */}
                          <label
                            for="gallery-upload"
                            class="cursor-pointer flex flex-col items-center justify-center p-4 rounded-md h-40 border border-dashed border-gray-300 hover:bg-gray-50 transition"
                          >
                            <div class="text-center">
                              <i class="fas fa-plus text-2xl text-indigo-500 mb-2"></i>
                              <p class="text-sm text-gray-600">Add Image</p>
                            </div>
                            <input
                              id="gallery-upload"
                              type="file"
                              class="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>

                        <Show when={uploadImagesMutation.isPending}>
                          <p class="text-sm text-gray-500 mt-2">Uploading...</p>
                        </Show>
                        <Show when={uploadImagesMutation.isError}>
                          <p class="text-sm text-red-500 mt-2">
                            Upload failed. Please try again.
                          </p>
                        </Show>
                      </div>
                      <div class="sm:col-span-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Thumbnail Image (Max 300KB)
                        </label>

                        <div class="flex items-center gap-4">
                          <Show
                            when={thumbnail()}
                            fallback={
                              <label
                                for="thumbnail-upload"
                                class="cursor-pointer flex flex-col items-center justify-center p-4 rounded-md w-40 h-40 border border-dashed border-gray-300 hover:bg-gray-50 transition"
                              >
                                <div class="text-center">
                                  <i class="fas fa-plus text-2xl text-indigo-500 mb-2"></i>
                                  <p class="text-sm text-gray-600">
                                    Add Thumbnail
                                  </p>
                                </div>
                                <input
                                  id="thumbnail-upload"
                                  type="file"
                                  accept="image/*"
                                  class="hidden"
                                  multiple
                                  onChange={handleThumbnailChange}
                                />
                              </label>
                            }
                          >
                            <div class="relative group w-40 h-40">
                              <img
                                src={thumbnail()!.url}
                                alt={thumbnail()!.filename}
                                class="w-full h-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={removeThumbnail}
                                class="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-red-500 hover:text-red-700"
                              >
                                <i class="fas fa-trash text-xs"></i>
                              </button>
                            </div>
                          </Show>
                        </div>

                        <Show when={uploadThumbnailMutation.isPending}>
                          <p class="text-sm text-gray-500 mt-2">Uploading...</p>
                        </Show>
                        <Show when={errorMsg()}>
                          <p class="text-sm text-red-500 mt-2">{errorMsg()}</p>
                        </Show>

                        {/* Hidden input to include in form submission */}
                        <input
                          type="hidden"
                          name="thumbnail"
                          value={thumbnail()?.url ?? ""}
                        />
                      </div>
                    </Match>
                  </Switch>
                </div>
              </div>
              <button
                id="addProductBtn"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors m-6"
                onclick={handleAddProduct}
              >
                <i class="fas fa-plus"></i>
                <span>{status()}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
