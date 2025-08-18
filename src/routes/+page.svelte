<script lang="ts">
  import { goto } from "$app/navigation";
  import { or } from "firebase/firestore";
  import { onMount, onDestroy } from "svelte";

  const hotelName = "SUNGAI MUSI HOTEL";
  const tagline = "Tempat peristirahatan Anda jauh dari hiruk pikuk kota.";
  const aboutText = `
    Selamat datang di Sungai Musi Hotel, di mana ketenangan bertemu dengan kemewahan. Terletak di jantung alam yang indah, hotel kami menawarkan pelarian yang sempurna dengan pemandangan menakjubkan, akomodasi yang nyaman, dan layanan yang tak tertandingi.
  `;
  const amenities = [
    {
      name: "Kolam Renang Infinity",
      description: "Nikmati pemandangan matahari terbenam yang menakjubkan.",
      icon: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=1170&auto=format&fit=crop",
    },
    {
      name: "Restoran Fine Dining",
      description: "Hidangan lezat dari koki terkenal kami.",
      icon: "https://plus.unsplash.com/premium_photo-1723491285855-f1035c4c703c?q=80&w=1170&auto=format&fit=crop",
    },
    {
      name: "Spa & Pusat Kebugaran",
      description: "Manjakan diri Anda dengan perawatan relaksasi.",
      icon: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1170&auto=format&fit=crop",
    },
    {
      name: "Wi-Fi Berkecepatan Tinggi",
      description: "Tetap terhubung di seluruh area hotel.",
      icon: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1170&auto=format&fit=crop",
    },
  ];

  const roomList = [
    {
      name: "Kamar Standar",
      description: "Kamar yang nyaman dengan pemandangan kota.",
      price: "Rp 1.500.000 / malam",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1674676471081-0236e34485fd?q=80&w=774&auto=format&fit=crop",
      details:
        "Kamar berukuran 25m² dengan satu ranjang berukuran queen atau dua ranjang single, dilengkapi dengan kamar mandi pribadi dan pemandangan kota.",
    },
    {
      name: "Kamar Deluxe",
      description: "Kamar luas dengan pemandangan taman.",
      price: "Rp 2.500.000 / malam",
      imageUrl:
        "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1170&auto=format&fit=crop",
      details:
        "Kamar berukuran 35m² dengan satu ranjang berukuran king, kamar mandi mewah, dan pemandangan taman yang menenangkan.",
    },
    {
      name: "Suite Executive",
      description: "Ruangan mewah dengan balkon pribadi.",
      price: "Rp 5.000.000 / malam",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1664300396006-1fbd23c87142?q=80&w=1074&auto=format&fit=crop",
      details:
        "Suite berukuran 60m² yang dilengkapi dengan area ruang tamu terpisah, balkon pribadi, dan pemandangan kolam renang infinity.",
    },
    {
      name: "Family Suite",
      description: "Suite yang luas, ideal untuk keluarga.",
      price: "Rp 4.000.000 / malam",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661963428055-4b25a7ebd3a9?q=80&w=1116&auto=format&fit=crop",
      details:
        "Suite berukuran 70m² dengan dua kamar tidur, kamar mandi ganda, dan area bermain anak-anak. Sempurna untuk liburan keluarga.",
    },
    {
      name: "Honeymoon Suite",
      description: "Ruangan romantis dengan fasilitas premium.",
      price: "Rp 6.000.000 / malam",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661963657190-ecdd1ca794f9?q=80&w=1129&auto=format&fit=crop",
      details:
        "Ruangan berukuran 55m² yang romantis dengan Jacuzzi pribadi, layanan kamar 24 jam, dan pemandangan laut yang spektakuler.",
    },
  ];

  const meetingRooms = [
    {
      name: "Meeting Room A",
      description: "Kapasitas hingga 20 orang. Proyektor tersedia.",
      price: "Rp 1.000.000 / jam",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661879435429-a396d927c686?q=80&w=1112&auto=format&fit=crop",
      details:
        "Ruang rapat berukuran sedang dengan proyektor HD, layar proyektor, dan koneksi internet super cepat. Ideal untuk rapat tim atau presentasi kecil.",
    },
    {
      name: "Grand Ballroom",
      description: "Kapasitas hingga 200 orang. Cocok untuk acara besar.",
      price: "Rp 10.000.000 / acara",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1661900268317-2ab4dccd2fcb?q=80&w=1074&auto=format&fit=crop",
      details:
        "Ballroom luas yang dapat menampung hingga 200 tamu. Dilengkapi dengan sistem audio-visual canggih, panggung, dan katering lengkap untuk acara besar.",
    },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1170&auto=format&fit=crop",
  ];

  const carouselImages = [
    "https://images.unsplash.com/photo-1737234546238-9d79d1803238?q=80&w=1270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1332&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1170&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1663013625960-b54f861e4074?q=80&w=1170&auto=format&fit=crop",
  ];

  const testimonials = [
    {
      name: "Andi Pratama",
      review:
        "Pengalaman menginap yang luar biasa! Pemandangan dari kamar sangat menakjubkan, dan pelayanannya sangat ramah.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      name: "Budi Santoso",
      review:
        "Tempat yang sempurna untuk beristirahat. Kolam renang infinity-nya benar-benar tak terlupakan. Sangat direkomendasikan!",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    {
      name: "Citra Dewi",
      review:
        "Restoran fine dining menyajikan hidangan yang lezat dengan suasana yang romantis. Pasti akan kembali lagi.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];

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
        activeIndex = (activeIndex + 1) % carouselImages.length;
      }, 5000); // Ganti gambar setiap 5 detik
    }
  }

  function stopAutoSlide() {
    if (typeof window !== "undefined") {
      clearInterval(autoSlide);
    }
  }

  onMount(() => {
    startAutoSlide();
    // Tambahkan event listener saat komponen dipasang
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
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
</script>

<main
  class="font-sans antialiased text-gray-800 bg-gray-50"
  style="font-family: 'Futura PT', sans-serif;"
>
  <!-- Perbaikan: Tambahkan on:click untuk membuka menu seluler -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="#hero" class="text-xl font-semi-bold text-indigo-700">
        {hotelName}
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
      <button
        on:click={order}
        class="md:block hidden bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 z-50 {showFloatingButton
          ? 'opacity-100'
          : 'opacity-0 pointer-events-none'}"
      >
        Pesan Sekarang
      </button>

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

  <!-- Tambahkan menu seluler -->
  {#if isMobileMenuOpen}
    <div
      class="fixed top-0 left-0 w-full h-screen bg-white z-[51] transition-transform transform ease-in-out duration-300"
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
      {#each carouselImages as image, i}
        <div
          class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style="background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url('{image}'); opacity: {i ===
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
      class="absolute top-4 right-4 z-20 flex space-x-2 bg-white bg-opacity-30 p-2 rounded-full mt-18"
    >
      {#each carouselImages as _, i}
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
        class="bg-white bg-opacity-80 p-4 sm:p-6 shadow-lg max-w-lg md:max-w-2xl mx-auto flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 rounded-lg"
      >
        <div class="flex-1">
          <label
            for="checkin"
            class="block text-gray-700 text-xs sm:text-sm font-medium mb-1"
            >Tanggal Check-in</label
          >
          <input
            type="date"
            id="checkin"
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
          />
        </div>

        <div class="flex-1">
          <label
            for="checkout"
            class="block text-gray-700 text-xs sm:text-sm font-medium mb-1"
            >Tanggal Check-out</label
          >
          <input
            type="date"
            id="checkout"
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
          />
        </div>

        <div class="flex-1">
          <label
            for="guests"
            class="block text-gray-700 text-xs sm:text-sm font-medium mb-1"
            >Jumlah Tamu</label
          >
          <input
            type="number"
            id="guests"
            min="1"
            value="1"
            class="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
          />
        </div>

        <div class="flex-shrink-0 flex items-end">
          <button
            type="submit"
            class="w-full md:w-auto bg-indigo-600 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-md text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors duration-300"
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
          class="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
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
            class="p-2 rounded-xl text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <img src={amenity.icon} alt={amenity.name} class="mx-auto mb-4" />
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
        Kunjungi dan Rasakan Sungai Musi Hotel
      </h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Temukan kenyamanan dan kemewahan di setiap sudut hotel kami.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each roomList as room}
          <div
            class="bg-gray-100 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={room.imageUrl}
              alt={room.name}
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">
              {room.price}
            </p>
            <div class="flex space-x-4">
              <button
                class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
                on:click={() => openBooking(room)}
              >
                Pesan
              </button>
              <button
                class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
                on:click={() => showDetails(room)}
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
        {#each meetingRooms as room}
          <div
            class="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <img
              src={room.imageUrl}
              alt={room.name}
              class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">
              {room.price}
            </p>
            <div class="flex space-x-4">
              <button
                class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
                on:click={() => openBooking(room)}
              >
                Pesan
              </button>
              <button
                class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300"
                on:click={() => showDetails(room)}
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
      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        {#each galleryImages as image}
          <div class="overflow-hidden rounded-lg shadow-md">
            <img
              src={image}
              alt="Galeri Hotel"
              class="w-full object-cover transition-transform duration-300 hover:scale-105"
            />
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
          <div
            class="bg-gray-100 p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              class="w-20 h-20 rounded-full mb-4 object-cover"
            />
            <p class="text-lg text-gray-600 italic mb-4">
              "{testimonial.review}"
            </p>
            <p class="font-semibold text-gray-800">- {testimonial.name}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <a
    href="https://wa.me/628123456789?text=Halo%2C%20saya%20tertarik%20dengan%20The%20Serene%20Retreat.%20Bisa%20berikan%20informasi%20lebih%20lanjut%3F"
    target="_blank"
    class="fixed bottom-20 right-6 flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-400 text-white px-5 py-3 rounded-full shadow-2xl hover:from-green-600 hover:to-green-500 transition-all duration-300 ring-2 ring-green-300 ring-offset-2 md:hidden"
    title="Hubungi Kami via WhatsApp"
  >
    <i class="fa fa-whatsapp fa-3x" aria-hidden="true"></i>
  </a>

  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4 text-center md:text-left">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            Email: info@sereneretreat.com<br />
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
        <div>
          <h3 class="text-xl font-semibold mb-4">Lokasi Kami</h3>
          <div class="h-48 w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.368817718012!2d106.8202583147696!3d-6.216345695508605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f0e21a719c8f%3A0xf639a04a6e1d5a7d!2sMonas!5e0!3m2!1sen!2sid!4v1628172935274!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
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
<button
  class="fixed bottom-0 left-0 w-full bg-indigo-600 text-white px-5 py-4 font-semibold hover:bg-indigo-700 transition-opacity duration-300 shadow-lg z-40 md:hidden {showFloatingButton
    ? 'opacity-100'
    : 'opacity-0 pointer-events-none'}"
  style="font-family: 'Futura PT', sans-serif;"
  on:click={order}
>
  Pesan Kamar
</button>

{#if showMessage}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
    on:click={() => (showMessage = false)}
  ></div>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full"
  >
    <p class="text-lg text-gray-700 mb-6">{messageContent}</p>
    <button
      class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
      on:click={() => (showMessage = false)}>Tutup</button
    >
  </div>
{/if}

{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
    on:click={() => (showModal = false)}
  ></div>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full"
  >
    <h3 class="text-2xl font-bold text-gray-800 mb-4">{modalTitle}</h3>
    <p class="text-md text-gray-600 mb-6">{modalContent}</p>
    <button
      class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors"
      on:click={() => (showModal = false)}>Tutup</button
    >
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
  body {
    font-family: "Inter", sans-serif;
  }
</style>
