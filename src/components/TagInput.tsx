import { createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import type { Product } from "~/types/product";

interface Props {
  product: Product;
  setProduct: SetStoreFunction<Product>;
}

export function TagInput({ product, setProduct }: Props) {
  const [inputValue, setInputValue] = createSignal("");

  const addTag = () => {
    const value = inputValue().trim();

    if (product.tags.length >= 10) return;

    if (value && !product.tags.includes(value)) {
      setProduct("tags", [...product.tags, value]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setProduct(
      "tags",
      product.tags.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div class="w-full">
      <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
        {product.tags.map((tag, index) => (
          <span
            accessKey={index.toString()}
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              class="text-lg text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          class="flex-1 min-w-[120px] outline-none"
          placeholder="Add tag and press Enter"
        />
      </div>
      <input type="hidden" name="tags" value={product.tags.join(",")} />
    </div>
  );
}
