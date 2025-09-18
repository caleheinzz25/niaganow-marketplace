import { For } from "solid-js";
import { TermsAndConditions } from "~/types/terms";

interface Props {
  terms: TermsAndConditions;
}

export const TermsAndCondition = ({ terms }: Props) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <>
      {/* <!-- Header with Logo --> */}
      <header class="flex flex-col items-center mb-8">
        <div class="flex items-center mb-4">
          <i class="fas fa-store-alt text-purple-600 text-3xl mr-3"></i>
          <h1 class="text-3xl font-bold text-purple-700">
            {terms.terms.platform} Marketplace
          </h1>
        </div>
        <h2 class="text-2xl font-semibold text-gray-800 text-center">
          Terms & Conditions
        </h2>
        <p class="text-gray-500 mt-2 text-sm">
          Last updated:{" "}
          <span class="font-medium">{`${new Date(terms.terms.updateAt).toLocaleString()}`}</span>
        </p>
      </header>

      {/* <!-- Main Content --> */}
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        {/* <!-- Quick Navigation (Sticky on Scroll) --> */}
        <div class="bg-purple-50 p-4 sticky top-0 z-10">
          <h3 class="font-medium text-purple-700 mb-2">Quick Sections:</h3>
          <div class="flex flex-wrap gap-2">
            <For each={terms.terms.sections}>
              {(section, index) => (
                <a
                  href={`#${section.title}`}
                  class="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm transition"
                >
                  {`${alphabet[index()]}. ${section.title}`}
                </a>
              )}
            </For>
          </div>
        </div>

        {/* <!-- Terms Content --> */}
        <div class="p-6 md:p-8">
          {/* <!-- Important Notice --> */}
          <div class="highlight-box bg-blue-50 p-4 mb-6 rounded">
            <div class="flex">
              <i class="fas fa-exclamation-circle text-blue-500 mt-1 mr-3"></i>
              <div>
                <h4 class="font-bold text-blue-800 mb-1"> "Pendahuluan"</h4>
                <p class="text-blue-700">{terms.terms.introduction}</p>
              </div>
            </div>
          </div>

          {/* <!-- Sections --> */}
          <div class="space-y-8">
            <For each={terms.terms.sections}>
              {(section, index) => (
                <>
                  {/* <!-- For Loop  --> */}
                  <section
                    id={section.title}
                    class="section-hover p-2 rounded-lg"
                  >
                    <h3 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
                      <span class="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                        {`${alphabet[index()]}`}
                      </span>
                      {section.title}
                    </h3>
                    <div class="ml-9">
                      <div class="flex flex-col">
                        <For each={section.content}>
                          {(content, index) => (
                            <div>
                              <p class="text-gray-600">
                                {`${index() + 1}. ${content}`}
                              </p>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </For>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <!-- 6. Penangguhan Akun --> */}
              <section class="section-hover p-4 rounded-lg bg-white shadow">
                <h3 class="text-lg font-semibold text-purple-700 mb-2">
                  Penangguhan Akun
                </h3>
                <p class="text-gray-700">
                  Akun Anda dapat ditangguhkan atau dihapus karena dugaan
                  penipuan, pelanggaran berulang, atau ketidakpatuhan terhadap
                  hukum yang berlaku.
                </p>
              </section>

              {/* <!-- 7. Batasan Tanggung Jawab --> */}
              <section class="section-hover p-4 rounded-lg bg-white shadow">
                <h3 class="text-lg font-semibold text-purple-700 mb-2">
                  Batasan Tanggung Jawab
                </h3>
                <p class="text-gray-700">
                  EzyShop tidak bertanggung jawab atas perselisihan, kerugian,
                  atau kegagalan pengiriman antara Penjual dan Pembeli.
                </p>
              </section>

              {/* <!-- 8. Perubahan Ketentuan --> */}
              <section class="section-hover p-4 rounded-lg bg-white shadow">
                <h3 class="text-lg font-semibold text-purple-700 mb-2">
                  Perubahan Ketentuan
                </h3>
                <p class="text-gray-700">
                  Ketentuan ini dapat diperbarui sewaktu-waktu. Penggunaan
                  Platform secara berkelanjutan dianggap sebagai bentuk
                  persetujuan Anda terhadap perubahan tersebut.
                </p>
              </section>

              {/* <!-- 9. Hukum yang Berlaku --> */}
              <section class="section-hover p-4 rounded-lg bg-white shadow">
                <h3 class="text-lg font-semibold text-purple-700 mb-2">
                  Hukum yang Berlaku
                </h3>
                <p class="text-gray-700">
                  Ketentuan ini tunduk pada hukum yang berlaku di Republik
                  Indonesia atau yurisdiksi terkait.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
