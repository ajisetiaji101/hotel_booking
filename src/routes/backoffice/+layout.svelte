<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase"; // Import 'auth' from firebase.ts
    import type { User } from "firebase/auth";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let notifications = 3;
    let currentUser: any | null = null;
    let showDropdown = false;
    let loading = true;
    let pageName = "Dashboard";

    // Uncomment these sections to enable the authentication logic
    // onMount(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             currentUser = user;
    //         } else {
    //             goto("/login");
    //         }
    //         loading = false;
    //     });
    //
    //     return () => unsubscribe();
    // });

    function handleLogout() {
        if (confirm("Apakah Anda yakin ingin keluar?")) {
            logout();
        }
    }

    async function logout() {
        try {
            await auth.signOut();
            goto("/login");
        } catch (error) {
            console.error("Gagal keluar:", error);
        }
    }
</script>

<link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
/>

<div class="flex h-screen bg-gray-50 overflow-hidden font-poppins">
    <Sidebar {pageName} on:changePage={(e) => (pageName = e.detail)} />

    <div
        class="flex-1 flex flex-col overflow-hidden"
        style="font-family: 'Futura PT', sans-serif;"
    >
        <header
            class="flex items-center justify-between px-8 py-4 bg-white shadow-sm z-10 border-b border-gray-200"
        >
            <h1 class="text-3xl font-semibold text-gray-800 tracking-wide">
                {pageName}
            </h1>
            <div class="flex items-center gap-6">
                <div class="relative group">
                    <button
                        class="text-gray-500 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
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
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>
                    {#if notifications > 0}
                        <span
                            class="absolute top-1 right-1 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white"
                            >{notifications}</span
                        >
                    {/if}
                </div>

                <div class="relative text-lg">
                    <button
                        class="flex items-center gap-2 focus:outline-none transition-all duration-200 group"
                        on:click={() => (showDropdown = !showDropdown)}
                    >
                        <img
                            src={"https://i.pravatar.cc/40?u=1"}
                            alt="User Avatar"
                            class="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-400 transition-colors duration-200"
                        />
                        <span
                            class="font-semibold text-gray-700 hidden sm:block group-hover:text-indigo-600 transition-colors duration-200"
                            >Tamu</span
                        >
                        <svg
                            class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {#if showDropdown}
                        <div
                            class="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden text-md"
                        >
                            <div class="p-4 border-b border-gray-200">
                                <div class="font-semibold text-gray-800">
                                    {currentUser?.displayName ||
                                        currentUser?.email ||
                                        "Tamu"}
                                </div>
                                <div class="text-gray-500 mt-1">
                                    {currentUser?.email || "example@mail.com"}
                                </div>
                            </div>
                            <button
                                class="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150 w-full text-left"
                                disabled
                            >
                                <span class="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Profil
                                </span>
                            </button>
                            <button
                                on:click={handleLogout}
                                class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 border-t border-gray-200"
                            >
                                <span class="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Keluar
                                </span>
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </header>

        <main class="flex-1 p-8 overflow-y-auto">
            <slot />
        </main>
    </div>
</div>
