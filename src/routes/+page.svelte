<script lang="ts">
    import { goto } from "$app/navigation";

  // Data untuk halaman, dapat diganti dengan data dari API
  const hotelName = "The Serene Retreat";
  const tagline = "Tempat peristirahatan Anda jauh dari hiruk pikuk kota.";
  const aboutText = `
    Selamat datang di The Serene Retreat, di mana ketenangan bertemu dengan kemewahan. Terletak di jantung alam yang indah, hotel kami menawarkan pelarian yang sempurna dengan pemandangan menakjubkan, akomodasi yang nyaman, dan layanan yang tak tertandingi.
  `;
  const amenities = [
    { name: "Kolam Renang Infinity", description: "Nikmati pemandangan matahari terbenam yang menakjubkan.", icon: "https://placehold.co/40x40/5D62B5/fff?text=🏊" },
    { name: "Restoran Fine Dining", description: "Hidangan lezat dari koki terkenal kami.", icon: "https://placehold.co/40x40/5D62B5/fff?text=🍽️" },
    { name: "Spa & Pusat Kebugaran", description: "Manjakan diri Anda dengan perawatan relaksasi.", icon: "https://placehold.co/40x40/5D62B5/fff?text=🧘" },
    { name: "Wi-Fi Berkecepatan Tinggi", description: "Tetap terhubung di seluruh area hotel.", icon: "https://placehold.co/40x40/5D62B5/fff?text=📶" },
  ];

  const roomList = [
    { name: "Kamar Standar", description: "Kamar yang nyaman dengan pemandangan kota.", price: "Rp 1.500.000 / malam", imageUrl: "https://placehold.co/1200x800/A0A4CF/fff?text=Kamar+Standar", details: "Kamar berukuran 25m² dengan satu ranjang berukuran queen atau dua ranjang single, dilengkapi dengan kamar mandi pribadi dan pemandangan kota." },
    { name: "Kamar Deluxe", description: "Kamar luas dengan pemandangan taman.", price: "Rp 2.500.000 / malam", imageUrl: "https://placehold.co/1200x800/8086B8/fff?text=Kamar+Deluxe", details: "Kamar berukuran 35m² dengan satu ranjang berukuran king, kamar mandi mewah, dan pemandangan taman yang menenangkan." },
    { name: "Suite Executive", description: "Ruangan mewah dengan balkon pribadi.", price: "Rp 5.000.000 / malam", imageUrl: "https://placehold.co/1200x800/747AB8/fff?text=Suite+Executive", details: "Suite berukuran 60m² yang dilengkapi dengan area ruang tamu terpisah, balkon pribadi, dan pemandangan kolam renang infinity." },
    { name: "Family Suite", description: "Suite yang luas, ideal untuk keluarga.", price: "Rp 4.000.000 / malam", imageUrl: "https://placehold.co/1200x800/C0C4E2/fff?text=Family+Suite", details: "Suite berukuran 70m² dengan dua kamar tidur, kamar mandi ganda, dan area bermain anak-anak. Sempurna untuk liburan keluarga." },
    { name: "Honeymoon Suite", description: "Ruangan romantis dengan fasilitas premium.", price: "Rp 6.000.000 / malam", imageUrl: "https://placehold.co/1200x800/D0D4E0/fff?text=Honeymoon+Suite", details: "Ruangan berukuran 55m² yang romantis dengan Jacuzzi pribadi, layanan kamar 24 jam, dan pemandangan laut yang spektakuler." },
  ];
  
  const meetingRooms = [
    { name: "Meeting Room A", description: "Kapasitas hingga 20 orang. Proyektor tersedia.", price: "Rp 1.000.000 / jam", imageUrl: "https://placehold.co/1200x800/D0D4E0/fff?text=Meeting+Room+A", details: "Ruang rapat berukuran sedang dengan proyektor HD, layar proyektor, dan koneksi internet super cepat. Ideal untuk rapat tim atau presentasi kecil." },
    { name: "Grand Ballroom", description: "Kapasitas hingga 200 orang. Cocok untuk acara besar.", price: "Rp 10.000.000 / acara", imageUrl: "https://placehold.co/1200x800/E0E4F0/fff?text=Grand+Ballroom", details: "Ballroom luas yang dapat menampung hingga 200 tamu. Dilengkapi dengan sistem audio-visual canggih, panggung, dan katering lengkap untuk acara besar." },
  ];

  const galleryImages = [
    'https://placehold.co/1200x800/A0A4CF/fff?text=Ruangan+1',
    'https://placehold.co/1200x800/8086B8/fff?text=Kolam+Renang',
    'https://placehold.co/1200x800/747AB8/fff?text=Restoran',
    'https://placehold.co/1200x800/C0C4E2/fff?text=Lobi',
  ];

  const testimonials = [
    {
      name: "Andi Pratama",
      review: "Pengalaman menginap yang luar biasa! Pemandangan dari kamar sangat menakjubkan, dan pelayanannya sangat ramah.",
      avatar: "https://placehold.co/100x100/5D62B5/fff?text=AP"
    },
    {
      name: "Budi Santoso",
      review: "Tempat yang sempurna untuk beristirahat. Kolam renang infinity-nya benar-benar tak terlupakan. Sangat direkomendasikan!",
      avatar: "https://placehold.co/100x100/8086B8/fff?text=BS"
    },
    {
      name: "Citra Dewi",
      review: "Restoran fine dining menyajikan hidangan yang lezat dengan suasana yang romantis. Pasti akan kembali lagi.",
      avatar: "https://placehold.co/100x100/A0A4CF/fff?text=CD"
    },
  ];

  // Fungsi untuk menampilkan pesan (mengganti alert)
  let showMessage = false;
  let messageContent = '';
  let showModal = false;
  let modalTitle = '';
  let modalContent = '';

  function openBooking(item: any) {
    messageContent = `Anda telah memilih ${item.name}. Ini adalah placeholder untuk pemesanan.`;
    showMessage = true;
  }

  function showDetails(item: any) {
    modalTitle = item.name;
    modalContent = item.price + '. ' + item.details;
    goto("/product")
  }
