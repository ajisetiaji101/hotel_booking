<script lang="ts">
  import { onMount } from "svelte";
  import { signInAnonymously } from "firebase/auth";
  import { auth } from "$lib/firebase"; // Mengimpor 'auth' dari file firebase.ts
  import { browser } from "$app/environment"; // Mengimpor 'browser' dari SvelteKit
  import { goto } from "$app/navigation";
  import hotelLogo from "$lib/images/logohotel.png";

  // Variabel global yang disediakan oleh lingkungan kanvas.
  // JANGAN mengubah nama atau nilainya.

  // Deklarasi variabel dengan tipe eksplisit
  let fullName: string = "tes";
  let email: string = "tes@domain.com";
  let checkin: string = "2023-10-20";
  let checkout: string = "2023-10-25";
  let roomType: string = "superior";
  let terms: boolean = true;

  let loading: boolean = false;
  let paymentStatus: string | null = null;

  // Status validasi sederhana dengan tipe
  type FormErrors = {
    fullName: string;
    email: string;
    checkin: string;
    checkout: string;
    roomType: string;
    terms: string;
  };
  let errors: FormErrors = {
    fullName: "",
    email: "",
    checkin: "",
    checkout: "",
    roomType: "",
    terms: "",
  };

  function validateForm(): boolean {
    errors = {
      fullName: "",
      email: "",
      checkin: "",
      checkout: "",
      roomType: "",
      terms: "",
    };
    let isValid: boolean = true;
    if (!fullName) {
      errors.fullName = "Nama lengkap wajib diisi.";
      isValid = false;
    }
    if (!email) {
      errors.email = "Email wajib diisi.";
      isValid = false;
    }
    if (!checkin) {
      errors.checkin = "Tanggal check-in wajib diisi.";
      isValid = false;
    }
    if (!checkout) {
      errors.checkout = "Tanggal check-out wajib diisi.";
      isValid = false;
    }
    if (!roomType) {
      errors.roomType = "Pilihan kamar wajib diisi.";
      isValid = false;
    }
    if (!terms) {
      errors.terms = "Anda harus menyetujui syarat dan ketentuan.";
      isValid = false;
    }
    return isValid;
  }

  async function onSubmit() {
    if (!validateForm()) {
      return;
    }

    loading = true;

    // Hitung total harga
    const roomRates: { [key: string]: number } = {
      superior: 500000,
      deluxe: 800000,
      suite: 1500000,
    };
    const roomPrice: number = roomRates[roomType];
    const checkinDate: Date = new Date(checkin);
    const checkoutDate: Date = new Date(checkout);
    const timeDiff: number = checkoutDate.getTime() - checkinDate.getTime();
    const stayDuration: number = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const grossAmount: number = roomPrice * stayDuration;

    const customerDetails = {
      first_name: fullName,
      email: email,
    };

    try {
      const apiUrl = `https://api.smarlabs.biz.id/api/files/midtrans`;

      const apiResponse = await fetch(apiUrl + "?gross_amount=" + grossAmount, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await apiResponse.json();

      console.log("data hit", result);

      const snapToken = result.data;

      if (snapToken && browser) {
        // Memastikan kode hanya berjalan di browser
        loading = false;
        // Tampilkan pop-up Midtrans
        (window as any).snap.pay(snapToken, {
          onSuccess: (result: any) => {
            paymentStatus = "Pembayaran berhasil!";
            console.log(result);
          },
          onPending: (result: any) => {
            paymentStatus = "Pembayaran sedang diproses.";
            console.log(result);
          },
          onError: (result: any) => {
            paymentStatus = "Pembayaran gagal!";
            console.log(result);
          },
          onClose: () => {
            console.log("Pop-up Midtrans ditutup tanpa pembayaran.");
          },
        });
      }
    } catch (error) {
      console.error("Gagal mendapatkan Snap Token:", error);
      loading = false;
      paymentStatus = "Terjadi kesalahan saat memproses pembayaran.";
    }
  }

  // Muat skrip Midtrans Snap.js dan tangani otentikasi Firebase saat komponen dipasang
  onMount(() => {
    // Muat skrip Midtrans Snap.js hanya di sisi klien
    let script: HTMLScriptElement | null = null;
    if (browser) {
      const midtransScriptUrl: string =
        "https://app.sandbox.midtrans.com/snap/snap.js";
      script = document.createElement("script");
      script.src = midtransScriptUrl;
      // GANTI 'YOUR_CLIENT_KEY' dengan kunci klien Midtrans Anda yang sebenarnya
      script.setAttribute("data-client-key", "SB-Mid-client-i-ynxgOPgCVtDkRt");
      document.body.appendChild(script);
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  });
</script>

<!-- Menggunakan Google Font "Open Sans" untuk tampilan yang lebih klasik -->
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
  rel="stylesheet"
/>

<div
  class="min-h-screen wordpress-bg text-gray-800 font-open-sans flex items-center justify-center p-4"
  style="font-family: 'Futura PT', sans-serif;"
>
  <div
    class="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 md:p-12 border border-gray-200"
  >
    <!-- Header dengan tipografi yang sederhana dan jelas -->
    <div class="text-center mb-8">
      <img
        src={hotelLogo}
        alt="Logo Sungai Musi Hotel"
        class="mx-auto mb-4 w-20"
      />
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        SUNGAI MUSI HOTEL
      </h1>
      <p class="text-gray-500 font-medium">
        Nikmati pengalaman menginap terbaik dengan pemesanan mudah.
      </p>
    </div>

    <!-- Divider dekoratif yang lebih sederhana -->
    <div class="h-0.5 bg-gray-200 w-full mx-auto mb-8"></div>

    <form on:submit|preventDefault={onSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="fullName"
            class="block text-sm font-semibold text-gray-700 mb-1"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={fullName}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
            placeholder="Masukkan nama lengkap Anda"
          />
          {#if errors.fullName}
            <p class="mt-1 text-sm text-red-500 font-medium">
              {errors.fullName}
            </p>
          {/if}
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-semibold text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
            placeholder="contoh@email.com"
          />
          {#if errors.email}
            <p class="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="checkin"
            class="block text-sm font-semibold text-gray-700 mb-1"
          >
            Tanggal Check-in
          </label>
          <input
            id="checkin"
            type="date"
            bind:value={checkin}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
          {#if errors.checkin}
            <p class="mt-1 text-sm text-red-500 font-medium">
              {errors.checkin}
            </p>
          {/if}
        </div>

        <div>
          <label
            for="checkout"
            class="block text-sm font-semibold text-gray-700 mb-1"
          >
            Tanggal Check-out
          </label>
          <input
            id="checkout"
            type="date"
            bind:value={checkout}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
          {#if errors.checkout}
            <p class="mt-1 text-sm text-red-500 font-medium">
              {errors.checkout}
            </p>
          {/if}
        </div>
      </div>

      <div>
        <label
          for="roomType"
          class="block text-sm font-semibold text-gray-700 mb-1"
        >
          Pilih Tipe Kamar
        </label>
        <select
          id="roomType"
          bind:value={roomType}
          on:blur={() => validateForm()}
          class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        >
          <option value="">Pilih...</option>
          <option value="superior">Superior Room (Rp 500.000 / malam)</option>
          <option value="deluxe">Deluxe Room (Rp 800.000 / malam)</option>
          <option value="suite">Suite Room (Rp 1.500.000 / malam)</option>
        </select>
        {#if errors.roomType}
          <p class="mt-1 text-sm text-red-500 font-medium">
            {errors.roomType}
          </p>
        {/if}
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          bind:checked={terms}
          on:change={() => validateForm()}
          class="w-4 h-4 text-blue-500 bg-white border-gray-300 rounded focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        />
        <label for="terms" class="text-sm font-medium text-gray-700">
          Saya menyetujui syarat dan ketentuan
        </label>
      </div>
      {#if errors.terms}
        <p class="mt-1 text-sm text-red-500 font-medium">{errors.terms}</p>
      {/if}

      <button
        id="pay-button"
        type="submit"
        disabled={loading}
        class="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-md shadow-sm hover:shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <span class="flex items-center justify-center">
            <svg
              class="animate-spin h-5 w-5 mr-3 text-white"
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
            Memproses...
          </span>
        {:else}
          Pesan Sekarang
        {/if}
      </button>
      <!-- kembali -->
      <button
        type="button"
        on:click={() => {
          // Kembali ke halaman sebelumnya
          goto("/");
        }}
        class="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md shadow-sm hover:shadow-md hover:bg-gray-300 transition-all duration-300 ease-in-out"
      >
        Kembali
      </button>

      <button
        type="button"
        on:click={() => {
          // Kembali ke halaman sebelumnya
          goto("/finish");
        }}
        class="w-full text-gray-800 font-bold py-2 px-4transition-all duration-300 ease-in-out underline"
      >
        Display Finish
      </button>
    </form>

    {#if paymentStatus}
      <div
        class="mt-6 p-4 rounded-md text-center font-semibold text-lg bg-gray-100 border border-gray-200"
      >
        <p
          class={paymentStatus.includes("berhasil")
            ? "text-green-600"
            : "text-red-600"}
        >
          {paymentStatus}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Menggunakan warna solid dan bersih untuk latar belakang */
  .wordpress-bg {
    background-color: #f8f9fa;
  }
</style>
