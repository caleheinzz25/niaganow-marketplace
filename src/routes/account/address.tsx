import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { AxiosError } from "axios";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import {
  deleteAddress,
  getAddresses,
  registerAddress,
  updateDefaultAddress,
} from "~/queryFn/fetchAddress";
import { Address } from "~/types/address";
import { handleAxiosError } from "~/utils/handleAxiosError";

export const Route = createFileRoute("/account/address")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const queryAddresses = useQuery(() => getAddresses(context.token() || ""));
  const [addresses, setAddresses] = createStore<Address[]>([]);
  const [showAddress, setShowAddress] = createSignal(true);
  const [addressForm, setAddressForm] = createStore<Address>({
    addressType: "Home", // default value
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "Indonesia", // atau default sesuai lokasi target
    phoneNumber: "",
    defaultShipping: false,
  });

  const mutateAddress = useMutation(() => ({
    mutationKey: ["address"],
    mutationFn: registerAddress,
    onSuccess: async () => {
      const newQueryAddresses = await queryAddresses.refetch();
      if (newQueryAddresses.isSuccess) {
        setAddresses(newQueryAddresses.data.addresses);
      }
    },
    onError: (err: AxiosError) => handleAxiosError(err, context),
  }));

  const mutateDeleteAddress = useMutation(() => ({
    mutationKey: ["deleteAddress"],
    mutationFn: deleteAddress,
    onSuccess: async () => {
      const newQueryAddresses = await queryAddresses.refetch();
      if (newQueryAddresses.isSuccess) {
        setAddresses(newQueryAddresses.data.addresses);
      }
    },
    onError: (err: AxiosError) => handleAxiosError(err, context),
  }));

  const mutateUpdateAddress = useMutation(() => ({
    mutationKey: ["updateAddress"],
    mutationFn: updateDefaultAddress,
    onSuccess: async () => {
      const newQueryAddresses = await queryAddresses.refetch();
      if (newQueryAddresses.isSuccess) {
        setAddresses(newQueryAddresses.data.addresses);
      }
    },
    onError: (err: AxiosError) => handleAxiosError(err, context),
  }));

  const handleRegisterAddress = () => {
    mutateAddress.mutate({
      address: addressForm,
      authToken: context.token() || "",
    });
  };

  const handleDeleteAddress = (addressId: number) => {
    mutateDeleteAddress.mutate({
      addressId,
      authToken: context.token() || "",
    });
  };

  const toggleAddress = () => {
    setShowAddress((prev) => !prev);
  };

  const toggleUpdateAddress = (address: Address) => {
    setShowAddress((prev) => !prev);
    setAddressForm(address);
  };

  createEffect(() => {
    if (queryAddresses.isSuccess) {
      setAddresses(queryAddresses.data.addresses);
    }
  });

  const handleDefaultAddress = (addressId: number) => {
    mutateUpdateAddress.mutate({
      addressId,
      authToken: context.token() || "",
    });
  };

  return (
    <>
      {/* <!-- Main Content --> */}
      <div class="flex-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          {/* <!-- Header --> */}
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Address Book</h1>
            <button
              class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center"
              onclick={toggleAddress}
            >
              <i class="fas fa-plus mr-2"></i>
              Add New Address
            </button>
          </div>

          {/* <!-- Address List --> */}
          <div class="space-y-4" id="address-container">
            <Show when={queryAddresses.isSuccess}>
              <For each={addresses}>
                {(address) => (
                  <div class="address-card fade-in bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 ease-in-out relative">
                    <div class="absolute top-4 right-4 flex space-x-2">
                      <button
                        class="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                        onclick={() => toggleUpdateAddress(address)}
                      >
                        <i class="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        class="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                        onclick={() => handleDeleteAddress(address.id || 0)}
                      >
                        <i class="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>

                    <div class="flex items-start">
                      <div class="mr-4 mt-1">
                        <div
                          class={`bg-gray-100 ${address.defaultShipping ? "text-blue-800" : "text-gray-800"} rounded-full p-2`}
                        >
                          <i class="fas fa-briefcase"></i>
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center mb-1">
                          <h3 class="font-medium text-gray-800 mr-3">
                            {" "}
                            {address.addressType}
                          </h3>
                          <Show when={address.defaultShipping}>
                            <span class="inline-block px-2 py-0.5 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full">
                              Default Shipping Address
                            </span>
                          </Show>
                        </div>
                        <p class="text-gray-700">
                          {address.firstName} {address.lastName}
                        </p>
                        <p class="text-gray-700">{address.streetAddress}</p>
                        <p class="text-gray-700">{address.apartment}</p>
                        <p class="text-gray-700">
                          {address.city}, {address.stateProvince}{" "}
                          {address.postalCode}
                        </p>
                        <p class="text-gray-700">{address.country}</p>
                        <p class="text-gray-700 mt-2">
                          Phone: {address.phoneNumber}{" "}
                        </p>
                        <div class="mt-4 pt-3 border-t border-gray-100">
                          <button
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() =>
                              handleDefaultAddress(address.id || 0)
                            }
                          >
                            Set as Default
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </Show>

          </div>
        </div>
      </div>
      {/* <!-- Add Address Modal --> */}
      <div
        id="addAddressModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        classList={{ hidden: showAddress() }}
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                Add New Address
              </h3>
              <button
                class="text-gray-400 hover:text-gray-500"
                onClick={toggleAddress}
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onchange={(e) =>
                    setAddressForm("addressType", e.currentTarget.value)
                  }
                  value={addressForm.addressType}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Warehouse">warehouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.firstName}
                    onchange={(e) =>
                      setAddressForm("firstName", e.target.value)
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.lastName}
                    onchange={(e) => setAddressForm("lastName", e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  onchange={(e) =>
                    setAddressForm("streetAddress", e.target.value)
                  }
                  value={addressForm.streetAddress}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Apt/Unit (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onchange={(e) => setAddressForm("apartment", e.target.value)}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onchange={(e) => setAddressForm("city", e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={addressForm.stateProvince}
                    onchange={(e) =>
                      setAddressForm("stateProvince", e.target.value)
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onchange={(e) =>
                      setAddressForm("postalCode", e.target.value)
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onchange={(e) => setAddressForm("country", e.target.value)}
                    value={addressForm.country}
                  >
                    <option value="United States">United States</option>
                    <option value="United States">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Indonesia">Indonesia</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  onchange={(e) =>
                    setAddressForm("phoneNumber", e.target.value)
                  }
                  value={addressForm.phoneNumber}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onclick={handleRegisterAddress}
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
