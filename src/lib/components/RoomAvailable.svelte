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

<div class="p-8" style="font-family: 'Futura PT', sans-serif;">
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Kamar Tersedia</h3>
    <p class="text-md text-gray-600 mb-6">
        Kami menemukan beberapa kamar yang sesuai dengan kriteria Anda.
    </p>

    {#if isLoading}
        <p class="text-center text-gray-500">Memuat kamar...</p>
    {:else if listRooms.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each listRooms as room}
                <div
                    class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
                    on:click={() => goto(`/order`)}
                >
                    <img
                        src={room.image}
                        alt={room.name}
                        class="w-full h-48 object-cover"
                    />
                    <div class="p-4">
                        <h2 class="text-xl font-semibold text-gray-800 mb-1">
                            {room.name}
                        </h2>
                        <p class="text-gray-600 text-lg mb-2">
                            {room.size} | {room.capacity}
                        </p>
                        <p class="text-xl font-bold text-blue-600">
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
