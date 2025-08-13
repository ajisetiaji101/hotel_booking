<script>
  import { onMount } from 'svelte';
  import { getAuth, signInAnonymously } from 'firebase/auth';
  import { initializeApp } from 'firebase/app';

  // The following global variables are provided by the canvas environment.
  // DO NOT CHANGE their names or values.
  // We use different variable names here to avoid a self-reference error
  // that can occur with `const` declarations in certain environments.
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfigString = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  // Pastikan variabel firebaseConfig tidak diinisialisasi ulang
  let firebaseApp = null;
  let auth = null;
  let isFirebaseInitialized = false;

  // Inisialisasi Firebase hanya jika konfigurasi valid
  if (firebaseConfigString !== '{}' && firebaseConfigString !== '') {
    try {
      const firebaseConfig = JSON.parse(firebaseConfigString);
      firebaseApp = initializeApp(firebaseConfig);
      auth = getAuth(firebaseApp);
      isFirebaseInitialized = true;
    } catch (e) {
      console.error("Gagal menginisialisasi Firebase. Konfigurasi tidak valid.", e);
    }
  } else {
    console.warn("Konfigurasi Firebase tidak ditemukan. Beberapa fitur mungkin tidak berfungsi.");
  }

  let fullName = '';
  let email = '';
  let checkin = '';
  let checkout = '';
  let roomType = '';
  let terms = false;

  let loading = false;
  let paymentStatus = null;
  let authReady = false;

  // Simple validation state
  let errors = {
    fullName: '',
    email: '',
    checkin: '',
    checkout: '',
    roomType: '',
    terms: '',
  };

  function validateForm() {
    errors = {
      fullName: '',
      email: '',
      checkin: '',
      checkout: '',
      roomType: '',
      terms: '',
    };
    let isValid = true;
    if (!fullName) { errors.fullName = 'Nama lengkap wajib diisi.'; isValid = false; }
    if (!email) { errors.email = 'Email wajib diisi.'; isValid = false; }
    if (!checkin) { errors.checkin = 'Tanggal check-in wajib diisi.'; isValid = false; }
    if (!checkout) { errors.checkout = 'Tanggal check-out wajib diisi.'; isValid = false; }
    if (!roomType) { errors.roomType = 'Pilihan kamar wajib diisi.'; isValid = false; }
    if (!terms) { errors.terms = 'Anda harus menyetujui syarat dan ketentuan.'; isValid = false; }
    return isValid;
  }

  async function onSubmit() {
    if (!validateForm()) {
      return;
    }

    if (!authReady) {
      console.error("Authentication not ready.");
      return;
    }

    loading = true;

    // Hitung total harga
    const roomRates = {
      superior: 500000,
      deluxe: 800000,
      suite: 1500000
    };
    const roomPrice = roomRates[roomType];
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const stayDuration = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const grossAmount = roomPrice * stayDuration;

    // Data transaksi untuk Midtrans
    const transactionDetails = {
      order_id: `booking-${appId}-${Math.random().toString(36).substring(2, 9)}`,
      gross_amount: grossAmount,
    };

    const customerDetails = {
      first_name: fullName,
      email: email,
    };

    try {
      const payload = {
        transaction_details: transactionDetails,
        customer_details: customerDetails,
      };

      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate a Midtrans Snap Token for the following booking: ${JSON.stringify(payload)}` }]
          }]
        }),
      });

      const result = await apiResponse.json();
      const snapToken = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (snapToken) {
        loading = false;
        // Tampilkan pop-up Midtrans
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            paymentStatus = "Pembayaran berhasil!";
            console.log(result);
          },
          onPending: (result) => {
            paymentStatus = "Pembayaran sedang diproses.";
            console.log(result);
          },
          onError: (result) => {
            paymentStatus = "Pembayaran gagal!";
            console.log(result);
          },
          onClose: () => {
            console.log('Pop-up Midtrans ditutup tanpa pembayaran.');
          }
        });
      }
    } catch (error) {
      console.error("Gagal mendapatkan Snap Token:", error);
      loading = false;
      paymentStatus = "Terjadi kesalahan saat memproses pembayaran.";
    }
  }

  // Load Midtrans Snap.js script and handle Firebase auth on component mount
  onMount(async () => {
    // Firebase Anonymous Sign-in
    if (isFirebaseInitialized) {
        try {
          if (initialAuthToken) {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Error during anonymous sign-in:", error);
        } finally {
          authReady = true;
        }
    } else {
        authReady = true; // Lanjutkan tanpa auth jika Firebase tidak terinisialisasi
    }

    // Load Midtrans Snap.js
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let script = document.createElement('script');
    script.src = midtransScriptUrl;
    // GANTI 'YOUR_CLIENT_KEY' dengan kunci client Midtrans Anda yang sebenarnya
    script.setAttribute('data-client-key', 'YOUR_CLIENT_KEY');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });
</script>

<div class="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
  <div class="absolute inset-0 z-0 bg-gray-950 opacity-90 backdrop-filter backdrop-blur-lg"></div>

  <div class="relative z-10 w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 transform transition-all duration-500 ease-in-out hover:scale-105">
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2 drop-shadow-md">
        Pesan Kamar Hotel 🛎️
      </h1>
      <p class="text-gray-300">
        Nikmati pengalaman menginap terbaik dengan reservasi mudah.
      </p>
    </div>

    <form on:submit|preventDefault={onSubmit} class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-200 mb-1">
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={fullName}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          {#if errors.fullName}
            <p class="mt-1 text-sm text-red-400">{errors.fullName}</p>
          {/if}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-200 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          {#if errors.email}
            <p class="mt-1 text-sm text-red-400">{errors.email}</p>
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="checkin" class="block text-sm font-medium text-gray-200 mb-1">
            Tanggal Check-in
          </label>
          <input
            id="checkin"
            type="date"
            bind:value={checkin}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          {#if errors.checkin}
            <p class="mt-1 text-sm text-red-400">{errors.checkin}</p>
          {/if}
        </div>

        <div>
          <label for="checkout" class="block text-sm font-medium text-gray-200 mb-1">
            Tanggal Check-out
          </label>
          <input
            id="checkout"
            type="date"
            bind:value={checkout}
            on:blur={() => validateForm()}
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          {#if errors.checkout}
            <p class="mt-1 text-sm text-red-400">{errors.checkout}</p>
          {/if}
        </div>
      </div>

      <div>
        <label for="roomType" class="block text-sm font-medium text-gray-200 mb-1">
          Pilih Tipe Kamar
        </label>
        <select
          id="roomType"
          bind:value={roomType}
          on:blur={() => validateForm()}
          class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <option value="">Pilih...</option>
          <option value="superior">Superior Room (Rp 500.000 / malam)</option>
          <option value="deluxe">Deluxe Room (Rp 800.000 / malam)</option>
          <option value="suite">Suite Room (Rp 1.500.000 / malam)</option>
        </select>
        {#if errors.roomType}
          <p class="mt-1 text-sm text-red-400">{errors.roomType}</p>
        {/if}
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          bind:checked={terms}
          on:change={() => validateForm()}
          class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label for="terms" class="text-sm font-medium text-gray-200">
          Saya menyetujui syarat dan ketentuan
        </label>
      </div>
      {#if errors.terms}
        <p class="mt-1 text-sm text-red-400">{errors.terms}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <span class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </span>
        {:else}
          Pesan Sekarang
        {/if}
      </button>
    </form>

    {#if paymentStatus}
      <div class="mt-6 p-4 rounded-lg text-center font-semibold text-lg" style="background-color: #2d3748; border-color: #4a5568;">
        <p class="{paymentStatus.includes('berhasil') ? 'text-green-400' : 'text-red-400'}">
          {paymentStatus}
        </p>
      </div>
    {/if}
  </div>

  <div id="payment-modal-container" class="fixed inset-0 z-50"></div>
</div>
