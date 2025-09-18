import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { TermsAndCondition } from "~/components/TermsAndCondition";
import { StoreRegistrationForm } from "~/types/auth";
import { TermsAndConditions } from "~/types/terms";
import { useMutation } from "@tanstack/solid-query";
import { registerSeller } from "~/queryFn/postAuthUser";
import { AxiosError } from "axios";
import { handleAxiosError } from "~/utils/handleAxiosError";
import { handleAxiosSuccess } from "~/utils/handleAxiosSuccess";

export const Route = createFileRoute("/auth/seller")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = createSignal(false);
  const [step, setStep] = createSignal(1);
  const [isError, setIsError] = createSignal(false);
  const context = Route.useRouteContext()();
  const navigate = useNavigate();
  const [formData, setFormData] = createStore<StoreRegistrationForm>({
    username: "",
    contactPhone: "",
    storeEmail: "",
    password: "",
    confirmPassword: "",
    description: "",
    storeName: "",
    storeType: "",
    terms: false,
  });
  const [termsShow, setTermsShow] = createSignal(false);
  const [sellerTerms, setSellerTerms] = createStore<TermsAndConditions>({
    terms: {
      updateAt: "2025-07-16",
      platform: "NiagaNow",
      company: "caleheinzz",
      introduction: [
        'Syarat dan Ketentuan ini ("Syarat") berlaku khusus untuk proses pendaftaran dan aktivitas sebagai Penjual di platform marketplace NiagaNow ("Platform") yang dioperasikan oleh caleheinzz ("Kami"). Dengan mendaftar sebagai Penjual, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh ketentuan yang ditetapkan berikut ini.',
      ],
      sections: [
        {
          title: "Definisi",
          content: [
            "Platform: Sistem marketplace daring yang tersedia melalui situs www.namadomainanda.com dan/atau aplikasi terkait.",
            "Penjual: Individu atau entitas yang telah mendaftarkan toko untuk menjual produk melalui Platform.",
            "Pembeli: Pengguna yang melakukan pembelian melalui Platform.",
            "Toko: Toko virtual yang dikelola oleh Penjual dalam Platform.",
            "Biaya Layanan: Komisi atau biaya lainnya yang dipotong oleh Platform dari hasil penjualan.",
            "Pesanan: Transaksi pembelian yang telah dikonfirmasi oleh Pembeli dan wajib dipenuhi oleh Penjual.",
          ],
        },
        {
          title: "Kelayakan Registrasi",
          content: [
            "Penjual harus berusia minimal 18 tahun atau merupakan badan usaha yang sah menurut hukum Indonesia.",
            "Dokumen yang dibutuhkan antara lain: KTP/NIB, NPWP (jika ada), rekening bank aktif, dan informasi toko.",
            "Platform berhak menolak permohonan pendaftaran tanpa kewajiban memberikan alasan.",
          ],
        },
        {
          title: "Kewajiban Penjual",
          content: [
            "Menjamin bahwa seluruh informasi yang diberikan saat registrasi adalah akurat dan terkini.",
            "Menjaga kerahasiaan akun serta bertanggung jawab atas seluruh aktivitas yang terjadi melalui akun tersebut.",
            "Tidak menggunakan Platform untuk aktivitas yang melanggar hukum atau norma kesusilaan.",
          ],
        },
        {
          title: "Verifikasi dan Aktivasi",
          content: [
            "Setelah proses pendaftaran, Platform akan melakukan verifikasi atas data dan dokumen yang diberikan.",
            "Akun Penjual akan aktif setelah lulus proses verifikasi sesuai standar Platform.",
            "Platform dapat meminta dokumen tambahan sewaktu-waktu untuk tujuan keamanan atau kepatuhan.",
          ],
        },
        {
          title: "Penangguhan dan Penolakan",
          content: [
            "Platform berhak menangguhkan atau membatalkan akun Penjual yang memberikan informasi palsu atau menyalahi kebijakan.",
            "Penjual yang telah ditangguhkan dapat mengajukan klarifikasi kepada tim dukungan Platform.",
            "Dalam kasus penipuan atau pelanggaran berat, Platform dapat menolak seluruh permohonan registrasi selanjutnya.",
          ],
        },
        {
          title: "Perubahan Ketentuan Registrasi",
          content: [
            "Platform berhak mengubah ketentuan registrasi sewaktu-waktu.",
            "Perubahan akan diinformasikan melalui email atau notifikasi dalam Platform.",
            "Dengan terus menggunakan layanan ini, Penjual dianggap menyetujui perubahan yang berlaku.",
          ],
        },
        {
          title: "Penyelesaian Sengketa",
          content: [
            "Apabila timbul perselisihan terkait proses registrasi, penyelesaiannya akan dilakukan secara musyawarah.",
            "Jika tidak tercapai, sengketa akan diajukan melalui jalur hukum yang berlaku di Indonesia.",
            "Platform dapat menunjuk lembaga arbitrase atau menyelesaikannya melalui Pengadilan Negeri Jakarta Selatan.",
          ],
        },
      ],
      contact: {
        address: "Jl. Contoh Alamat No.123, Jakarta, Indonesia",
        email: "support@niaganow.com",
        phone: "+62xxxxxxxxxxx",
      },
    },
  });

  const sellerMutate = useMutation(() => ({
    mutationKey: ["register-seller"],
    mutationFn: registerSeller,
    onSuccess: (data: { message: string }) => {
      context.refresh();
      handleAxiosSuccess(data, context);
      navigate({
        to: "/store/dashboard",
      });
    },
    onError: (err: AxiosError) =>{
      handleAxiosError(err, context, 5000, "error")
      console.log(context.token())
    }
  }));

  const handleRegisterSeller = () => {
    sellerMutate.mutate({
      authToken: context.token() || "",
      store: formData,
    });
  };

  const handleTermsPopUp = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTermsShow(!termsShow());
  };
  return (
    <>
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          {/* <!-- Header --> */}
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
              Seller Registration
            </h1>
            <p class="text-lg text-gray-600">
              Join our marketplace and start selling your products to millions
              of customers
            </p>
          </div>

          {/* <!-- Registration Form --> */}
          <div
            id="registration-form"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <Switch>
              <Match when={step() === 1}>
                {/* <!-- Step 1: Account Information --> */}
                <div id="step-1" class="p-8">
                  <h2 class="text-2xl font-semibold text-gray-800 mb-6">
                    Account Information
                  </h2>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <!-- First Name --> */}
                    <div class="orm-group md:col-span-2">
                      <label
                        for="first-name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          onchange={(e) =>
                            setFormData("username", e.currentTarget.value)
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <i class="fas fa-user"></i>
                        </div>
                      </div>
                      <div
                        id="username-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Please enter your username
                      </div>
                    </div>

                    {/* <!-- Email --> */}
                    <div class="form-group md:col-span-2">
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address *
                      </label>
                      <div class="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          onchange={(e) =>
                            setFormData("storeEmail", e.currentTarget.value)
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <i class="fas fa-envelope"></i>
                        </div>
                      </div>
                      <div
                        id="email-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Please enter a valid email address
                      </div>
                    </div>

                    {/* <!-- Password --> */}
                    <div class="form-group">
                      <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password *
                      </label>
                      <div class="relative">
                        <input
                          type={showPassword() ? "text" : "password"}
                          id="password"
                          name="password"
                          onchange={(e) =>
                            setFormData("password", e.currentTarget.value)
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onclick={() => setShowPassword(!showPassword())}
                            class="text-gray-400 hover:text-gray-600 focus:outline-none toggle-password"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Confirm Password --> */}
                    <div class="form-group">
                      <label
                        for="confirm-password"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password *
                      </label>
                      <div class="relative">
                        <input
                          type={showPassword() ? "text" : "password"}
                          id="confirm-password"
                          name="confirm-password"
                          onchange={(e) =>
                            setFormData(
                              "confirmPassword",
                              e.currentTarget.value
                            )
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            type="button"
                            onclick={() => setShowPassword(!showPassword())}
                            class="text-gray-400 hover:text-gray-600 focus:outline-none toggle-password"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                      <div
                        id="confirm-password-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Passwords do not match
                      </div>
                    </div>

                    {/* <!-- Phone Number --> */}
                    <div class="form-group md:col-span-2">
                      <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number *
                      </label>
                      <div class="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          onchange={(e) =>
                            setFormData("contactPhone", e.currentTarget.value)
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <i class="fas fa-phone"></i>
                        </div>
                      </div>
                      <div
                        id="phone-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Please enter a valid phone number
                      </div>
                    </div>
                    {/* <!-- Business Name --> */}
                    <div class="form-group md:col-span-2">
                      <label
                        for="business-name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Business Name *
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          id="business-name"
                          name="business-name"
                          onchange={(e) =>
                            setFormData("storeName", e.currentTarget.value)
                          }
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <i class="fas fa-store"></i>
                        </div>
                      </div>
                      <div
                        id="business-name-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Please enter your business name
                      </div>
                    </div>

                    {/* <!-- Business Type (by Product Category) --> */}
                    <div class="form-group">
                      <label
                        for="business-type"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Business Type *
                      </label>
                      <select
                        id="business-type"
                        name="business-type"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 input-focus"
                        required
                        value={formData.storeType}
                        onInput={(e) =>
                          setFormData("storeType", e.currentTarget.value)
                        }
                      >
                        <option value="" disabled selected>
                          Select business type
                        </option>
                        <option value="electronics">Electronics</option>
                        <option value="pangan">Pangan</option>
                        <option value="sembako">Sembako</option>
                        <option value="fashion">Fashion</option>
                        <option value="otomotif">Otomotif</option>
                        <option value="kecantikan">Kecantikan</option>
                        <option value="peralatan-rumah-tangga">
                          Peralatan Rumah Tangga
                        </option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                      <div
                        id="business-type-error"
                        class="error-message text-red-500 text-xs mt-1 hidden"
                      >
                        Please select a business type
                      </div>
                    </div>
                  </div>
                  {/* <!-- Confirmation Checkbox --> */}
                  <div class="py-6">
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
                  <div class="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={handleRegisterSeller}
                      id="next-step-1"
                      class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                      Register <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </Match>
            </Switch>
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
              <TermsAndCondition terms={sellerTerms} />
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
