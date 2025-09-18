import { useMutation } from "@tanstack/solid-query";
import {
  createFileRoute,
  useMatches,
  useNavigate,
} from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { postLogoutUser } from "~/queryFn/postAuthUser";
import { SuccessResponse } from "~/types/successReponse";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";

export const Route = createFileRoute("/auth/logout")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [showSuccessModal, setShowSuccessModal] = createSignal(false);
  const [isLoggingOut, setIsLoggingOut] = createSignal(false);

  const navigate = useNavigate();

  const mutate = useMutation(() => ({
    mutationFn: postLogoutUser,
    onSuccess: (message: SuccessResponse) => {
      context.setRole(null);
      context.setToken(null);
    },
    onError: (err) => {
      console.log("error", err)
    },
  }));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulasikan logout async (misal fetch/logout)
    mutate.mutate();
    await new Promise((res) => setTimeout(res, 2000));
    setIsLoggingOut(false);
    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate({
      to: "/auth/login",
    });
    // Redirect atau navigasi bisa ditambahkan di sini
  };

  return (
    <>
      <div class="flex justify-center h-screen-fit items-center">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden modal-animation">
          <div class="flex flex-col items-center p-8 text-center">
            {/* Icon animasi */}
            <div class="relative mb-6">
              <div class="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center relative">
                <div class="absolute inset-0 border-4 border-red-100 rounded-full animate-ping opacity-75"></div>
                <i class="fas fa-sign-out-alt text-4xl text-red-500 relative z-10"></i>
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mb-2">Are you sure?</h2>
            <p class="text-gray-600 mb-6">
              You're about to log out of your account. Any unsaved changes might
              be lost.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => history.back()}
                class="flex-1 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <i class="fas fa-arrow-left"></i> Stay logged in
              </button>

              <button
                onClick={handleLogout}
                class="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoggingOut()}
              >
                <i class="fas fa-sign-out-alt"></i>{" "}
                {isLoggingOut() ? "Logging out..." : "Log out"}
              </button>
            </div>

            <div class="mt-8 text-xs text-gray-400 flex items-center gap-2">
              <i class="fas fa-lock"></i>
              <span>We'll keep your session secure until you return</span>
            </div>
          </div>

          {/* Progress bar */}
          {isLoggingOut() && (
            <div class="h-1 bg-gradient-to-r from-blue-500 to-indigo-500">
              <div class="h-full w-full bg-red-500 animate-pulse duration-1000"></div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl p-8 max-w-sm w-full text-center modal-animation">
            <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-check-circle text-green-500 text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              Logged out successfully!
            </h2>
            <p class="text-gray-600 mb-6">
              You've been securely logged out of your account.
            </p>
            <button
              onClick={closeModal}
              class="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
