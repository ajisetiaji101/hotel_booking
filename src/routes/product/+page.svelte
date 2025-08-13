<script lang="ts">
  // Import icons for the facilities from lucide-svelte.
  // These provide a professional touch to the user interface.
  import { Wifi, ShowerHead, Dumbbell, ParkingSquare, Coffee, Waves, X, Loader2, CalendarClock } from 'lucide-svelte';

  // Define a type for the item to ensure data consistency.
  interface Item {
    name: string;
    details: string;
    price: string;
    imageUrl: string;
    facilities: string[];
  }

  // Define a type for a facility.
  interface Facility {
    name: string;
    icon: any; // Using 'any' for the Svelte component.
  }

  // --- STATE MANAGEMENT ---
  let showBookingModal = false;
  let isProcessing = false;

  // States for the form inputs
  let checkInDate: string = '';
  let checkOutDate: string = '';
  let niksim: string = '';
  let fullName: string = '';

  // States for coupon functionality
  let couponCode = '';
  let couponMessage = '';
  let isCouponValid = false;
  let discountPercentage = 0;

  // States for price calculation
  let subtotal = 0;
  let taxAmount = 0;
  let totalPrice = 0;
  let dateError = '';
  
  // Define a constant for the tax rate (e.g., 11% in Indonesia)
  const TAX_RATE = 0.11;

  // --- MOCK DATA ---
  const selectedItem: Item = {
    name: "Apartemen Senja",
    details: "Apartemen modern dengan pemandangan kota yang menakjubkan. Terletak strategis di pusat kota, dekat dengan berbagai fasilitas umum dan hiburan. Nikmati kenyamanan dan kemewahan dalam satu tempat.",
    price: "Rp 1.500.000 / malam",
    imageUrl: "https://placehold.co/1200x800/d1d5db/374151?text=Ruangan+Apartemen+Modern",
    facilities: ["wifi", "bathroom", "gym", "parking", "cafe", "pool"],
  };

  // Base price per night for calculation (parsed from the mock data string)
  const basePricePerNight = 1500000;

  const allFacilities: Record<string, Facility> = {
    wifi: { name: "Wi-Fi Gratis", icon: Wifi },
    bathroom: { name: "Kamar Mandi Pribadi", icon: ShowerHead },
    gym: { name: "Pusat Kebugaran", icon: Dumbbell },
    parking: { name: "Parkir", icon: ParkingSquare },
    cafe: { name: "Kafe", icon: Coffee },
    pool: { name: "Kolam Renang", icon: Waves },
  };

  // Simulated list of booked dates. In a real app, this would come from a backend.
  const bookedDates = ['2025-08-20', '2025-08-21', '2025-08-22', '2025-08-23', '2025-08-24'];

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to check if a date is booked
  const isDateBooked = (date: string) => {
    return bookedDates.includes(date);
  };
  
  // --- FUNCTIONS ---
  function goBack() {
    console.log("Go back to the previous page.");
    history.back();
  }

  function openBooking() {
    showBookingModal = true;
    // Reset states when opening the modal
    couponCode = '';
    couponMessage = '';
    isCouponValid = false;
    discountPercentage = 0;
    checkInDate = '';
    checkOutDate = '';
    subtotal = 0;
    taxAmount = 0;
    totalPrice = 0;
    dateError = '';
  }

  function closeModal() {
    showBookingModal = false;
  }

  function checkCoupon() {
    // A simple mock check. In a real app, you'd call an API.
    if (couponCode.toUpperCase() === "HEMAT50") {
      couponMessage = "Kupon HEMAT50 berhasil diterapkan! Dapatkan diskon 50%.";
      isCouponValid = true;
      discountPercentage = 0.50;
    } else {
      couponMessage = "Kupon tidak valid. Silakan coba lagi.";
      isCouponValid = false;
      discountPercentage = 0;
    }
  }

  // Reactive calculation for the price and date validation
  // This block runs automatically whenever checkInDate, checkOutDate, or isCouponValid changes.
  $: {
    dateError = '';
    subtotal = 0;
    taxAmount = 0;
    totalPrice = 0;

    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        dateError = "Tanggal check-out harus setelah tanggal check-in.";
      } else {
        // Check for booked dates in the selected range
        let currentDate = new Date(start);
        let hasOverlap = false;
        while (currentDate <= end) {
          if (isDateBooked(currentDate.toISOString().split('T')[0])) {
            hasOverlap = true;
            break;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (hasOverlap) {
          dateError = "Tanggal yang Anda pilih sebagian atau seluruhnya sudah terisi. Silakan pilih tanggal lain.";
        } else {
          let calculatedSubtotal = diffDays * basePricePerNight;
          
          // Apply discount if coupon is valid
          if (isCouponValid) {
            calculatedSubtotal = calculatedSubtotal * (1 - discountPercentage);
          }
          
          const calculatedTax = calculatedSubtotal * TAX_RATE;
          
          subtotal = calculatedSubtotal;
          taxAmount = calculatedTax;
          totalPrice = calculatedSubtotal + calculatedTax;
        }
      }
    }
  }

  // Helper function to format number to IDR currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // This is a placeholder for a real backend call.
  // In a real application, you would make a fetch request to your server.
  const getMidtransSnapToken = async (bookingDetails: any) => {
    // Simulate a successful API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Simulating backend call to get Snap Token with details:", bookingDetails);
        // This is a dummy Snap Token. Replace with a real one from your backend.
        resolve("mock_snap_token_12345");
      }, 1500);
    });
  };

  // The main booking handler
  async function handleBooking(event: Event) {
    event.preventDefault();
    if (dateError) return;
    
    isProcessing = true;
    
    // Create a booking object to send to the backend
    const bookingDetails = {
      niksim,
      fullName,
      checkInDate,
      checkOutDate,
      totalPrice,
      couponCode,
    };
    
    try {
      // 1. Call the (simulated) backend to get a Snap Token
      const snapToken = await getMidtransSnapToken(bookingDetails);

      // 2. Dynamically load the Midtrans Snap script
      const midtransScript = document.createElement('script');
      midtransScript.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Use sandbox URL for testing
      midtransScript.setAttribute('data-client-key', 'YOUR_CLIENT_KEY'); // Replace with your actual client key
      document.body.appendChild(midtransScript);
      
      midtransScript.onload = () => {
        // 3. Once the script is loaded, open the Midtrans payment modal
        if (window.snap) {
          window.snap.pay(snapToken, {
            onSuccess: function(result: any){
              console.log('Payment successful:', result);
              // TODO: Handle successful payment (e.g., show a success page)
              closeModal();
            },
            onPending: function(result: any){
              console.log('Payment pending:', result);
              // TODO: Handle pending payment (e.g., show a pending page)
              closeModal();
            },
            onError: function(result: any){
              console.log('Payment failed:', result);
              // TODO: Handle payment error (e.g., show an error message)
              closeModal();
            },
            onClose: function(){
              console.log('Midtrans popup closed without payment.');
              // TODO: Handle modal closure
            }
          });
        }
        isProcessing = false;
      };
      
      midtransScript.onerror = (error) => {
        console.error("Failed to load Midtrans script:", error);
        isProcessing = false;
      };

    } catch (error) {
      console.error("Error during booking process:", error);
      isProcessing = false;
    }
  }