</script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
  }
</style>

<main class="font-sans antialiased text-gray-800 bg-gray-50">
  <!-- Navigation Bar -->
  <nav class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="#hero" class="text-2xl font-bold text-indigo-700">
        {hotelName}
      </a>
      <div class="hidden md:flex space-x-6">
        <a href="#about" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Tentang Kami</a>
        <a href="#rooms" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Kamar</a>
        <a href="#meeting-rooms" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Ruangan Meeting</a>
        <a href="#amenities" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Fasilitas</a>
        <a href="#gallery" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Galeri</a>
        <a href="#testimonials" class="text-gray-600 hover:text-indigo-700 transition-colors duration-300">Testimoni</a>
      </div>
      <div class="md:hidden">
        <!-- Placeholder for mobile menu button -->
        <button class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section (dengan padding untuk navbar) -->
  <header id="hero" class="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center text-white pt-16" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://placehold.co/1920x1080/2F3143/fff?text=Hotel+Exterior');">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">{hotelName}</h1>
      <p class="text-xl md:text-2xl font-light mb-8">{tagline}</p>
      <button class="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-indigo-700 transition duration-300" on:click={() => openBooking({name: 'Kamar'})}>
        Pesan Sekarang
      </button>
    </div>
  </header>

  <!-- About Section -->
<section id="about" class="py-20">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Tentang Kami</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
			<!-- Bagian Teks -->
			<div>
				<p class="text-lg text-gray-600 leading-relaxed text-center md:text-left">{aboutText}</p>
			</div>
			<!-- Bagian Gambar -->
			<div class="rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
				<img src="https://placehold.co/1200x800/8086B8/fff?text=Hotel+Interior" alt="Lobi hotel yang indah" class="w-full h-auto object-cover" />
			</div>
		</div>
	</div>
