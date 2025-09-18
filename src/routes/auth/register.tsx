import { useMutation, useQuery } from "@tanstack/solid-query";
import {
  createFileRoute,
  useLoaderData,
  useMatches,
  Link,
  useNavigate,
} from "@tanstack/solid-router";
import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { TermsAndCondition } from "~/components/TermsAndCondition";
import {
  postRegisterUser,
  RegisterInput,
  RegisterResponse,
} from "~/queryFn/postAuthUser";
import { SuccessResponse } from "~/types/successReponse";
import { TermsAndConditions } from "~/types/terms";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";
export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext()();
  const [termsShow, setTermsShow] = createSignal(false);
  const [isError, setIsError] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [formData, setFormData] = createStore<RegisterInput>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    terms: false, // menyatakan apakah pengguna menyetujui syarat & ketentuan
  });
  const [userTerms, setUserTerms] = createStore<TermsAndConditions>({
    terms: {
      updateAt: "2025-07-16",
      platform: "NiagaNow",
      company: "caleheinzz",
      introduction: [
        'Syarat dan Ketentuan ini ("Syarat") mengatur pendaftaran dan penggunaan layanan oleh pengguna (“Pengguna”) di platform marketplace NiagaNow ("Platform") yang dioperasikan oleh caleheinzz ("Kami"). Dengan membuat akun, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan berikut ini.',
      ],
      sections: [
        {
          title: "Definisi",
          content: [
            "Platform: Situs dan/atau aplikasi NiagaNow yang menyediakan layanan transaksi jual beli secara daring.",
            "Pengguna: Setiap individu yang membuat akun untuk menjelajah, membeli, atau menggunakan layanan Platform.",
            "Penjual: Pihak yang menawarkan produk melalui Platform.",
            "Produk: Barang yang ditawarkan oleh Penjual melalui Platform.",
            "Pesanan: Proses pembelian produk yang dilakukan oleh Pengguna melalui sistem Platform.",
          ],
        },
        {
          title: "Pendaftaran Akun",
          content: [
            "Pengguna wajib memberikan informasi yang benar, lengkap, dan terbaru saat mendaftar.",
            "Pengguna bertanggung jawab menjaga kerahasiaan akun dan kata sandi mereka.",
            "Platform tidak bertanggung jawab atas kerugian akibat kelalaian menjaga keamanan akun oleh Pengguna.",
          ],
        },
        {
          title: "Hak dan Kewajiban Pengguna",
          content: [
            "Pengguna berhak mengakses dan menggunakan Platform sesuai dengan hukum yang berlaku.",
            "Pengguna wajib mematuhi peraturan yang ditetapkan oleh Platform, termasuk larangan penyalahgunaan fitur atau sistem.",
            "Pengguna bertanggung jawab atas data, aktivitas, dan transaksi yang dilakukan melalui akunnya.",
          ],
        },
        {
          title: "Transaksi dan Pembayaran",
          content: [
            "Setiap pesanan yang dikonfirmasi adalah bentuk kontrak antara Pengguna dan Penjual.",
            "Pembayaran harus dilakukan sesuai instruksi yang ditampilkan pada saat checkout.",
            "Pengguna tidak diperkenankan melakukan pembayaran di luar sistem Platform.",
          ],
        },
        {
          title: "Pengembalian dan Pengaduan",
          content: [
            "Pengguna berhak mengajukan permintaan pengembalian jika produk tidak sesuai atau rusak.",
            "Pengguna wajib menyampaikan komplain dalam waktu maksimal [3x24 jam] sejak menerima barang.",
            "Platform akan menengahi sengketa antara Pengguna dan Penjual secara adil.",
          ],
        },
        {
          title: "Pemutusan Akses dan Penghapusan Akun",
          content: [
            "Platform berhak membatasi atau menghapus akun Pengguna yang melanggar ketentuan.",
            "Pengguna dapat menghapus akun dengan permintaan tertulis melalui layanan pelanggan.",
            "Sisa dana atau pesanan yang belum selesai harus diselesaikan sebelum penghapusan akun.",
          ],
        },
        {
          title: "Perubahan Ketentuan",
          content: [
            "Platform dapat mengubah ketentuan ini sewaktu-waktu dan akan memberitahukan melalui email atau notifikasi.",
            "Penggunaan Platform setelah perubahan dianggap sebagai persetujuan terhadap ketentuan yang diperbarui.",
          ],
        },
        {
          title: "Penyelesaian Sengketa",
          content: [
            "Sengketa akan diselesaikan terlebih dahulu secara musyawarah.",
            "Jika tidak berhasil, penyelesaian akan dilakukan melalui lembaga arbitrase atau Pengadilan Negeri Jakarta Selatan sesuai hukum yang berlaku.",
          ],
        },
      ],
      contact: {
        address: "Jl. Contoh Alamat No.123, Jakarta, Indonesia",
        email: "support@NiagaNow.com",
        phone: "+62xxxxxxxxxxx",
      },
    },
  });
  const navigate = useNavigate();

  const mutation = useMutation(() => ({
    mutationFn: postRegisterUser,
    onSuccess: (data: SuccessResponse) => {
      handleAxiosSuccess(data, context);
      context.refresh();
      navigate({
        to: "/auth/login",
      });
    },

    onError: (error) => {
      console.error("Login failed", error.message);
      setIsError(true);
    },
  }));

  const handleRegister = () => {
    mutation.mutate(formData);
  };
  const handleTermsPopUp = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTermsShow(!termsShow());
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
              Create Your Account
            </h1>
            <p class="text-gray-500 text-center mt-1 text-sm">
              Join our community and start your journey
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
                  Full Name
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-user text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    onInput={(e) => {
                      setFormData("fullName", e.currentTarget.value),
                        setIsError(false);
                    }}
                    placeholder="your full name"
                    class="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 outline-none smooth-transition"
                    classList={{
                      "border-red-500": isError(),
                      " border-gray-200 focus:border-primtext-primary-400 focus:ring-1 focus:ring-primtext-primary-400":
                        !isError(),
                    }}
                    autocomplete="full name"
                  />
                </div>
              </div>

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
                    <i class="fas fa-user text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    onInput={(e) => {
                      setFormData("username", e.currentTarget.value),
                        setIsError(false);
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

              {/* <!-- Email --> */}
              <div class="space-y-1 fade-in delay-100">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-envelope text-gray-400 text-sm"></i>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    onInput={(e) => {
                      setFormData("email", e.currentTarget.value),
                        setIsError(false);
                    }}
                    placeholder="your@email.com"
                    class="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 outline-none smooth-transition"
                    classList={{
                      "border-red-500": isError(),
                      " border-gray-200 focus:border-primtext-primary-400 focus:ring-1 focus:ring-primtext-primary-400":
                        !isError(),
                    }}
                    autocomplete="email"
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
                      setFormData("password", e.currentTarget.value),
                        setIsError(false);
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
              {/* <!-- Confirmation Checkbox --> */}
              <div class="">
                <div class="flex items-start">
                  <input
                    type="checkbox"
                    onchange={(e) =>
                      setFormData("terms", e.currentTarget.checked)
                    }
                    id="agreeCheckbox"
                    class="mt-1 mr-3"
                  />
                  <label for="agreeCheckbox" class="text-gray-700">
                    I have read and agree to the NiagaNow{" "}
                    <span>
                      <button
                        onclick={handleTermsPopUp}
                        class="text-indigo-600 hover:underline"
                      >
                        Terms & Conditions.
                      </button>
                    </span>
                    <span class="text-red-500">*</span>
                  </label>
                </div>
              </div>
              {/* <!-- Submit --> */}
              <button
                type="submit"
                id="submitButton"
                class="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary-500 hover:bg-primary-400 text-white font-medium smooth-transition btn-hover fade-in delay-300"
                onClick={handleRegister}
              >
                <span id="buttonText">Sign up</span>
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

            {/* <!-- Social login --> */}
            {/* <div class="mt-8 fade-in delay-300">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-2 bg-white text-sm text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  class="py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 smooth-transition"
                >
                  <i class="fab fa-google text-red-500"></i>
                </button>
                <button
                  type="button"
                  class="py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 smooth-transition"
                >
                  <i class="fab fa-apple text-gray-800"></i>
                </button>
                <button
                  type="button"
                  class="py-2 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 smooth-transition"
                >
                  <i class="fab fa-facebook-f text-primbg-primary-500"></i>
                </button>
              </div>
            </div> */}
          </div>

          {/* <!-- Footer --> */}
          <div class="px-8 py-4 bg-gray-50 text-center fade-in delay-300">
            <p class="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                class="font-medium text-primbg-primary-500 hover:text-primary-400 smooth-transition"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Show when={termsShow()}>
        <div
          id="termsPopup"
          class="popup-overlay fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onclick={(e) => handleTermsPopUp(e)}
        >
          <div class="popup-content bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div class="p-4 overflow-auto">
              <TermsAndCondition terms={userTerms} />
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
