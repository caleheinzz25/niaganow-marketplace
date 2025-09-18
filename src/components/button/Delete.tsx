import { createSignal, createEffect, onCleanup } from "solid-js";

interface Props {
  id: number;
  onDelete: (id: number) => void;
  title?: string;           // Default: "Confirm Deletion"
  description?: string;     // Default: "Are you sure you want to permanently delete this item?"
  warning?: string;         // Default: "This action cannot be undone."
  checkboxLabel?: string;   // Default: "I understand and want to delete permanently"
  confirmLabel?: string;    // Default: "Delete Permanently"
}

export function DeleteConfirmation({
  id,
  onDelete,
  title = "Confirm Deletion",
  description = "Are you sure you want to permanently delete this item?",
  warning = "This action cannot be undone.",
  checkboxLabel = "I understand and want to delete permanently",
  confirmLabel = "Delete Permanently",
}: Props) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isChecked, setIsChecked] = createSignal(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setIsChecked(false);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen()) closeModal();
  };

  createEffect(() => {
    if (isOpen()) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeydown);
    }
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.body.style.overflow = "auto";
  });

  return (
    <>
      <button class="text-red-600 hover:text-red-900 mr-3" onClick={openModal}>
        <i class="fas fa-trash-alt"></i>
      </button>

      {isOpen() && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div class="modal-overlay absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div class="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-[fadeIn_0.3s_ease-out_forwards]">
            {/* Header */}
            <div class="flex items-center justify-between p-4 border-b">
              <div class="flex items-center gap-3">
                <div class="p-3 rounded-full bg-red-100 text-red-600">
                  <i class="fas fa-trash-alt text-xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">
                  {title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                class="text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div class="p-6">
              <p class="text-gray-600 mb-4">{description}</p>

              <div class="flex items-center gap-2 bg-red-50 p-3 rounded-md mb-4">
                <i class="fas fa-exclamation-triangle text-red-500"></i>
                <p class="text-sm text-red-700">
                  Warning: {warning}
                </p>
              </div>

              <div class="mt-4">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="rounded text-red-500 focus:ring-red-500"
                    checked={isChecked()}
                    onChange={(e) => setIsChecked(e.currentTarget.checked)}
                  />
                  <span class="ml-2 text-sm text-gray-700">
                    {checkboxLabel}
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div class="flex flex-col sm:flex-row justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={closeModal}
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-1 sm:flex-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!isChecked()}
                onClick={() => {
                  closeModal();
                  onDelete(id);
                }}
              >
                <i class="fas fa-trash-alt"></i>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
