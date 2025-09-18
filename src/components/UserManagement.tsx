import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { defaultForm, UserFormData } from "~/types/user";

export function UserManagement({
  onCreate,
}: {
  onCreate: (userData: UserFormData) => void;
}) {
  const [showModal, setShowModal] = createSignal(false);
  const [form, setForm] = createStore<UserFormData>({ ...defaultForm });

  const resetForm = () => setForm({ ...defaultForm });

  const handleSubmit = (e: Event) => {
    console.log("User data to be submitted:", form);
    resetForm();
    onCreate(form);
    setShowModal(false);
  };

  return (
    <>
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        Add New User
      </button>

      <Show when={showModal()}>
        <div
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 modal-overlay"
          style="animation: fadeIn 0.3s ease-out; backdrop-filter: blur(5px);"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-2 modal-content"
            style="animation: slideIn 0.3s ease-out;"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">Add New User</h2>
              <button
                class="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form class="space-y-4" onSubmit={handleSubmit}>
              {[
                ["Full Name", "fullName", "text"],
                ["Username", "username", "text"],
                ["Email", "email", "email"],
                ["Phone Number", "phoneNumber", "tel"],
                ["Password", "password", "password"],
              ].map(([label, key, type]) => (
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for={key}
                  >
                    {label}
                  </label>
                  <input
                    id={key}
                    type={type}
                    required
                    value={form[key as keyof UserFormData] as string}
                    class={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                    onInput={(e) =>
                      setForm(key as keyof UserFormData, e.currentTarget.value)
                    }
                  />
                </div>
              ))}

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 mb-1"
                  for="role"
                >
                  Role
                </label>
                <select
                  id="role"
                  required
                  value={form.role}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                  onChange={(e) => setForm("role", e.currentTarget.value)}
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              <div class="flex items-center mt-2">
                <input
                  id="enabled"
                  type="checkbox"
                  class="custom-checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm("enabled", e.currentTarget.checked)}
                />
                <label for="enabled" class="ml-2 text-sm text-gray-700">
                  Account Enabled
                </label>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-300 ease-in-out"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>

      {/* Custom checkbox style */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .custom-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #3b82f6;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-checkbox:checked {
          background-color: #3b82f6;
        }

        .custom-checkbox:checked::after {
          content: "✓";
          color: white;
          font-size: 14px;
        }
        `}
      </style>
    </>
  );
}
