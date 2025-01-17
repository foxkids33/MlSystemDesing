<script>
    import { onMount } from 'svelte';
    import Navbar from "@/components/Navbar.svelte";
    import {PUBLIC_VITE_API_URL} from "$env/static/public";

    let version = 'no version yet';

    onMount(async () => {
        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/version`);
            console.log("API URL:", PUBLIC_VITE_API_URL);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            version = data.version;
        } catch (error) {
            console.error('Error fetching version:', error);
        }
    });
</script>

<Navbar/>
<p>UI Version: {version}</p>
