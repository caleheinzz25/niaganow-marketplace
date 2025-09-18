import { createFileRoute, Link } from "@tanstack/solid-router";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { TermsAndCondition } from "~/components/TermsAndCondition";
import { TermsAndConditions } from "~/types/terms";

export const Route = createFileRoute("/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  const [terms, setTerms] = createStore<TermsAndConditions>({
    terms: {
      updateAt: "2025-07-16",
      platform: "NiagaNow",
      company: "caleheinzz",
      introduction: [
        'Syarat dan Ketentuan ini ("Syarat") mengatur penggunaan platform marketplace NiagaNow", ("Platform") yang dioperasikan oleh caleheinzz ("Kami"). Dengan mendaftar sebagai penjual, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk tunduk pada seluruh ketentuan yang berlaku, termasuk setiap pembaruan yang dapat kami tetapkan dari waktu ke waktu.',
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
          title: "Pendaftaran dan Akun Penjual",
          content: [
            "Penjual wajib memberikan informasi yang valid dan akurat termasuk data KTP/NIB, rekening bank, NPWP (jika ada), dan informasi toko.",
            "Penjual dapat mengelola lebih dari satu toko apabila disetujui oleh Platform.",
            "Penjual bertanggung jawab atas keamanan akun dan aktivitas yang terjadi melalui akunnya.",
          ],
        },
        {
          title: "Listing Produk",
          content: [
            "Penjual wajib memastikan deskripsi produk akurat, tidak menyesatkan, dan tidak melanggar hukum.",
            "Penjualan produk ilegal, berbahaya, atau melanggar Hak Kekayaan Intelektual dilarang keras.",
            "Ketersediaan stok harus diperbarui secara berkala.",
          ],
        },
        {
          title: "Pemrosesan Pesanan",
          content: [
            "Penjual wajib memproses dan mengirim pesanan dalam waktu yang telah ditentukan.",
            "Apabila terjadi keterlambatan, Penjual harus memberikan pemberitahuan kepada Pembeli dan/atau Platform.",
            "Kegagalan dalam pemenuhan pesanan dapat berujung pada sanksi termasuk penangguhan akun.",
          ],
        },
        {
          title: "Biaya dan Pembayaran",
          content: [
            "Platform berhak memotong [5%] biaya layanan dari setiap transaksi sukses.",
            "Dana hasil penjualan akan ditransfer ke rekening Penjual dalam waktu [2–3 hari kerja] setelah pesanan selesai.",
            "Platform dapat menerapkan biaya tambahan untuk fitur promosi, prioritas listing, atau resolusi sengketa.",
          ],
        },
        {
          title: "Pajak dan Kepatuhan",
          content: [
            "Penjual bertanggung jawab atas pelaporan dan pembayaran pajak atas penghasilannya sendiri (PPN, PPh).",
            "Platform dapat membantu pemungutan PPN apabila diperlukan oleh peraturan perpajakan Indonesia.",
            "Penjual wajib mematuhi peraturan hukum yang berlaku termasuk UU Perdagangan, Perlindungan Konsumen, dan Perpajakan.",
          ],
        },
        {
          title: "Pengembalian, Pengembalian Dana, dan Sengketa",
          content: [
            "Penjual wajib mematuhi kebijakan pengembalian dan pengembalian dana Platform.",
            "Apabila ada komplain dari Pembeli, Penjual harus memberikan tanggapan maksimal dalam [48 jam].",
            "Platform berhak melakukan intervensi dan menetapkan solusi apabila Penjual tidak merespons atau tidak menyelesaikan sengketa secara adil.",
          ],
        },
        {
          title: "Kewajiban Pembeli",
          content: [
            "Pembeli wajib memberikan informasi pengiriman yang benar dan lengkap.",
            "Pembeli bertanggung jawab untuk memeriksa deskripsi produk sebelum melakukan pembelian.",
            "Penyalahgunaan kebijakan pengembalian untuk keuntungan pribadi akan dikenakan sanksi.",
            "Pembeli dilarang melakukan pelecehan terhadap Penjual melalui chat atau ulasan produk.",
          ],
        },

        {
          title: "Hak Kekayaan Intelektual",
          content: [
            "Penjual menjamin bahwa produk yang dijual adalah asli dan tidak melanggar merek dagang atau hak cipta pihak ketiga.",
            "Platform dapat menghapus konten atau produk yang dilaporkan atau terbukti melanggar HKI.",
          ],
        },
        {
          title: "Data dan Privasi",
          content: [
            "Penjual tidak diperkenankan menyalahgunakan data Pembeli untuk promosi di luar Platform tanpa persetujuan.",
            "Penjual dan Platform wajib menjaga kerahasiaan data sesuai dengan UU Perlindungan Data Pribadi (UU PDP).",
            "Platform dapat menggunakan data transaksi untuk tujuan analisis dan peningkatan layanan.",
          ],
        },
        {
          title: "Penangguhan dan Pengakhiran",
          content: [
            "Platform berhak menangguhkan atau menghapus akun Penjual yang melanggar Syarat ini.",
            "Penjual dapat menutup toko dengan pemberitahuan tertulis minimal [7 hari], asalkan semua pesanan diselesaikan.",
            "Dana dapat ditahan sementara apabila terdapat investigasi terhadap dugaan kecurangan.",
          ],
        },
        {
          title: "Batasan Tanggung Jawab",
          content: [
            "Platform tidak bertanggung jawab atas kerugian tidak langsung, kehilangan pendapatan, atau kegagalan operasional akibat penggunaan Platform.",
            "Penjual membebaskan Platform dari tuntutan hukum terkait produk, klaim konsumen, atau pelanggaran hukum yang dilakukan Penjual.",
          ],
        },
        {
          title: "Perubahan Ketentuan",
          content: [
            "Kami berhak memperbarui Syarat ini secara berkala.",
            "Penjual akan diberi pemberitahuan melalui email atau notifikasi platform.",
            "Melanjutkan penggunaan Platform setelah perubahan berarti Penjual menyetujui versi terbaru Syarat.",
          ],
        },
        {
          title: "Hukum yang Berlaku dan Penyelesaian Sengketa",
          content: [
            "Syarat ini tunduk pada hukum Republik Indonesia.",
            "Apabila terjadi perselisihan, kedua belah pihak akan menyelesaikannya secara musyawarah.",
            "Jika tidak berhasil, sengketa akan diselesaikan melalui [BANI atau Pengadilan Negeri Jakarta Selatan].",
          ],
        },
      ],
      contact: {
        address: "Alamat Kantor Anda",
        email: "support@namaplatformanda.com",
        phone: "+62xxxxxxxxxxx",
      },
    },
  });

  return (
    <>
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        {/* <!-- Floating Accept Button (Fixed on Mobile) --> */}
        {/* <div class="fixed bottom-6 right-6 z-10">
          <Link
            to="/auth/seller"
            id="acceptBtn"
            class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            <i class="fas fa-check-circle mr-2"></i> Accept Terms
          </Link>
        </div> */}

        <TermsAndCondition terms={terms} />

        {/* <!-- Footer --> */}
        <footer class="mt-8 text-center text-gray-600 text-sm">
          <p>
            Need help?{" "}
            <a href="#" class="text-purple-600 hover:underline">
              Contact Support
            </a>
          </p>
          <p class="mt-1">
            &copy; <span id="currentYear"></span> NiagaNow", Marketplace. All
            rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