</section>

  <!-- Rooms Section -->
  <section id="rooms" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Daftar Kamar</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each roomList as room}
          <div class="bg-gray-100 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img src={room.imageUrl} alt={room.name} class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">{room.price}</p>
            <div class="flex space-x-4">
              <button class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300" on:click={() => openBooking(room)}>
                Pesan
              </button>
              <button class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300" on:click={() => showDetails(room)}>
                Detail
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Meeting Rooms Section -->
  <section id="meeting-rooms" class="py-20 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Ruangan Meeting</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each meetingRooms as room}
          <div class="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img src={room.imageUrl} alt={room.name} class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p class="text-gray-600 mb-4">{room.description}</p>
            <p class="text-xl font-semibold text-indigo-600 mb-4">{room.price}</p>
            <div class="flex space-x-4">
              <button class="flex-1 bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300" on:click={() => openBooking(room)}>
                Pesan
              </button>
              <button class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-400 transition duration-300" on:click={() => showDetails(room)}>
                Detail
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Amenities Section -->
  <section id="amenities" class="py-20">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Fasilitas Kami</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each amenities as amenity}
          <div class="bg-white p-8 rounded-xl shadow-lg text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
            <img src={amenity.icon} alt={amenity.name} class="mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{amenity.name}</h3>
            <p class="text-sm text-gray-500">{amenity.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Gallery Section -->
  <section id="gallery" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Galeri</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each galleryImages as image}
          <div class="overflow-hidden rounded-lg shadow-md">
            <img src={image} alt="Galeri Hotel" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- New Call-to-Action Section -->
  <section id="visitor-stats" class="py-20 bg-cover bg-center" style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://placehold.co/1920x800/2F3143/fff?text=Hotel+Interior+2');">
    <div class="container mx-auto px-4 text-white text-center flex flex-col items-center justify-center">
      <h2 class="text-3xl md:text-5xl font-bold mb-4">
        Lebih dari 100.000 Traveller Mengunjungi Hotel Kami
      </h2>
      <p class="text-lg md:text-xl max-w-2xl mb-8">
        Bergabunglah dengan ribuan tamu yang telah merasakan kehangatan dan kemewahan The Serene Retreat.
      </p>
      <button class="bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition duration-300" on:click={() => openBooking({name: 'Kamar'})}>
        Pesan Sekarang
      </button>
    </div>
  </section>


  <!-- Testimonials Section -->
  <section id="testimonials" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">Apa Kata Mereka</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each testimonials as testimonial}
        <div class="bg-gray-100 p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
          <img src={testimonial.avatar} alt={testimonial.name} class="w-20 h-20 rounded-full mb-4 object-cover" />
          <p class="text-lg text-gray-600 italic mb-4">"{testimonial.review}"</p>
          <p class="font-semibold text-gray-800">- {testimonial.name}</p>
        </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Floating WhatsApp Button -->
  <!-- Tombol ini akan mengambang di pojok kanan bawah, tetap terlihat saat pengguna menggulir halaman. -->
  <a href="https://wa.me/628123456789?text=Halo%2C%20saya%20tertarik%20dengan%20The%20Serene%20Retreat.%20Bisa%20berikan%20informasi%20lebih%20lanjut%3F" 
     target="_blank" 
     class="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
     title="Hubungi Kami via WhatsApp">
    <!-- WhatsApp SVG Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.911C.15 6.862 6.175.068 13.978.068s13.82 6.794 13.82 15.165-6.023 15.165-13.82 15.165h-.002c-3.136 0-6.071-.815-8.665-2.296l-1.687 1.761zm5.09-3.486l-.21-.082c-2.072-1.258-3.23-3.6-3.23-6.195 0-4.636 4.093-8.411 9.155-8.411 5.062 0 9.156 3.775 9.156 8.411s-4.094 8.411-9.156 8.411c-2.423 0-4.664-1.002-6.28-2.618l-.21-.21zm9.324-4.832c.162.083.324.167.487.252.163.085.326.171.489.256.488.243 1.05.324 1.57.195.52-.129.897-.567 1.026-1.087.129-.52.029-1.07-.266-1.558-.295-.488-1.586-1.683-1.586-1.683s-1.051-1.185-1.051-2.072c0-1.135 1.259-2.072 2.618-2.072 1.359 0 2.502.83 2.502 2.072 0 1.258-1.259 2.072-2.618 2.072-.195 0-.39 0-.585-.027-.195-.027-.39-.054-.585-.081-.324-.027-.65-.054-.974-.081-.324-.027-.65-.054-.974-.081-1.359-.108-2.072-.256-2.072-1.051 0-.974.784-1.586 1.761-1.586.977 0 1.587.65 1.587 1.301 0 .65-.65 1.185-1.587 1.185-.937 0-1.259-.269-1.259-.269s-.488-.135-.488.351z"/>
    </svg>
  </a>


  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4 text-center md:text-left">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <!-- Diperbarui: Mengubah jumlah kolom menjadi 4 -->
        <div>
          <h3 class="text-2xl font-bold mb-4">{hotelName}</h3>
          <p class="text-gray-400">
            Tempat peristirahatan Anda jauh dari hiruk pikuk kota. Ketenangan bertemu dengan kemewahan.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Navigasi</h3>
          <ul class="space-y-2">
            <li><a href="#about" class="text-gray-400 hover:text-white transition-colors duration-300">Tentang Kami</a></li>
            <li><a href="#rooms" class="text-gray-400 hover:text-white transition-colors duration-300">Kamar</a></li>
            <li><a href="#meeting-rooms" class="text-gray-400 hover:text-white transition-colors duration-300">Ruangan Meeting</a></li>
            <li><a href="#amenities" class="text-gray-400 hover:text-white transition-colors duration-300">Fasilitas</a></li>
            <li><a href="#gallery" class="text-gray-400 hover:text-white transition-colors duration-300">Galeri</a></li>
            <li><a href="#testimonials" class="text-gray-400 hover:text-white transition-colors duration-300">Testimoni</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4">Hubungi Kami</h3>
          <p class="text-gray-400">
            Jalan Serene Indah No. 123<br>
            Jakarta, Indonesia<br>
            <br>
            Email: info@sereneretreat.com<br>
            Telp: (021) 123-4567
          </p>
          <div class="mt-4 flex justify-center md:justify-start space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.766s.784-1.766 1.75-1.766 1.75.79 1.75 1.766-.783 1.766-1.75 1.766zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.765 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.46 17.585h-2.327v-1.766h2.327v1.766zm-5.042-3.693h-2.327v-3.791h2.327v3.791zm10.084 0h-2.327v-3.791h2.327v3.791zm0-4.634h-2.327v-3.791h2.327v3.791zm-5.042 0h-2.327v-3.791h2.327v3.791zm-5.042 0h-2.327v-3.791h2.327v3.791zm0-4.634h-2.327v-2.756h2.327v2.756zm5.042 0h-2.327v-2.756h2.327v2.756zm5.042 0h-2.327v-2.756h2.327v2.756zm0-4.634h-2.327v-2.756h2.327v2.756z"/></svg>
            </a>
          </div>
        </div>
        <!-- Diperbarui: Menambahkan kolom peta -->
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
        <p>&copy; {new Date().getFullYear()} {hotelName}. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </footer>
</main>

<!-- Pop-up for Booking Confirmation -->
{#if showMessage}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" on:click={() => showMessage = false}></div>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full">
    <p class="text-lg text-gray-700 mb-6">{messageContent}</p>
    <button class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors" on:click={() => showMessage = false}>Tutup</button>
  </div>
{/if}

<!-- Pop-up for Details -->
{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" on:click={() => showModal = false}></div>
  <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl z-50 text-center max-w-sm w-full">
    <h3 class="text-2xl font-bold text-gray-800 mb-4">{modalTitle}</h3>
    <p class="text-md text-gray-600 mb-6">{modalContent}</p>
    <button class="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors" on:click={() => showModal = false}>Tutup</button>
  </div>
{/if}
