<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount, onDestroy } from "svelte";
  // Impor transisi fade dari Svelte
  import { fade, fly } from "svelte/transition";
  import hotelLogo from "$lib/images/logohotel.png";
  import {
    addDoc,
    collection,
    getDocs,
    or,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import type { Amnities, CarouselImage } from "../types";
  import "leaflet/dist/leaflet.css"; // <-- Impor CSS Leaflet
  import type { Testimoni } from "../types/testimoni";
  import DetailRoom from "$lib/components/DetailRoom.svelte";
  import type { Room } from "../types/room";
  import RoomAvailable from "$lib/components/RoomAvailable.svelte";

  let mapElement: HTMLElement;
  let mapData: L.Map | null = null;

  // Koordinat Sungai Musi Hotel (contoh: Jembatan Ampera, Palembang)
  const lat = -2.9911;
  const lng = 104.7566;

  let dataCarousel: CarouselImage[] = [];

  let galeriImages: CarouselImage[] = [];

  let destinasiImages: CarouselImage[] = [];

  let numberWhatsapp: string;

  let amenities: Amnities[] = [];

  let testimonials: Testimoni[] = [];

  let isModalOpen = false;

  let roomList: Room[] = [];

  let roomMeeting: Room[] = [];

  let selectedRoom: Room | null = null;

  let showCards = true;

  // Otomatis set checkin hari ini dan checkout besok
  let checkinDate: string = new Date().toISOString().slice(0, 10);
  let checkoutDate: string = (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  })();

  let jumlahTamu: number = 1;

  // Fungsi untuk membuka modal
  function openDetail(room: Room) {
    selectedRoom = room;
    isModalOpen = true;
  }

  async function fetchCarouselImages() {
    try {
      const snap = await getDocs(collection(db, "carousel"));
      dataCarousel = snap.docs.map((doc) => doc.data() as CarouselImage);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    }
  }

  async function fetchGalleryImages() {
    try {
      const snap = await getDocs(collection(db, "galeri"));
      galeriImages = snap.docs.map((doc) => doc.data() as CarouselImage);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  }

  async function fetchContactInfo() {
    try {
      const snap = await getDocs(collection(db, "whatsapp"));
      const contactData = snap.docs.map((doc) => doc.data());
      numberWhatsapp = contactData[0]?.number || "";
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  }

  async function fetchDestinationImages() {
    try {
      const snap = await getDocs(collection(db, "destinasi"));
      destinasiImages = snap.docs.map((doc) => doc.data() as CarouselImage);
    } catch (error) {
      console.error("Error fetching destination images:", error);
    }
  }

  // Ambil data amnities dari Firebase
  async function fetchAmenities() {
    try {
      const snap = await getDocs(collection(db, "amenities"));
      amenities = snap.docs.map((doc) => doc.data() as Amnities);

      console.log(amenities);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    }
  }

  // Ambil data testimoni dari Firebase
  async function fetchTestimonials() {
    try {
      const snap = await getDocs(collection(db, "testimoni"));
      testimonials = snap.docs.map((doc) => doc.data() as Testimoni);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }

  //where kategori kamar
  async function fetchRooms() {
    try {
      const roomsQuery = query(
        collection(db, "rooms"),
        where("kategori", "==", "kamar"),
      );
      const snap = await getDocs(roomsQuery);
      roomList = snap.docs.map((doc) => doc.data() as Room);
      console.log("Data kamar berhasil diambil:", roomList);
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
    }
  }

  //where kategori ruangan
  async function fetchMeetRoom() {
    try {
      const publicAreasQuery = query(
        collection(db, "rooms"),
        where("kategori", "==", "ruangan"),
      );
      const snap = await getDocs(publicAreasQuery);
      roomMeeting = snap.docs.map((doc) => doc.data() as Room);
      console.log("Data ruang pertemuan berhasil diambil:", roomMeeting);
    } catch (error) {
      console.error("Gagal mengambil data ruang pertemuan:", error);
    }
  }

  const hotelName = "SUNGAI MUSI HOTEL";
  const tagline = "Tempat peristirahatan Anda jauh dari hiruk pikuk kota.";
  const aboutText = `
    Selamat datang di Sungai Musi Hotel, di mana ketenangan bertemu dengan kemewahan. Terletak di jantung alam yang indah, hotel kami menawarkan pelarian yang sempurna dengan pemandangan menakjubkan, akomodasi yang nyaman, dan layanan yang tak tertandingi.
  `;

  let showMessage = false;
  let messageContent = "";
  let showModal = false;
  let modalTitle = "";
  let modalContent = "";
  // Tambahkan variabel untuk mengelola status menu seluler
  let isMobileMenuOpen = false;

  // Tambahkan variabel untuk mengontrol visibilitas tombol mengambang
  let showFloatingButton = false;

  function openBooking(item: any) {
    messageContent = `Anda telah memilih ${item.name}. Ini adalah placeholder untuk pemesanan.`;
    showMessage = true;
  }

  function showDetails(item: any) {
    modalTitle = item.name;
    modalContent = item.price + ". " + item.details;
    goto("/product");
  }

  // Fungsi untuk menutup menu seluler saat tautan diklik
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  // Fungsi untuk menangani acara gulir
  function handleScroll() {
    // Memastikan kode hanya berjalan di browser
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (window.scrollY > heroHeight - 100) {
          // Muncul sebelum heroSection selesai
          showFloatingButton = true;
        } else {
          showFloatingButton = false;
        }
      }
    }
  }

  let activeIndex = 0;
  let autoSlide: any;

  function startAutoSlide() {
    if (typeof window !== "undefined") {
      autoSlide = setInterval(() => {
        // Perbaikan: Gunakan carouselImages.length di sini
        activeIndex = (activeIndex + 1) % dataCarousel.length;
      }, 5000); // Ganti gambar setiap 5 detik
    }
  }

  function stopAutoSlide() {
    if (typeof window !== "undefined") {
      clearInterval(autoSlide);
    }
  }

  onMount(async () => {
    startAutoSlide();
    // Tambahkan event listener saat komponen dipasang
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    fetchCarouselImages();
    fetchGalleryImages();
    fetchContactInfo();
    fetchDestinationImages();
    fetchAmenities();
    fetchTestimonials();
    fetchRooms();
    fetchMeetRoom();

    // Dynamic import Leaflet (hanya di browser)
    const L = await import("leaflet");

    // Inisialisasi map dengan menonaktifkan kontrol zoom dan interaksi
    mapData = L.map(mapElement).setView([lat, lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapData);

    // Tambahkan marker (penanda)
    L.marker([lat, lng]).addTo(mapData).bindPopup("Sebuah marker.");

    // Impor file CSS Leaflet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  });

  onDestroy(() => {
    stopAutoSlide();
    // Hapus event listener saat komponen dihancurkan
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
    }
  });

  function order() {
    goto("/order");
  }

  function login() {
    goto("/login");
  }

  async function handleSearch() {
    showCards = true;
  }
</script>

<main
  class="font-sans antialiased text-gray-800 bg-gray-50"
  style="font-family: 'Futura PT', sans-serif;"
>
  <!-- Perbaikan: Tambahkan on:click untuk membuka menu seluler -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- logo -->
      <a href="#hero" class="text-xl font-semi-bold text-indigo-700">
        <img src={hotelLogo} alt="Sungai Musi Hotel" class="h-14" />
      </a>
      <div class="hidden md:flex space-x-6 text-xl">
        <a
          href="#about"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Tentang Kami</a
        >
        <span class="text-gray-400">|</span>
        <a
          href="#rooms"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Kamar</a
        >
        <span class="text-gray-400">|</span>
        <a
          href="#meeting-rooms"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Ruangan Meeting</a
        >
        <span class="text-gray-400">|</span>
        <a
          href="#amenities"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Fasilitas</a
        >
        <span class="text-gray-400">|</span>
        <a
          href="#gallery"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Galeri</a
        >
        <span class="text-gray-400">|</span>
        <a
          href="#testimonials"
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Testimoni</a
        >
      </div>
      <div class="flex items-center space-x-1">
        <button
          on:click={order}
          class="md:block hidden bg-indigo-600 text-white px-6 py-3 rounded-l-xl shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50 {showFloatingButton
            ? 'opacity-100 cursor-pointer'
            : 'opacity-0 cursor-pointer'}"
        >
          Pesan Sekarang
        </button>
        <button
          on:click={login}
          class="md:block hidden bg-indigo-600 text-white px-6 py-3 shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50 {showFloatingButton
            ? 'rounded-r-xl cursor-pointer'
            : 'opacity-100 rounded-xl cursor-pointer'}"
        >
          Login
        </button>
      </div>

      <!-- Tombol pesan sekarang dihilangkan dari navbar utama -->
      <div class="md:hidden">
        <button
          on:click={() => (isMobileMenuOpen = true)}
          class="text-gray-600 focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Tambahkan menu seluler dengan transisi fade -->
  {#if isMobileMenuOpen}
    <div
      class="fixed top-0 left-0 w-full h-screen bg-white z-[51] transition-transform transform ease-in-out duration-300"
      transition:fade={{ duration: 300 }}
    >
      <div class="flex justify-end p-4">
        <button
          on:click={() => (isMobileMenuOpen = false)}
          class="text-gray-600 focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <div class="flex flex-col items-center space-y-6 text-xl p-8">
        <a
          href="#about"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Tentang Kami</a
        >
        <a
          href="#rooms"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Kamar</a
        >
        <a
          href="#meeting-rooms"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Ruangan Meeting</a
        >
        <a
          href="#amenities"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Fasilitas</a
        >
        <a
          href="#gallery"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Galeri</a
        >
        <a
          href="#testimonials"
          on:click={closeMobileMenu}
          class="text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >Testimoni</a
        >
        <!-- Tombol pesan sekarang dihilangkan dari menu seluler -->
      </div>
    </div>
  {/if}

  <header
    id="hero"
    class="relative h-screen flex flex-col justify-center items-center text-center text-white pt-16"
  >
    <div class="absolute inset-0 z-0 overflow-hidden">
      {#each dataCarousel as image, i}
        <div
          class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style="background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url('{image.url_image}'); opacity: {i ===
          activeIndex
            ? 1
            : 0};"
        ></div>
      {/each}
    </div>

    <div class="z-10 relative">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-4">
        {hotelName}
      </h1>
      <p class="text-xl md:text-2xl font-light mb-8">
        {tagline}
      </p>
    </div>

    <div
      class="absolute top-8 right-4 z-20 flex space-x-2 bg-white bg-opacity-30 p-2 rounded-full mt-18"
    >
      {#each dataCarousel as _, i}
        <button
          on:click={() => (activeIndex = i)}
          class="w-3 h-3 rounded-full transition-colors duration-300 {i ===
          activeIndex
            ? 'bg-indigo-600'
            : 'bg-white'}"
        ></button>
      {/each}
    </div>

    <div class="absolute bottom-0 w-full z-20 pb-4">
      <form
        class="bg-white bg-opacity-80 p-4 sm:p-6 shadow-lg max-w-lg md:max-w-2xl mx-auto flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0"
      >
        <div class="flex-1">
          <label
            for="checkin"
            class="block text-gray-700 text-xs sm:text-sm font-semibold mb-1"
            >Tanggal Check-in</label
          >
          <input
            type="date"
            id="checkin"
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-md text-black"
            bind:value={checkinDate}
          />
        </div>

        <div class="flex-1">
          <label
            for="checkout"
            class="block text-gray-700 text-xs sm:text-sm font-semibold mb-1"
            >Tanggal Check-out</label
          >
          <input
            type="date"
            id="checkout"
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-md text-black"
            bind:value={checkoutDate}
          />
        </div>

        <div class="flex-1">
          <label
            for="guests"
            class="block text-gray-700 text-xs sm:text-sm font-semibold mb-1"
            >Jumlah Tamu</label
          >
          <input
            type="number"
            id="guests"
            min="1"
            bind:value={jumlahTamu}
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-md text-black text-center font-bold"
          />
        </div>

        <div class="flex-shrink-0 flex items-end">
          <button
            class="w-full md:w-auto bg-indigo-600 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-md text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
            on:click={handleSearch}
          >
            Cari Kamar
          </button>
        </div>
      </form>
    </div>
  </header>

  <section id="about" class="py-20 min-h-screen flex items-center bg-white">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12"
      >
        SUNGAI MUSI HOTEL
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Selamat datang di Sungai Musi Hotel, tempat di mana kenyamanan dan
        kemewahan berpadu.
      </p>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto"
      >
        <div>
          <p
            class="text-lg text-gray-600 leading-relaxed text-center md:text-left"
          >
            {aboutText}
          </p>
          <div class="flex justify-center my-6">
            <span
              class="inline-block w-52 h-0.5 rounded-full bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400"
            ></span>
          </div>
        </div>
        <div
          class="overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
          transition:fade
        >
          <img
            src="https://images.unsplash.com/photo-1568229988520-4bc288da81f7?q=80&w=735&auto=format&fit=crop"
            alt="Lobi hotel yang indah"
            class="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  </section>

  <section id="amenities" class="py-20 min-h-screen flex items-center">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12"
      >
        Kunjungi dan Rasakan Sungai Musi Hotel
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Temukan kenyamanan dan kemewahan di setiap sudut hotel kami.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        {#each amenities as amenity}
          <div
            class="p-2 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              src={amenity.url_image}
              alt={amenity.name}
              class="mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {amenity.name}
            </h3>
            <p class="text-sm text-gray-500">{amenity.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="rooms" class="py-20 bg-white min-h-screen flex items-center">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8"
      >
        Pilihan Kamar Kami
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Pilih dari berbagai jenis kamar yang dirancang untuk kenyamanan dan
        relaksasi Anda.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each roomList as room}
          <div
            class="p-6 shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <img
              src={room.image}
              alt={room.name}
              class="w-full h-60 object-cover mb-4"
            />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">
              Rp {room.price.toLocaleString("id-ID")}
            </p>
            <div class="flex space-x-4">
              <button
                class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
                on:click={order}
              >
                Pesan
              </button>
              <button
                class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300 cursor-pointer"
                on:click={() => openDetail(room)}
              >
                Detail
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="meeting-rooms"
    class="py-20 bg-gray-100 min-h-screen flex items-center"
  >
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-4"
      >
        Ruangan Meeting
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Ruangan meeting kami dirancang untuk kenyamanan dan produktivitas Anda.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each roomMeeting as room}
          <div
            class="bg-white p-6 shadow-sm transition-transform duration-300 hover:scale-105"
          >
            <img
              src={room.image}
              alt={room.name}
              class="w-full h-48 object-cover mb-4"
            />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">
              Rp {room.price.toLocaleString("id-ID")}
            </p>
            <div class="flex space-x-4">
              <button
                class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
                on:click={order}
              >
                Pesan
              </button>
              <button
                class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300 cursor-pointer"
                on:click={() => openDetail(room)}
              >
                Detail
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="gallery" class="py-20 bg-gray-50 min-h-screen flex items-center">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-4"
      >
        Keindahan Hotel Kami
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Lihat keindahan hotel kami melalui galeri foto.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {#each galeriImages as image}
          <div class="overflow-hidden shadow-md">
            <img
              src={image.url_image}
              alt="Galeri Hotel"
              class="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="destination" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-4"
      >
        Destinasi Keindahan
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Jelajahi keindahan alam dan budaya di sekitar hotel kami.
      </p>
      <div
        class="flex overflow-x-scroll snap-x snap-mandatory space-x-4 pb-4 scrollbar-hide"
      >
        {#each destinasiImages as image}
          <div class="flex-none w-3/4 md:w-1/2 lg:w-1/3 snap-center">
            <div class="overflow-hidden">
              <img
                src={image.url_image}
                alt="Galeri Hotel"
                class="w-full h-72 md:h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div class="p-4 bg-white">
                <h3 class="text-xl font-semibold text-gray-800 text-center">
                  {image.name}
                </h3>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="visitor-stats"
    class="py-20 bg-cover bg-center min-h-screen flex items-center"
    style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1596386461350-326ccb383e9f?q=80&w=1113&auto=format&fit=crop');"
  >
    <div
      class="container mx-auto px-4 text-white text-center flex flex-col items-center justify-center"
    >
      <h2 class="text-3xl md:text-5xl font-bold mb-4">
        Lebih dari 100.000 Traveller Mengunjungi Hotel Kami
      </h2>
      <p class="text-lg md:text-xl max-w-2xl mb-8">
        Bergabunglah dengan ribuan tamu yang telah merasakan kehangatan dan
        kemewahan SUNGAI MUSI HOTEL.
      </p>
      <button
        class="bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition duration-300"
        on:click={() => openBooking({ name: "Kamar" })}
      >
        Pesan Sekarang
      </button>
    </div>
  </section>

  <section
    id="testimonials"
    class="py-20 bg-white min-h-screen flex items-center"
  >
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-8"
      >
        Apa Kata Mereka
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Kami bangga dengan layanan kami. Berikut adalah beberapa testimoni dari
        tamu kami.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each testimonials as testimonial}
          <div class="p-8 flex flex-col items-center text-center">
            <img
              src={testimonial.url_image}
              alt={testimonial.name}
              class="w-20 h-20 rounded-full mb-4 object-cover"
            />
            <p class="text-lg text-gray-600 italic mb-4">
              "{testimonial.content}"
            </p>
            <p class="font-semibold text-gray-800">- {testimonial.name}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Bagian peta yang telah diperbaiki -->
  <section class="w-full bg-gray-50 py-12">
    <div class="mx-auto px-4 text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Lokasi Kami</h2>
      <p class="mt-2 text-gray-600">
        Sungai Musi Hotel terletak di jantung kota Palembang dengan akses mudah
        ke ikon wisata.
      </p>
    </div>
    <div bind:this={mapElement} class="w-full h-96"></div>
  </section>

  <a
    href="https://wa.me/{numberWhatsapp}?text=Halo%2C%20saya%20tertarik%20dengan%20The%20Serene%20Retreat.%20Bisa%20berikan%20informasi%20lebih%20lanjut%3F"
    target="_blank"
    class="fixed bottom-20 md:bottom-6 lg:bottom-6 right-6 flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-400 text-white px-5 py-3 rounded-full shadow-2xl hover:from-green-600 hover:to-green-500 transition-all duration-300 ring-2 ring-green-300 ring-offset-2"
    title="Hubungi Kami via WhatsApp"
  >
    <i class="fa fa-whatsapp fa-3x" aria-hidden="true"></i>
  </a>

  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4 text-center md:text-left">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-2xl font-bold mb-4">{hotelName}</h3>
          <p class="text-gray-400">
            Tempat peristirahatan Anda jauh dari hiruk pikuk kota. Ketenangan
            bertemu dengan kemewahan.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Navigasi</h3>
          <ul class="space-y-2">
            <li>
              <a
                href="#about"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Tentang Kami</a
              >
            </li>
            <li>
              <a
                href="#rooms"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Kamar</a
              >
            </li>
            <li>
              <a
                href="#meeting-rooms"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Ruangan Meeting</a
              >
            </li>
            <li>
              <a
                href="#amenities"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Fasilitas</a
              >
            </li>
            <li>
              <a
                href="#gallery"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Galeri</a
              >
            </li>
            <li>
              <a
                href="#testimonials"
                class="text-gray-400 hover:text-white transition-colors duration-300"
                >Testimoni</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Hubungi Kami</h3>
          <p class="text-gray-400">
            Jalan Serene Indah No. 123<br />
            Jakarta, Indonesia<br />
            <br />
            Email: smarlabsgroup@gmail.com<br />
            Telp: (021) 123-4567
          </p>
          <div class="mt-4 flex justify-center md:justify-start space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.766s.784-1.766 1.75-1.766 1.75.79 1.75 1.766-.783 1.766-1.75 1.766zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.765 7 2.476v6.759z"
                /></svg
              >
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.46 17.585h-2.327v-1.766h2.327v1.766zm-5.042-3.693h-2.327v-3.791h2.327v3.791zm10.084 0h-2.327v-3.791h2.327v3.791zm0-4.634h-2.327v-3.791h2.327v3.791zm-5.042 0h-2.327v-3.791h2.327v3.791zm-5.042 0h-2.327v-3.791h2.327v3.791zm0-4.634h-2.327v-2.756h2.327v2.756zm5.042 0h-2.327v-2.756h2.327v2.756zm5.042 0h-2.327v-2.756h2.327v2.756zm0-4.634h-2.327v-2.756h2.327v2.756z"
                /></svg
              >
            </a>
          </div>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
        <p>
          © {new Date().getFullYear()}
          {hotelName}. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </footer>
</main>

<!-- Tombol "Pesan Kamar" yang tetap di bagian bawah layar untuk mobile -->
<!-- Tambahkan transisi visibilitas -->
{#if showFloatingButton}
  <button
    class="fixed bottom-0 left-0 w-full bg-indigo-600 text-white px-5 py-4 font-semibold hover:bg-indigo-700 transition-opacity duration-300 shadow-lg z-40 md:hidden"
    style="font-family: 'Futura PT', sans-serif;"
    on:click={order}
    transition:fade={{ duration: 500 }}
  >
    Pesan Kamar
  </button>
{/if}

<!-- Gunakan if-block untuk transisi fade pada pop-up pesan -->
{#if showMessage}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
    on:click={() => (showMessage = false)}
    transition:fade={{ duration: 300 }}
  ></div>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full"
    transition:fade={{ duration: 300 }}
  >
    <p class="text-lg text-gray-700 mb-6">{messageContent}</p>
    <button
      class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
      on:click={() => (showMessage = false)}>Tutup</button
    >
  </div>
{/if}

<DetailRoom
  bind:isOpen={isModalOpen}
  room={selectedRoom}
  on:close={() => console.log("Modal ditutup!")}
/>

<!-- Gunakan if-block untuk transisi fade pada modal detail -->
{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
    on:click={() => (showModal = false)}
    transition:fade={{ duration: 300 }}
  ></div>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full"
    transition:fade={{ duration: 300 }}
  >
    <h3 class="text-2xl font-bold text-gray-800 mb-4">{modalTitle}</h3>
    <p class="text-md text-gray-600 mb-6">{modalContent}</p>
    <button
      class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
      on:click={() => (showModal = false)}>Tutup</button
    >
  </div>
{/if}

{#if showCards}
  <div
    class="fixed inset-0 bg-transparent bg-opacity-75 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm transition-opacity duration-300"
    style="font-family: 'Futura PT', sans-serif;"
    transition:fly={{ y: 100, duration: 500 }}
  >
    <div
      class="bg-white p-4 sm:p-8 rounded-xl shadow-2xl z-50 text-center w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center justify-center overflow-auto"
      style="top: 50%; left: 50%; transform: translate(-50%, -50%); position: fixed; max-height: 90vh;"
    >
      <RoomAvailable />
      <button
        class="bg-red-600 text-white py-2 px-4 sm:px-6 rounded-full hover:bg-red-700 transition-colors font-semibold text-base sm:text-xl cursor-pointer mt-4 sm:mt-6"
        on:click={() => (showCards = false)}>Tutup</button
      >
    </div>
  </div>
{/if}

<style>
  body {
    font-family: "Inter", sans-serif;
  }

  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
</style>
