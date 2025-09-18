import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { getProfile, Profile, putProfileUser } from "~/queryFn/postAuthUser";

export const Route = createFileRoute("/account/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  const matches = Route.useMatch()();

  const [isReadonly, setIsReadonly] = createSignal(true);

  const fadeRef = (el: HTMLElement) => {
    onMount(() => {
      el.style.animationDelay = `0s`;
      el.classList.add("fade-in");
    });
  };

  const toggleReadonly = () => {
    setIsReadonly((prev) => !prev);
  };

  const confirmDanger = (e: MouseEvent) => {
    if (
      !confirm(
        "Are you sure you want to perform this action? This cannot be undone."
      )
    ) {
      e.preventDefault();
    }
  };

  const mutate = useMutation(() => ({
    mutationKey: ["profile"],
    mutationFn: putProfileUser,
    onSuccess: (data) => {
      setProfile(data);
      matches.context.clientQuery.invalidateQueries({
        queryKey: ["profile"],
        exact: true,
      });
    },
  }));

  let queryProfile = useQuery(() => getProfile());

  const [profile, setProfile] = createStore<Profile>({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const handleChangeProfile = () => {
    setProfile;
    mutate.mutate({
      email: profile.email,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
    });
  };

  createEffect(() => {
    if (queryProfile.isSuccess && queryProfile.data?.profile) {
      setProfile(queryProfile.data.profile);
    }

    if (queryProfile.isError) {
    }
  });
  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex-1">
        {/* <!-- Personal Information Card --> */}
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6 fade-in">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>
            <button
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onclick={toggleReadonly}
            >
              <i
                class={
                  isReadonly() ? "fas fa-pencil-alt mr-1" : "fas fa-save mr-1"
                }
              ></i>{" "}
              {isReadonly() ? "Edit" : "Save"}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.fullName}
                onInput={(e) => setProfile("fullName", e.currentTarget.value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readonly={isReadonly()}
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email}
                onInput={(e) => setProfile("email", e.currentTarget.value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readonly={isReadonly()}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile?.phoneNumber}
                onInput={(e) =>
                  setProfile("phoneNumber", e.currentTarget.value)
                }
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readonly={isReadonly()}
              />
            </div>
          </div>

          {/* Submit button that only shows in edit mode */}
          {!isReadonly() && (
            <div class="mt-6 flex justify-end">
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleChangeProfile}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* <!-- Security Settings Card --> */}
        <div
          class="bg-white rounded-lg shadow-sm p-6 mb-6 fade-in"
          style="animation-delay: 0.1s"
        >
          <h2 class="text-xl font-semibold text-gray-800 mb-6">
            Security Settings
          </h2>

          <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-6">
              <div>
                <h3 class="font-medium text-gray-800">Password</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Change your account password
                </p>
              </div>
              <button class="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-150">
                Change Password
              </button>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-6">
              <div>
                <h3 class="font-medium text-gray-800">Active Sessions</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Manage your active devices and sessions
                </p>
              </div>
              <button class="mt-3 sm:mt-0 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition duration-150">
                View Sessions
              </button>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 class="font-medium text-gray-800">Deactivate Account</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Temporarily disable your account
                </p>
              </div>
              <button class="mt-3 sm:mt-0 px-4 py-2 border border-red-500 hover:bg-red-50 text-red-600 text-sm font-medium rounded-md transition duration-150">
                Deactivate
              </button>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-800">Delete Account</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Permanently remove your account and all data
                </p>
              </div>
              <button class="mt-3 sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition duration-150">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
