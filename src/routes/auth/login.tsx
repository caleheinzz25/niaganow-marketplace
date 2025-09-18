import { useMutation } from "@tanstack/solid-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/solid-router";
import { AxiosError } from "axios";
import { createSignal } from "solid-js";
import { postLoginUser } from "~/queryFn/postAuthUser";
import { SuccessResponse } from "~/types/successReponse";
import { handleAxiosError } from "~/utils/handleAxiosError";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [isError, setIsError] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const navigate = useNavigate();

  const mutation = useMutation(() => ({
    mutationFn: postLoginUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      context.refresh();
      navigate({ to: "/" });
    },
    onError: (error: AxiosError) => {
      setIsError(true);
      handleAxiosError(error, context)
    },
  }));

  const handleLogin1 = async () => {
    mutation.mutate({
      username: username(),
      password: password(),
    });
  };

  return (
    <>
      <div class="flex justify-center items-center h-screen-fit">
        {/* <!-- Main login card --> */}
        <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden smooth-transition focus-scale">
          {/* <!-- Header --> */}
          <div class="px-8 py-6 border-b border-gray-100 fade-in">
            <div class="flex justify-center">
              <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <i class="fas fa-lock text-primary-400 text-xl"></i>
              </div>
            </div>
            <h1 class="text-2xl font-semibold text-center text-gray-800">
              Welcome back
            </h1>
            <p class="text-gray-500 text-center mt-1 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* <!-- Form --> */}
          <div class="px-8 py-6">
            <div id="loginForm" class="space-y-5">
              {/* <!-- Username --> */}
              <div class="space-y-1 fade-in delay-100">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-envelope text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username()}
                    onInput={(e) => {
                      setUsername(e.currentTarget.value), setIsError(false);
                    }}
                    placeholder="username"
                    class="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 outline-none smooth-transition"
                    classList={{
                      "border-red-500": isError(),
                      " border-gray-200 focus:border-primtext-primary-400 focus:ring-1 focus:ring-primtext-primary-400":
                        !isError(),
                    }}
                    autocomplete="username"
                  />
                </div>
              </div>

              {/* <!-- Password --> */}
              <div class="space-y-1 fade-in delay-200">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-lock text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword() ? "text" : "password"}
                    required
                    onInput={(e) => {
                      setPassword(e.currentTarget.value), setIsError(false);
                    }}
                    minlength="8"
                    placeholder="••••••••"
                    class="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 outline-none smooth-transition"
                    classList={{
                      "border-red-500": isError(),
                      " border-gray-200 focus:border-primtext-primary-400 focus:ring-1 focus:ring-primtext-primary-400":
                        !isError(),
                    }}
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    id="togglePassword"
                    onclick={() => setShowPassword(!showPassword())}
                  >
                    <i class="fas fa-eye text-gray-400 hover:text-primary-400 smooth-transition text-sm"></i>
                  </button>
                </div>
              </div>

              {/* <!-- Remember & Forgot --> */}
              <div class="flex items-center justify-between fade-in delay-200">
                <div class="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    class="h-4 w-4 text-primbg-primary-500 focus:ring-primtext-primary-400 border-gray-300 rounded"
                  />
                  <label
                    for="remember"
                    class="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-medium text-primbg-primary-500 hover:text-primary-400 smooth-transition"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* <!-- Submit --> */}
              <button
                type="submit"
                id="submitButton"
                class="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary-500 hover:bg-primary-400 text-white font-medium smooth-transition btn-hover fade-in delay-300"
                onClick={handleLogin1}
              >
                <span id="buttonText">Sign in</span>
                <svg
                  id="loadingSpinner"
                  class="animate-spin ml-2 h-4 w-4 text-white hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>
            </div>

            
          </div>

          {/* <!-- Footer --> */}
          <div class="px-8 py-4 bg-gray-50 text-center fade-in delay-300">
            <p class="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                class="font-medium text-primbg-primary-500 hover:text-primary-400 smooth-transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