</script>

<!-- The main container for the entire page. -->
<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
  <div class="container mx-auto max-w-6xl">
    <!-- The "Go Back" button with an updated style -->
    <button on:click={goBack} class="flex items-center text-gray-700 hover:text-gray-900 transition duration-300 font-semibold mb-8 group">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Kembali
    </button>

    <!-- Main content area for the item details -->
    <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 transform hover:scale-105 transition-transform duration-300">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <!-- Image section -->
        <div class="p-6 lg:p-0">
          <img src={selectedItem.imageUrl} alt={selectedItem.name} class="w-full h-full object-cover rounded-2xl lg:rounded-l-3xl lg:rounded-r-none" />
        </div>
        
        <!-- Details section -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-800 leading-tight mb-4">{selectedItem.name}</h1>
          <p class="text-gray-600 text-lg mb-6">{selectedItem.details}</p>
          <div class="flex items-baseline mb-8">
            <p class="text-3xl sm:text-4xl font-bold text-indigo-600 mr-2">{selectedItem.price}</p>
          </div>
          <button on:click={openBooking} class="w-full sm:w-auto bg-indigo-600 text-white py-4 px-10 rounded-full font-bold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl">
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>

    <!-- Facilities section -->
    <div class="bg-white p-8 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
      <h3 class="text-3xl font-bold text-gray-800 mb-6">Fasilitas</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each selectedItem.facilities as facilityKey}
          {#if allFacilities[facilityKey]}
            <div class="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl shadow-inner hover:bg-indigo-50 transition duration-300">
              <svelte:component this={allFacilities[facilityKey].icon} class="w-6 h-6 text-indigo-500" />
              <span class="text-gray-700 font-medium text-lg">{allFacilities[facilityKey].name}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Booking Modal -->
{#if showBookingModal}
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Pesan {selectedItem.name}</h2>
        <button on:click={closeModal} class="text-gray-400 hover:text-gray-600 transition duration-300">
          <X class="w-6 h-6" />
        </button>
      </div>

      <form on:submit|preventDefault={handleBooking} class="space-y-4">
        <div>
          <label for="niksim" class="block text-sm font-medium text-gray-700">NIK/No. KTP</label>
          <input type="text" id="niksim" name="niksim" required bind:value={niksim} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
        </div>
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" id="fullName" name="fullName" required bind:value={fullName} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
        </div>

        <!-- Date selection section - Modernized -->
        <div class="space-y-4">
            <div class="flex items-center justify-between text-base font-semibold text-gray-800">
                <div class="flex items-center space-x-2">
                    <CalendarClock class="w-5 h-5 text-indigo-500" />
                    <span>Pilih Tanggal</span>
                </div>
            </div>

            <div class="flex items-center justify-center w-full bg-gray-100 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300">
                <div class="flex-1 px-2 py-1">
                    <label for="checkInDate" class="block text-xs font-medium text-gray-500">Check-in</label>
                    <input 
                      type="date" 
                      id="checkInDate" 
                      name="checkInDate" 
                      required 
                      bind:value={checkInDate} 
                      min={getTodayDate()} 
                      class="block w-full bg-gray-100 text-gray-800 border-none focus:outline-none focus:ring-0 p-0" 
                    />
                </div>
                <div class="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
                <div class="flex-1 px-2 py-1">
                    <label for="checkOutDate" class="block text-xs font-medium text-gray-500">Check-out</label>
                    <input 
                      type="date" 
                      id="checkOutDate" 
                      name="checkOutDate" 
                      required 
                      bind:value={checkOutDate} 
                      min={checkInDate || getTodayDate()}
                      disabled={!checkInDate}
                      class="block w-full bg-gray-100 text-gray-800 border-none focus:outline-none focus:ring-0 p-0" 
                    />
                </div>
            </div>
            
            {#if dateError}
                <p class="text-sm font-medium text-red-600 -mt-2">{dateError}</p>
            {/if}

            <div class="p-3 bg-yellow-50 rounded-xl text-sm text-yellow-800 border border-yellow-200">
                <p class="font-medium">Tanggal yang sudah terisi:</p>
                <p>{bookedDates.join(', ')}</p>
            </div>
        </div>
        <div>
          <label for="guests" class="block text-sm font-medium text-gray-700">Jumlah Tamu</label>
          <input type="number" id="guests" name="guests" min="1" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
        </div>

        <!-- Coupon section -->
        <div>
          <label for="coupon" class="block text-sm font-medium text-gray-700">Kode Kupon</label>
          <div class="flex space-x-2">
            <input
              type="text"
              id="coupon"
              name="coupon"
              bind:value={couponCode}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border uppercase"
            />
            <button
              type="button"
              on:click={checkCoupon}
              class="mt-1 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 transition duration-300"
            >
              Cek
            </button>
          </div>
          {#if couponMessage}
            <p class="mt-2 text-sm" class:text-green-600={isCouponValid} class:text-red-600={!isCouponValid}>{couponMessage}</p>
          {/if}
        </div>
        
        <!-- Price breakdown section -->
        {#if totalPrice > 0}
          <div class="pt-4 border-t border-gray-200 mt-4">
            <div class="flex justify-between items-center text-gray-700">
              <span>Subtotal ({Math.ceil(Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))} malam)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div class="flex justify-between items-center text-gray-700 mt-1">
              <span>Pajak ({TAX_RATE * 100}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            {#if isCouponValid}
                <div class="flex justify-between items-center text-green-600 mt-1">
                    <span>Diskon ({discountPercentage * 100}%)</span>
                    <span>-{formatCurrency(subtotal * discountPercentage)}</span>
                </div>
            {/if}
            <div class="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-gray-300">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        {/if}
        
        <div class="pt-4">
          <button type="submit" disabled={isProcessing || !!dateError} class="w-full bg-indigo-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
            {#if isProcessing}
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            {:else}
              <span>Konfirmasi Pesanan</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
