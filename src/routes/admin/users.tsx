import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { AxiosError } from "axios";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { ActivateConfirmation } from "~/components/button/Activate";
import { DeleteConfirmation } from "~/components/button/Delete";
import { DisableConfirmation } from "~/components/button/Disable";
import { BounceLoading } from "~/components/Loading/BounceLoading";
import { UserManagement } from "~/components/UserManagement";
import {
  createUser,
  deleteUser,
  disableUser,
  enableUser,
  getProductsQueryOptions,
  getUsersQueryOptions,
} from "~/queryFn/fetchAdmin";

import { SuccessResponse } from "~/types/successReponse";
import { UserFormData } from "~/types/user";
import { formatToRupiah } from "~/utils/Format";
import { handleAxiosError } from "~/utils/handleAxiosError";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.clientQuery.prefetchQuery(
      getUsersQueryOptions(context.token() || "")
    );
  },
  pendingComponent: () => <BounceLoading />,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [tab, setTab] = createSignal<number>(0);
  const queryUsers = useQuery(() =>
    getUsersQueryOptions(context.token() || "")
  );

  const disableUserMutate = useMutation(() => ({
    mutationFn: disableUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      queryUsers.refetch();
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, context);
    },
  }));

  const deleteUserMutate = useMutation(() => ({
    mutationFn: deleteUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      queryUsers.refetch();
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, context);
    },
  }));

  const enableUserMutate = useMutation(() => ({
    mutationFn: enableUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      queryUsers.refetch();
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, context);
    },
  }));

  const createUserMutate = useMutation(() => ({
    mutationFn: createUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      queryUsers.refetch();
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, context);
    },
  }));

  const filteredUsers = createMemo(() => {
    if (!queryUsers.data) return [];
    if (tab() === 1 && queryUsers.isSuccess) {
      // Tab 1: Active Users
      return queryUsers.data.filter((user) => user.enabled === true);
    }
    if (tab() === 2 && queryUsers.isSuccess) {
      // Tab 2: Disabled Users
      return queryUsers.data.filter((user) => user.enabled !== true);
    }
    // Default: Return all users
    return queryUsers.data;
  });

  const onDisable = (id: number) => {
    disableUserMutate.mutate({
      authToken: context.token() || "",
      id: id,
    });
  };

  const onActive = (id: number) => {
    enableUserMutate.mutate({
      authToken: context.token() || "",
      id: id,
    });
  };

  const onDelete = (id: number) => {
    deleteUserMutate.mutate({
      authToken: context.token() || "",
      id: id,
    });
  };

  const onCreate = (userData: UserFormData) => {
    createUserMutate.mutate({
      authToken: context.token() || "",
      userData: userData,
    })
  };
  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex flex-col flex-1 overflow-hidden">
        {/* <!-- Top Navigation --> */}
        <div class="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div class="flex items-center">
            {/* <!-- Mobile menu button --> */}
            <button class="md:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2">
              <i class="fas fa-bars"></i>
            </button>
            {/* <!-- Search bar --> */}
            <div class="relative ml-4 md:ml-0">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search Users..."
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2">
              <i class="fas fa-bell"></i>
              <span class="sr-only">Notifications</span>
            </button>
            <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2">
              <i class="fas fa-question-circle"></i>
              <span class="sr-only">Help</span>
            </button>
            <div class="relative md:hidden">
              <img
                class="h-8 w-8 rounded-full"
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Profile"
              />
            </div>
          </div>
        </div>

        {/* <!-- Main Content Area --> */}
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="py-6 px-4 sm:px-6 lg:px-8">
            {/* <!-- Header --> */}
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                  Manage your Users and listings
                </p>
              </div>
              <UserManagement onCreate={onCreate} />
            </div>

            {/* <!-- Stats Cards --> */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <i class="fas fa-users text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Total Users</p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {queryUsers.data?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <i class="fas fa-check-circle text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">
                      Active Users
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {queryUsers.data?.filter((user) => user.enabled).length ||
                        0}
                    </p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-red-100 text-red-600">
                    <i class="fas fa-ban text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">
                      Disabled Users
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {queryUsers.data?.filter((user) => !user.enabled)
                        .length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Product Table and Filter --> */}
            <div class="bg-white shadow rounded-lg overflow-hidden">
              {/* <!-- Tabs --> */}
              <div class="border-b border-gray-200">
                <nav class="flex -mb-px">
                  <button
                    classList={{
                      "py-4 px-6 border-b-2 border-blue-500 font-medium text-sm text-blue-600":
                        tab() == 0,
                      "py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300":
                        tab() !== 0,
                    }}
                    onclick={() => setTab(0)}
                  >
                    All Users
                  </button>
                  <button
                    class=""
                    classList={{
                      "py-4 px-6 border-b-2 border-blue-500 font-medium text-sm text-blue-600":
                        tab() == 1,
                      "py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300":
                        tab() !== 1,
                    }}
                    onclick={() => setTab(1)}
                  >
                    Active
                  </button>

                  <button
                    class=""
                    classList={{
                      "py-4 px-6 border-b-2 border-blue-500 font-medium text-sm text-blue-600":
                        tab() == 2,
                      "py-4 px-6 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300":
                        tab() !== 2,
                    }}
                    onclick={() => setTab(2)}
                  >
                    Disable
                  </button>
                </nav>
              </div>

              {/* <!-- Table --> */}
              <div class="overflow-x-auto">
                <div class="min-w-full">
                  <div class="overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <For each={filteredUsers()}>
                          {(user) => (
                            <tr>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                  <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">
                                      {user.fullName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.email}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                  class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.enabled
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.enabled ? "Active" : "Disabled"}
                                </span>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <ActivateConfirmation
                                  onActivate={() => onActive(user.id || 0)}
                                  id={user.id || 0}
                                />
                                <DisableConfirmation
                                  onDisable={() => onDisable(user.id || 0)}
                                  id={user.id || 0}
                                />
                                <DeleteConfirmation
                                  onDelete={() => onDelete(user.id || 0)}
                                  id={user.id || 0}
                                />
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
