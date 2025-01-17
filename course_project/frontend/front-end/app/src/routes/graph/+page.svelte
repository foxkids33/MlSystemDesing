<script>
    import { Info, X, Settings, Image, Plus, Minus, HelpCircle } from 'lucide-svelte';
    import Navbar from "@/components/Navbar.svelte";
    import NetworkMap from "./NetworkMap.svelte";
    import toggleLayout from "./NetworkMap.svelte";



    let showSidebar = true;

    const toggleSidebar = () => {
        showSidebar = !showSidebar;
    };
</script>

<Navbar/>
<NetworkMap/>