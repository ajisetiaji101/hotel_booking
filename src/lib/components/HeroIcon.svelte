<script lang="ts">
    export let name: string;
    export let colorClass: string = "text-gray-500"; // Default color

    // This is a simplified way. For a real app, you might import from a library or
    // have a map of names to actual SVG paths.
    // For now, we'll keep the direct SVG paths as in your original component,
    // but just moved into this new file.
</script>

<div class={`w-8 h-8 mb-2 ${colorClass}`}>
    {#if name === "exclamation-triangle"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    {:else if name === "currency-dollar"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
        </svg>
    {:else if name === "folder"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7h4l2 3h10a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
        </svg>
    {:else if name === "document"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16h8M8 12h8m-6-8h4a2 2 0 012 2v12a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
        </svg>
    {:else if name === "home"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4a2 2 0 012-2h3m4 6h4a2 2 0 002-2v-4a2 2 0 00-2-2h-3"
            />
        </svg>
    {:else if name === "clock"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6l4 2m-6 8a9 9 0 100-18 9 9 0 000 18z"
            />
        </svg>
    {:else if name === "cube"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4v10l8 4 8-4V7z"
            />
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v18"
            />
        </svg>
    {:else if name === "building-storefront"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4h16v4H4V4zm0 4v12h16V8m-2 4h-4v4h4v-4z"
            />
        </svg>
    {:else if name === "user-group"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11a4 4 0 11-8 0 4 4 0 018 0zm-6 5a6.002 6.002 0 00-5.775 4.5A10.001 10.001 0 0112 21a10.001 10.001 0 017.775-5.5A6.002 6.002 0 0012 16h-2z"
            />
        </svg>
    {:else if name === "truck"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 16v1a2 2 0 002 2h14a2 2 0 002-2v-1m-1-3V7a2 2 0 00-2-2H7l-4 4v6m18-6h1a1 1 0 011 1v3a1 1 0 01-1 .993L20 .993V7zM5.5 17a1.5 1.5 0 11-3 .001A1.5 1.5 0 015.517zM18.5,17a1.5,1.5,0,1,1,3,.001A1.5,1.5,0,0,1,18.517,17Z"
            />
        </svg>
    {:else if name === "utensils"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8V3m0 5a2 2 0 11-4 0 2 2 0 014 0zm0 0v10m0-10h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
        </svg>
    {:else if name === "comments"}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    {:else if name === "chart-bar"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
        </svg>
    {/if}
</div>
