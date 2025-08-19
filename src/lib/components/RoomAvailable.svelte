<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { collection, query, where, getDocs } from "firebase/firestore";
    import { db } from "$lib/firebase";
    import type { Room } from "../../types/room";

    let listRooms: Room[] = [];
    let isLoading = true;

    async function fetchRooms() {
        try {
            const roomsQuery = query(
                collection(db, "rooms"),
                where("type", "==", "Suite"),
            );
            const snap = await getDocs(roomsQuery);
            listRooms = snap.docs.map((doc) => doc.data() as Room);
        } catch (error) {
            console.error("Gagal mengambil data kamar:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchRooms();
    });
</script>

<!-- Add max-width and center the container on larger screens to prevent the content from stretching too wide.
     Make the padding responsive with p-4 on small screens and md:p-8 on medium screens and up. -->
<div
    class="p-4 md:p-8 max-w-7xl mx-auto"
    style="font-family: 'Futura PT', sans-serif;"
>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Kamar Tersedia</h3>
    <p class="text-md text-gray-600 mb-6">
        Kami menemukan beberapa kamar yang sesuai dengan kriteria Anda.
    </p>

    {#if isLoading}
        <p class="text-center text-gray-500">Memuat kamar...</p>
    {:else if listRooms.length > 0}
        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
            {#each listRooms as room}
                <!-- Add transition-all for a smoother hover effect -->
                <div
                    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden flex flex-col"
                    on:click={() => goto(`/order`)}
                >
                    <!-- Use responsive heights for the image -->
                    <img
                        src={room.image}
                        alt={room.name}
                        class="w-full h-40 sm:h-48 md:h-56 object-cover"
                    />
                    <div class="p-4 flex-1 flex flex-col justify-between">
                        <h2
                            class="text-lg md:text-xl font-semibold text-gray-800 mb-1"
                        >
                            {room.name}
                        </h2>
                        <p class="text-gray-600 text-base md:text-lg mb-2">
                            {room.size} | {room.capacity}
                        </p>
                        <p class="text-lg md:text-xl font-bold text-blue-600">
                            Rp {room.price.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-center text-gray-500">
            Tidak ada kamar suite yang tersedia saat ini.
        </p>
    {/if}
</div>
