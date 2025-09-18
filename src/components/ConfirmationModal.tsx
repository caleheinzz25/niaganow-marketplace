import { createSignal, onCleanup, onMount } from 'solid-js';

export const ConfirmationModal = ()=> {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [showToast, setShowToast] = createSignal(false);

  let toastTimeout: number;
  let progressTimeout: number;

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const confirmAction = () => {
    setIsProcessing(true);
    progressTimeout = window.setTimeout(() => {
      setIsProcessing(false);
      closeModal();
      showToastNotification();
    }, 2000);
  };

  const showToastNotification = () => {
    setShowToast(true);
    toastTimeout = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  onCleanup(() => {
    clearTimeout(toastTimeout);
    clearTimeout(progressTimeout);
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter') confirmAction();
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    onCleanup(() => window.removeEventListener('keydown', handleKeydown));
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <button
        class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        onClick={openModal}
      >
        Delete Account
      </button>

      {isOpen() && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            class="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur transition-opacity animate-fade-in"
            onClick={closeModal}
          ></div>

          <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
            <div class="p-6 border-b border-gray-200 flex items-start">
              <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <i class="fas fa-exclamation text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Are you sure?</h3>
                <div class="mt-1 text-gray-500">
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </div>
              </div>
            </div>
            <div
              class="h-1 bg-indigo-100 transition-all duration-500"
              style={{ width: isProcessing() ? '100%' : '0%' }}
            ></div>

            <div class="px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 sm:gap-4 bg-gray-50">
              <button
                class="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center"
                onClick={confirmAction}
                disabled={isProcessing()}
              >
                {isProcessing() ? (
                  <><i class="fas fa-spinner fa-spin mr-2"></i>Deleting...</>
                ) : (
                  <><i class="fas fa-trash-alt mr-2"></i>Delete Account</>
                )}
              </button>
              <button
                class="w-full sm:w-auto px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast() && (
        <div class="fixed bottom-4 right-4 z-50 max-w-xs w-full bg-green-50 border border-green-200 rounded-lg shadow-lg overflow-hidden">
          <div class="p-4 flex items-start">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Success!</h3>
              <p class="mt-1 text-sm text-green-600">Account deleted successfully</p>
            </div>
          </div>
          <div class="h-1 bg-green-200 relative">
            <div class="absolute top-0 left-0 h-full bg-green-500 w-full toast-progress transition-all duration-[3s]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

