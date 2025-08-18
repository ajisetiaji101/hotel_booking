<!--
  Halaman Konfirmasi Pembayaran
  
  Komponen Svelte ini menampilkan halaman konfirmasi pembayaran yang telah berhasil,
  dirancang dengan gaya yang elegan dan modern, bertema biru dan putih.

  Fitur-fitur utama:
  - Palet warna biru dan putih yang cerah dengan gradien latar belakang yang lembut.
  - Animasi masuk (transitions) yang halus untuk setiap elemen.
  - Ikon 'checkmark' dengan animasi goresan (stroke animation).
  - Tombol-tombol yang interaktif dengan efek hover yang elegan.
-->
<script>
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";

    // Data booking contoh. Ganti dengan data nyata saat menggunakan komponen ini.
    export let bookingData = {
        fullName: "Jane Doe",
        orderId: "HL-2025-000873",
        hotelName: "Aurelia Grand Hotel",
        roomType: "Deluxe King with City View",
        checkin: "2025-08-20",
        checkout: "2025-08-23",
        nights: 3,
        guests: 2,
        amountPaid: 2975000, // IDR
        currency: "IDR",
        paymentMethod: "Midtrans – BCA Virtual Account",
        bookedAt: new Date().toISOString(),
        email: "jane@example.com",
        phone: "+62 812-3456-7890",
    };

    // Fungsi pembantu untuk memformat mata uang.
    const formatMoney = (value, currency = "IDR") => {
        try {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency,
            }).format(value);
        } catch (_) {
            return `${currency} ${value.toLocaleString("id-ID")}`;
        }
    };

    // Fungsi pembantu untuk memformat tanggal lengkap.
    const formatDate = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        return d.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Fungsi pembantu untuk memformat tanggal singkat.
    const shortDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    let copied = false;
    let printing = false;

    // Fungsi untuk menyalin ID pemesanan ke clipboard.
    function copyOrderId() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(bookingData.orderId).then(() => {
                copied = true;
                setTimeout(() => (copied = false), 1500);
            });
        }
    }

    // Fungsi untuk mencetak halaman.
    function printReceipt() {
        printing = true;
        setTimeout(() => window.print(), 50);
        setTimeout(() => (printing = false), 500);
    }

    onMount(() => {
        // Gulir ke atas halaman saat komponen dimuat.
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
</script>

<!--
  Struktur Halaman Utama
  Menggunakan palet warna biru dan putih yang cerah dengan gradien lembut di latar belakang.
-->
<div
    class="min-h-[100svh] bg-gradient-to-br from-blue-50 via-white to-white font-sans antialiased text-gray-800 transition-colors duration-300"
    style="font-family: 'Futura PT', sans-serif;"
>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:p-0">
        <!-- Header & Pesan Konfirmasi -->
        <div
            class="flex flex-col items-center text-center"
            in:fade={{ delay: 100, duration: 400 }}
        >
            <!-- Ikon Sukses Animasi -->
            <div
                class="relative w-24 h-24 mb-6"
                in:scale={{ duration: 300, delay: 200, start: 0.5 }}
            >
                <div class="absolute inset-0 rounded-full bg-blue-100"></div>
                <!-- Checkmark SVG dengan animasi stroke -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-full w-full relative z-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path
                        class="stroke-blue-600 checkmark"
                        d="M9 12l2 2 4-4"
                        fill="none"
                    />
                    <circle
                        class="stroke-gray-300 opacity-20"
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="none"
                        fill="currentColor"
                    />
                </svg>
            </div>

            <h1
                class="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
                in:fly={{ y: -20, delay: 400, duration: 400 }}
            >
                Pembayaran Berhasil.
            </h1>
            <p
                class="mt-2 text-base text-gray-600"
                in:fade={{ delay: 600, duration: 400 }}
            >
                Terima kasih, <span class="font-semibold text-gray-800"
                    >{bookingData.fullName}</span
                >. Pesanan Anda sudah dikonfirmasi!
            </p>
        </div>

        <!-- Kartu Ringkasan -->
        <section
            class="mt-10 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-0"
            in:fly={{ y: 50, delay: 800, duration: 500 }}
        >
            <!-- Ribbon/Header Status -->
            <div
                class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 flex items-center justify-between font-semibold print:hidden"
            >
                <span class="flex items-center gap-2">
                    ID Pemesanan:
                    <code
                        class="bg-white/20 rounded px-2 py-0.5 text-sm tracking-wide"
                    >
                        {bookingData.orderId}
                    </code>
                    <button
                        class="ml-2 text-white/90 hover:text-white underline-offset-4 decoration-dashed underline transition-all duration-200"
                        on:click={copyOrderId}
                    >
                        {#if copied}Tersalin!{/if}
                        {#if !copied}Salin{/if}
                    </button>
                </span>
                <span class="text-sm opacity-80 hidden sm:block">
                    {new Date(bookingData.bookedAt).toLocaleString("id-ID")}
                </span>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
                <!-- Detail Booking (kiri) -->
                <div class="md:col-span-3 space-y-6">
                    <div class="space-y-1">
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
                            {bookingData.hotelName}
                        </h2>
                        <p class="text-sm text-gray-600">
                            {bookingData.roomType}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            class="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 transition-shadow hover:shadow-md"
                        >
                            <div
                                class="text-xs uppercase tracking-wide text-gray-500"
                            >
                                Check-in
                            </div>
                            <div class="mt-2 font-semibold text-lg">
                                {shortDate(bookingData.checkin)}
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Pukul 14.00 WIB
                            </div>
                        </div>
                        <div
                            class="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 transition-shadow hover:shadow-md"
                        >
                            <div
                                class="text-xs uppercase tracking-wide text-gray-500"
                            >
                                Check-out
                            </div>
                            <div class="mt-2 font-semibold text-lg">
                                {shortDate(bookingData.checkout)}
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Sebelum 12.00 WIB
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="p-4 rounded-xl border border-gray-200">
                            <div class="text-xs uppercase text-gray-500">
                                Malam
                            </div>
                            <div class="mt-1 font-medium">
                                {bookingData.nights}
                            </div>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200">
                            <div class="text-xs uppercase text-gray-500">
                                Tamu
                            </div>
                            <div class="mt-1 font-medium">
                                {bookingData.guests}
                            </div>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200">
                            <div class="text-xs uppercase text-gray-500">
                                Email
                            </div>
                            <div class="mt-1 font-medium break-all">
                                {bookingData.email}
                            </div>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200">
                            <div class="text-xs uppercase text-gray-500">
                                Telepon
                            </div>
                            <div class="mt-1 font-medium">
                                {bookingData.phone}
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-xl bg-blue-50 border border-blue-100 p-4"
                    >
                        <div class="text-sm text-blue-800 font-medium">
                            Simpan dokumen identitas dan tunjukkan ID pemesanan
                            ini saat check-in. Nikmati masa inap Anda!
                        </div>
                    </div>
                </div>

                <!-- Ringkasan Pembayaran (kanan) -->
                <div class="md:col-span-2">
                    <div
                        class="rounded-2xl border border-gray-200 p-6 bg-gray-50 transition-shadow hover:shadow-lg"
                    >
                        <h3 class="font-semibold text-lg text-gray-900">
                            Ringkasan Pembayaran
                        </h3>
                        <div class="mt-5 space-y-4 text-sm">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600"
                                    >Metode Pembayaran</span
                                >
                                <span class="font-medium text-right"
                                    >{bookingData.paymentMethod}</span
                                >
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600"
                                    >Tanggal Transaksi</span
                                >
                                <span class="font-medium"
                                    >{formatDate(bookingData.bookedAt)}</span
                                >
                            </div>
                            <div
                                class="border-t border-dashed border-gray-300 pt-4"
                            ></div>
                            <div
                                class="flex items-center justify-between text-base font-bold"
                            >
                                <span>Total Dibayar</span>
                                <span class="text-blue-600"
                                    >{formatMoney(
                                        bookingData.amountPaid,
                                        bookingData.currency,
                                    )}</span
                                >
                            </div>
                        </div>

                        <div
                            class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden"
                        >
                            <button
                                class="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-semibold text-white shadow-md hover:shadow-lg active:scale-95"
                                on:click={printReceipt}
                            >
                                {#if printing}Menyiapkan...{/if}
                                {#if !printing}Unduh (PDF){/if}
                            </button>
                            <a
                                href="/bookings/{bookingData.orderId}"
                                class="w-full h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors duration-200 grid place-items-center font-medium shadow-sm hover:shadow-md"
                            >
                                Detail
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Catatan Kaki -->
            <div class="px-8 pb-8 text-xs text-center text-gray-500">
                Dengan melanjutkan, Anda menyetujui <a
                    href="/terms"
                    class="underline underline-offset-2 hover:text-gray-600 transition"
                    >Syarat & Ketentuan</a
                >
                dan
                <a
                    href="/privacy"
                    class="underline underline-offset-2 hover:text-gray-600 transition"
                    >Kebijakan Privasi</a
                >.
            </div>
        </section>

        <!-- CTA Bawah -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <a
                href="/"
                class="h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition grid place-items-center font-medium"
                >Kembali ke Beranda</a
            >
        </div>
    </div>
</div>

<style>
    /* Animasi stroke untuk checkmark */
    .checkmark {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: draw-checkmark 1s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    @keyframes draw-checkmark {
        to {
            stroke-dashoffset: 0;
        }
    }

    /* Penyesuaian untuk pencetakan */
    @media print {
        :global(body) {
            background: #fff;
        }
        .print\:hidden {
            display: none !important;
        }
        .print\:p-0 {
            padding: 0 !important;
        }
    }
</style>
