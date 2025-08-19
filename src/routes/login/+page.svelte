<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "$lib/firebase"; // Mengimpor 'auth' dari file firebase.ts
    import { goto } from "$app/navigation";
    import hotelLogo from "$lib/images/logohotel.png";

    let email: string = "admin@gmail.com";
    let password: string = "admin123";

    let loading: boolean = false;
    let error: string | null = null;

    async function handleLogin() {
        loading = true;
        error = null;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Arahkan pengguna ke halaman utama atau dashboard setelah berhasil login
            goto("/backoffice");
        } catch (e) {
            loading = false;
            if (e instanceof Error) {
                // Tangani pesan error dari Firebase
                if (e.message.includes("auth/user-not-found")) {
                    error = "Pengguna tidak ditemukan. Periksa email Anda.";
                } else if (e.message.includes("auth/wrong-password")) {
                    error = "Password salah. Coba lagi.";
                } else {
                    error = "Login gagal. Coba lagi nanti.";
                    console.error(e);
                }
            }
        }
    }
</script>

<link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
    rel="stylesheet"
/>

<div
    class="min-h-screen wordpress-bg text-gray-800 font-open-sans flex items-center justify-center p-4"
    style="font-family: 'Futura PT', sans-serif;"
>
    <div
        class="w-full max-w-md bg-white rounded-lg shadow-md p-8 md:p-12 border border-gray-200"
    >
        <div class="text-center mb-8">
            <img
                src={hotelLogo}
                alt="Logo Sungai Musi Hotel"
                class="mx-auto mb-4 w-20"
            />
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Masuk ke Akun Anda
            </h1>
            <p class="text-gray-500 font-medium">
                Silakan masukkan email dan password untuk melanjutkan.
            </p>
        </div>

        <div class="h-0.5 bg-gray-200 w-full mx-auto mb-8"></div>

        <form on:submit|preventDefault={handleLogin} class="space-y-6">
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
                    required
                    class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
                    placeholder="contoh@email.com"
                />
            </div>

            <div>
                <label
                    for="password"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    required
                    class="w-full px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400"
                    placeholder="Masukkan password Anda"
                />
            </div>

            {#if error}
                <div
                    class="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
                    role="alert"
                >
                    <p>{error}</p>
                </div>
            {/if}

            <button
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
                    Login
                {/if}
            </button>

            <div class="text-center mt-4">
                <!-- secured -->
                <p class="text-sm text-gray-500">
                    Secured By SMAR Labs Group
                    <!-- <p class="text-sm text-gray-500">
                    Belum punya akun?
                    <a
                        href="/signup"
                        class="text-blue-500 hover:underline font-semibold"
                        >Daftar di sini</a
                    >
                </p> -->
                </p>
            </div>
        </form>
    </div>
</div>

<style>
    .wordpress-bg {
        background-color: #f8f9fa;
    }
</style>
