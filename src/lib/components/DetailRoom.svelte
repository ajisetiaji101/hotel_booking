<script lang="ts">
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    export let room: any = {};
    export let isOpen = false;

    const dispatch = createEventDispatcher();

    function closeModal() {
        isOpen = false;
        dispatch("close");
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-transparent bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity duration-300"
        style="font-family: 'Futura PT', sans-serif;"
        transition:fly={{ y: 100, duration: 500 }}
        on:click|self={closeModal}
    >
        <div
            class="bg-white rounded-md shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-500 scale-95 md:scale-100"
        >
            <button
                on:click={closeModal}
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10 p-2 rounded-full bg-white"
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
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <div class="md:flex">
                <div class="md:w-1/2 overflow-hidden">
                    <img
                        src={room.image}
                        alt={room.name}
                        class="w-full h-full object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none"
                    />
                </div>

                <div class="md:w-1/2 p-8 overflow-y-auto max-h-[80vh]">
                    <h2
                        class="text-3xl font-extrabold text-gray-900 mb-2 leading-tight"
                    >
                        {room.name}
                    </h2>
                    <p class="text-sm text-gray-500 mb-4">
                        {room.type}
                    </p>
                    <p class="text-lg font-semibold text-gray-800 mb-4">
                        Rp {room.price.toLocaleString("id-ID")}
                    </p>
                    <!-- button pesan sekarang -->
                    <button
                        class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition mb-2"
                        on:click={() => goto("/order")}
                    >
                        Pesan Sekarang
                    </button>

                    <p class="text-gray-700 mb-6">
                        {room.description}
                    </p>

                    <div
                        class="grid grid-cols-2 gap-4 text-sm font-medium mb-6"
                    >
                        <div class="text-gray-600">
                            <strong>Ukuran:</strong>
                            <p class="text-gray-900 mt-1">
                                {room.size}
                            </p>
                        </div>
                        <div class="text-gray-600">
                            <strong>Kapasitas:</strong>
                            <p class="text-gray-900 mt-1">
                                {room.capacity}
                            </p>
                        </div>
                    </div>

                    <h3
                        class="font-bold text-lg text-gray-900 mb-3 border-t pt-4"
                    >
                        Fasilitas
                    </h3>
                    <ul class="space-y-2 text-gray-700">
                        {#each room.facilities as facility}
                            <li class="flex items-center">
                                <svg
                                    class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span>{facility}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
{/if}
