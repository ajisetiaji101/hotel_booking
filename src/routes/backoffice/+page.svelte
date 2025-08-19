<script lang="ts">
    import { onMount } from "svelte";
    import { collection, getDocs } from "firebase/firestore";
    import HeroIcon from "$lib/components/HeroIcon.svelte";
    import { cubicOut, quintOut } from "svelte/easing";
    import { tweened } from "svelte/motion";
    import type { Tweened } from "svelte/motion";
    import ChartAktivitas from "$lib/components/ChartAktivitas.svelte";
    import { fade, fly, slide } from "svelte/transition";

    type StatKey =
        | "vb_profit"
        | "vb_purchase_orders"
        | "vb_issues"
        | "vb_villas"
        | "vb_timesheet"
        | "vb_inventory"
        | "vb_projects"
        | "vb_vendor"
        | "vb_employee"
        | "vb_transport"
        | "vb_dinning"
        | "vb_feedback";

    // This object will hold our `tweened` store instances
    const tweenedStats: Record<StatKey, Tweened<number>> = {
        vb_profit: tweened(0),
        vb_purchase_orders: tweened(0),
        vb_issues: tweened(0),
        vb_villas: tweened(0),
        vb_timesheet: tweened(0),
        vb_inventory: tweened(0),
        vb_projects: tweened(0),
        vb_vendor: tweened(0),
        vb_employee: tweened(0),
        vb_transport: tweened(0),
        vb_dinning: tweened(0),
        vb_feedback: tweened(0),
    };

    // This object will hold the *values* from the tweened stores, and will be reactive
    let stats: Record<StatKey, number> = {
        vb_profit: 0,
        vb_purchase_orders: 0,
        vb_issues: 0,
        vb_villas: 0,
        vb_timesheet: 0,
        vb_inventory: 0,
        vb_projects: 0,
        vb_vendor: 0,
        vb_employee: 0,
        vb_transport: 0,
        vb_dinning: 0,
        vb_feedback: 0,
    };

    let isLoading = true;

    const items: {
        label: string;
        key: StatKey;
        color: string;
        icon: string;
        bgColor: string;
    }[] = [
        {
            label: "Total Profit",
            key: "vb_profit",
            color: "text-blue-600",
            icon: "currency-dollar",
            bgColor: "bg-blue-100",
        },
        {
            label: "Total Issues",
            key: "vb_issues",
            color: "text-red-600",
            icon: "exclamation-triangle",
            bgColor: "bg-red-100",
        },
        {
            label: "Total Projects",
            key: "vb_projects",
            color: "text-purple-600",
            icon: "folder",
            bgColor: "bg-purple-100",
        },
        {
            label: "Total POs",
            key: "vb_purchase_orders",
            color: "text-blue-600",
            icon: "document",
            bgColor: "bg-blue-100",
        },
        {
            label: "Total Villas",
            key: "vb_villas",
            color: "text-green-600",
            icon: "home",
            bgColor: "bg-green-100",
        },
        {
            label: "Total Timesheets",
            key: "vb_timesheet",
            color: "text-gray-800",
            icon: "clock",
            bgColor: "bg-gray-100",
        },
        {
            label: "Total Inventories",
            key: "vb_inventory",
            color: "text-yellow-600",
            icon: "cube",
            bgColor: "bg-yellow-100",
        },
        {
            label: "Total Vendors",
            key: "vb_vendor",
            color: "text-orange-600",
            icon: "building-storefront",
            bgColor: "bg-orange-100",
        },
        {
            label: "Total Employees",
            key: "vb_employee",
            color: "text-teal-600",
            icon: "user-group",
            bgColor: "bg-teal-100",
        },
        {
            label: "Total Transport",
            key: "vb_transport",
            color: "text-indigo-600",
            icon: "truck",
            bgColor: "bg-indigo-100",
        },
        {
            label: "Total Dining",
            key: "vb_dinning",
            color: "text-pink-600",
            icon: "utensils",
            bgColor: "bg-pink-100",
        },
        {
            label: "Total Feedback",
            key: "vb_feedback",
            color: "text-gray-600",
            icon: "comments",
            bgColor: "bg-gray-100",
        },
    ];

    let showChart = false;

    function toggleChart() {
        showChart = !showChart;
    }

    onMount(async () => {
        const fetchCount = async (table: string) => {
            try {
                // Since firestore isn't configured, we'll use a random number for demonstration
                return Math.floor(Math.random() * 1000) + 10;
                // const querySnapshot = await getDocs(
                //     collection(firestore, table),
                // );
                // return querySnapshot.size;
            } catch (error) {
                console.error(`Error fetching count for ${table}:`, error);
                return 0;
            }
        };

        const promises = items.map(async (item) => {
            const count = await fetchCount(item.key);
            // Set the tweened store's value
            tweenedStats[item.key].set(count, {
                duration: 1000,
                easing: quintOut,
            });

            // Subscribe to the tweened store and update the 'stats' variable
            tweenedStats[item.key].subscribe((val) => {
                stats = { ...stats, [item.key]: Math.round(val) };
            });
        });

        await Promise.all(promises);
        isLoading = false;
        console.log("Dashboard data fetched successfully and animated!");
    });
</script>

<div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    style="font-family: 'Futura PT', sans-serif;"
>
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        {#each items as item}
            <div
                class="bg-white p-6 rounded-xl shadow-lg border border-gray-100
                relative flex flex-col items-center justify-center text-center
                transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl hover:border-blue-300
                {isLoading ? 'animate-pulse-light' : ''}"
            >
                <!-- Ikon Tautan Baru di sini -->
                <button
                    on:click={toggleChart}
                    class="absolute top-4 right-4 text-gray-400 hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                    title={`Lihat detail ${item.label}`}
                >
                    <HeroIcon name="chart-bar" />
                </button>

                <div
                    class="relative w-14 h-14 rounded-full {item.bgColor}
                    flex items-center justify-center mb-4 transition-all duration-300 ease-in-out
                    group-hover:scale-110"
                >
                    <HeroIcon name={item.icon} colorClass={item.color} />
                    <div
                        class="absolute inset-0 rounded-full ring-2 ring-transparent transition-all duration-300 ease-in-out
                        group-hover:ring-blue-200"
                    ></div>
                </div>

                <h2
                    class="text-md font-semibold text-gray-700 mb-2 whitespace-nowrap"
                >
                    {item.label}
                </h2>
                {#if isLoading}
                    <div class="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
                {:else}
                    <p class={`text-3xl font-extrabold ${item.color}`}>
                        {stats[item.key]}
                    </p>
                {/if}
            </div>
        {/each}
    </div>
</div>

{#if showChart}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/60"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 flex flex-col h-[70vh] max-h-[90vh]"
            transition:slide={{ duration: 300, easing: cubicOut }}
        >
            <div class="flex-grow overflow-y-auto">
                <ChartAktivitas />
            </div>

            <button
                class="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                on:click={() => (showChart = false)}
                aria-label="Close modal"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="h-6 w-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    </div>
{/if}

<style>
    /* Custom animations for a smoother feel */
    @keyframes pulse-light {
        0%,
        100% {
            background-color: #ffffff; /* white */
        }
        50% {
            background-color: #f3f4f6; /* gray-100 */
        }
    }

    .animate-pulse-light {
        animation: pulse-light 2s infinite ease-in-out;
    }
</style>
