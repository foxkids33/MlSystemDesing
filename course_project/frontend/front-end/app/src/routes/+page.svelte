<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    import { setCookie, getCookie, deleteCookie } from '$lib/cookies';
    import { PUBLIC_VITE_API_URL, PUBLIC_VITE_API_TOKEN} from "$env/static/public";

    let sessionId: string | null = "No Session ID, You need to log in";
    import Activity from "lucide-svelte/icons/activity";
    import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
    import CircleUser from "lucide-svelte/icons/circle-user";
    import CreditCard from "lucide-svelte/icons/credit-card";
    import DollarSign from "lucide-svelte/icons/dollar-sign";
    import Menu from "lucide-svelte/icons/menu";
    import Package2 from "lucide-svelte/icons/package-2";
    import Search from "lucide-svelte/icons/search";
    import Users from "lucide-svelte/icons/users";

    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import * as Table from "$lib/components/ui/table/index.js";

    // Access VITE_API_URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL;

    function deleteAllCookies() {
        const cookies = document.cookie.split(';');
        cookies.forEach((cookie) => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    }

    const handleSignOut = () => {
        deleteAllCookies();
        signOut();
    };
    onMount(() => {
        sessionId = getCookie('sessionID');

        if (!sessionId) {
            const session = $page.data.session;
            if (session) {
                fetch(`${PUBLIC_VITE_API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        github_username: session.user?.name,
                        token: PUBLIC_VITE_API_TOKEN
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        sessionId = data['session_id'] || "No Session ID returned";
                        if (sessionId != null) {
                            setCookie('sessionID', sessionId, 7); // Cookie expires in 7 days
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching session ID:", error);
                        sessionId = "Error fetching session ID";
                    });
            }
        }
    });
</script>

<Navbar />

<Card.Root class="max-w-lg mx-auto mt-12">
    <Card.Header class="flex flex-col items-start space-y-4">
        {#if $page.data.session}
            <Card.Title>You are logged in as: {$page.data.session.user?.name}</Card.Title>
            {#if $page.data.session.user?.image}
                <img src={$page.data.session.user?.image} alt="User Profile" class="w-12 h-12 rounded-full mb-3">
            {/if}
            <Card.Description>
                <p><strong>Signed in as:</strong> {$page.data.session.user?.name}</p>
                <p><strong>Email:</strong> {$page.data.session.user?.email}</p>
                <p><strong>Session expires:</strong> {$page.data.session.expires}</p>
                <p><strong>Seminarian-Session-ID:</strong> {sessionId}</p>
                <button
                        on:click={() => signOut()}
                        class="bg-ssAccentColor hover:bg-ssMiddleGray text-white py-2 px-4 rounded-md transition-colors mt-4">
                    Sign out
                </button>
            </Card.Description>
        {:else}
            <Card.Title>You are not logged in</Card.Title>
            <p>Welcome to the Smart Seminarian Website</p>
            <div class="flex space-x-4">
                <a href="/login" class="bg-ssAccentColor hover:bg-ssAccentLighter text-white py-2 px-4 rounded-md transition-colors">
                    Log In
                </a>
            </div>
        {/if}
    </Card.Header>
</Card.Root>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>
