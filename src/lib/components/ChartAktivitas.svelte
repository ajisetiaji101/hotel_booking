<script context="module" lang="ts">
    declare var Chart: any;
    interface ReportData {
        jumlah: number;
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let labelsbulan: string[] = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    export let nama: string = "data";
    export let tahun: number | undefined = new Date().getFullYear();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    let selectedYear = tahun;
    let data: ReportData[] = [];
    let chartInstance: any;
    let canvasElement: HTMLCanvasElement;

    $: console.log("Chart data updated:", data);

    /**
     * Generates an array of 12 objects, each with a random 'jumlah' value.
     * @returns {ReportData[]} An array of data points for the chart.
     */
    function generateRandomData(): ReportData[] {
        const randomData: ReportData[] = [];
        for (let i = 0; i < 12; i++) {
            randomData.push({
                jumlah: Math.floor(Math.random() * 900) + 100, // Random number between 100 and 999
            });
        }
        return randomData;
    }

    /**
     * Destroys the existing chart instance if it exists.
     */
    function destroyChart() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    }

    /**
     * Creates a new Chart.js instance on the canvas.
     */
    function createChart() {
        console.log("Creating chart for:", nama, "in year:", tahun);

        if (!canvasElement) return;

        const ctx = canvasElement.getContext("2d");
        if (ctx) {
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labelsbulan,
                    datasets: [
                        {
                            label: `${nama}`,
                            data: data.map((item) => item.jumlah),
                            borderColor: "rgb(59, 130, 246)",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 5,
                            pointHoverRadius: 8,
                            pointBackgroundColor: "white",
                            pointBorderColor: "rgb(59, 130, 246)",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: `${nama} Statistik - ${tahun}`,
                        },
                    },
                    interaction: {
                        mode: "index",
                        intersect: false,
                    },
                    hover: {
                        mode: "nearest",
                        intersect: true,
                    },
                },
            });
        }
    }

    onMount(() => {
        // Initialize data and create chart on mount
        data = generateRandomData();
        createChart();

        // Listen for changes to selectedYear
        $: if (selectedYear) {
            tahun = selectedYear;
            destroyChart();
            createChart();
        }
    });

    $: {
        // This block runs whenever selectedYear changes
        data = generateRandomData();
        destroyChart();
        createChart();
        tahun = selectedYear;
    }

    onDestroy(() => {
        destroyChart();
    });
</script>

<div class="chart-container p-6 bg-white rounded-lg h-full flex flex-col">
    <div
        class="flex flex-col sm:flex-row items-center justify-between mb-6 w-full gap-4"
    >
        <h3 class="text-xl font-semibold text-gray-800">Statistik Tahunan</h3>
        <div class="flex gap-2 w-full sm:w-auto justify-end pr-10">
            <select
                bind:value={selectedYear}
                class="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700"
            >
                {#each years as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex-grow">
        <canvas bind:this={canvasElement} id="aktivitasChart"></canvas>
    </div>
</div>
