<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount, createEventDispatcher } from "svelte";
    import { auth } from "$lib/firebase"; // Mengimpor 'auth' dari Firebase
    import type { User } from "firebase/auth";

    // Asumsi: Peran pengguna disimpan sebagai klaim kustom di token Firebase.
    // Jika tidak, Anda perlu memuat data peran dari Firestore atau Realtime DB.
    // let userRole:
    //     | "it"
    //     | "guest"
    //     | "accounting"
    //     | "ga"
    //     | "hr"
    //     | "s&m"
    //     | "office"
    //     | "hm"
    //     | "vm"
    //     | "it"
    //     | "unknown" = "unknown";

    let userRole: string = "it"; // Inisialisasi peran pengguna

    export let pageName = "";
    const dispatch = createEventDispatcher();

    // Menu lengkap, sama seperti yang Anda berikan
    const fullMenu = [
        {
            name: "Beranda",
            // Ikon emoji untuk Beranda
            icon: "🏠",
            url: "/backoffice",
            roles: [
                "it",
                "guest",
                "accounting",
                "ga",
                "hr",
                "s&m",
                "office",
                "hm",
                "vm",
            ],
        },
        {
            name: "Issues",
            // Ikon emoji untuk Issues
            icon: "📋",
            url: "/dashboard/issue",
            roles: ["it", "ga", "office", "hm", "vm", "accounting"],
        },
        {
            name: "Projects",
            // Ikon emoji untuk Projects
            icon: "📂",
            url: "/dashboard/project",
            roles: ["it", "ga", "office", "hm", "vm", "accounting"],
        },
        {
            name: "Purchase Orders",
            // Ikon emoji untuk Purchase Orders
            icon: "📦",
            url: "/dashboard/purchaseorder",
            roles: ["it", "guest", "accounting", "ga", "office", "hm", "vm"],
            sub: [
                {
                    name: "PO Item",
                    // Ikon emoji untuk PO Item
                    icon: "📝",
                    url: "/dashboard/purchaseorder/poitem",
                    roles: ["it", "ga", "office", "hm", "vm", "accounting"],
                },
            ],
        },
        {
            name: "Timesheets",
            // Ikon emoji untuk Timesheets
            icon: "⏰",
            url: "/dashboard/timesheets",
            roles: ["it", "ga", "hr", "office", "hm", "vm"],
        },
        {
            name: "Vendors",
            // Ikon emoji untuk Vendors
            icon: "🏢",
            url: "/dashboard/vendor",
            roles: ["it", "ga", "office", "hm", "vm"],
        },
        {
            name: "Inventory",
            // Ikon emoji untuk Inventory
            icon: "📦",
            url: "/dashboard/inventory",
            roles: ["it", "ga", "s&m", "office", "hm", "vm"],
        },
        {
            name: "Villa",
            // Ikon emoji untuk Villa
            icon: "🏡",
            url: "/dashboard/villa",
            roles: ["it", "ga", "s&m", "office", "hm", "vm"],
        },
        {
            name: "Transport",
            // Ikon emoji untuk Transport
            icon: "🚗",
            url: "/dashboard/transport",
            roles: ["it", "ga", "s&m", "office", "hm", "vm"],
        },
        {
            name: "Dining",
            // Ikon emoji untuk Dining
            icon: "🍽️",
            url: "/dashboard/dining",
            roles: ["it", "ga", "s&m", "office", "hm", "vm"],
        },
        {
            name: "Users",
            // Ikon emoji untuk Users
            icon: "👥",
            url: "/dashboard/account",
            roles: ["it"],
        },
        {
            name: "Feedback",
            // Ikon emoji untuk Feedback
            icon: "💬",
            url: "/dashboard/feedback",
            roles: ["it", "ga", "s&m", "office", "hm", "vm"],
        },
    ];

    let activeUrl = "/";
    let openMenus: Record<string, boolean> = {};

    onMount(() => {
        activeUrl = window.location.pathname;

        auth.onAuthStateChanged(async (user: User | null) => {
            if (user) {
                // // Mendapatkan token ID dan klaim kustom
                // const token = await user.getIdTokenResult();
                // const customClaims = token.claims;
                // if (customClaims.role) {
                //     userRole = customClaims.role as string;
                // }
                userRole = "it";
            }
        });

        // Perluas menu induk jika jalur saat ini cocok dengan sub menu
        for (const item of fullMenu) {
            if (item.sub?.some((s) => s.url === activeUrl)) {
                openMenus[item.name] = true;
            }
        }
    });

    function handleMenuClick(item: any) {
        if (item.sub) {
            goto(item.url);
            activeUrl = item.url;
            dispatch("changePage", item.name);
            openMenus[item.name] = !openMenus[item.name];
        } else {
            activeUrl = item.url;
            pageName = item.name;
            dispatch("changePage", item.name);
            goto(item.url);
        }
    }

    function handleSubClick(sub: any) {
        activeUrl = sub.url;
        dispatch("changePage", sub.name);
        goto(sub.url);
    }

    // Filter menu dan submenu sesuai peran
    $: filteredMenu = fullMenu
        .filter((item) => !item.roles || item.roles.includes(userRole))
        .map((item) => ({
            ...item,
            sub: item.sub
                ? item.sub.filter(
                      (sub) => !sub.roles || sub.roles.includes(userRole),
                  )
                : undefined,
        }));
</script>

<!-- Menggunakan font Poppins agar sesuai dengan layout utama -->
<div
    class="w-64 h-screen bg-white border-r border-gray-200 shadow-sm font-semibold text-lg"
    style="font-family: 'Futura PT', sans-serif;"
>
    <div class="p-8 border-b border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-800 tracking-wide">
            Backoffice
        </h1>
        <p class="text-sm text-gray-500">Kelola aplikasi Anda</p>
    </div>
    <ul class="p-4 space-y-2">
        {#each filteredMenu as item}
            <li>
                <button
                    class={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full
                        ${activeUrl === item.url ? "bg-indigo-100 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}
                        ${item.sub ? "justify-between" : ""}
                    `}
                    on:click|preventDefault={() => handleMenuClick(item)}
                    disabled
                >
                    <span class="flex items-center gap-4">
                        <!-- Mengganti SVG dengan emoji -->
                        <span class="text-xl leading-none">{item.icon}</span>
                        <span class="truncate">{item.name}</span>
                    </span>
                    {#if item.sub && item.sub.length}
                        <!-- Mengganti ▲/▼ dengan ikon SVG chevron yang berotasi -->
                        <span
                            class="transition-transform duration-200"
                            class:rotate-180={openMenus[item.name]}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                    {/if}
                </button>
                {#if item.sub && openMenus[item.name] && item.sub.length}
                    <ul class="ml-8 mt-1 space-y-1">
                        {#each item.sub as sub}
                            <li>
                                <a
                                    href={sub.url}
                                    class={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors duration-150
                                        ${activeUrl === sub.url ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-600 hover:bg-gray-100"}
                                    `}
                                    on:click|preventDefault={() =>
                                        handleSubClick(sub)}
                                >
                                    <!-- Mengganti SVG dengan emoji -->
                                    <span class="text-lg leading-none"
                                        >{sub.icon}</span
                                    >
                                    <span class="truncate">{sub.name}</span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</div>
