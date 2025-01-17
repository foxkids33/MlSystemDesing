<!-- src/lib/components/NavBar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';

    // Icons imports

    import Menu from "lucide-svelte/icons/menu";
    import Search from "lucide-svelte/icons/search";
    import CircleUser from "lucide-svelte/icons/circle-user";

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {signOut} from "@auth/sveltekit/client";
    import {Home} from "lucide-svelte";

    let currentPath = '';

    $: page.subscribe(({ url }) => {
        currentPath = url.pathname;
    });


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


    const isActive = (path: string) => currentPath === path ? 'active' : '';
</script>

<style>
    .active {
        @apply text-ssAccentColor font-bold;
    }
    .nav-link {
        @apply transition-colors;
    }
    .nav-link:hover {
        @apply text-ssAccentColor;
    }
</style>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
    <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Home class="h-6 w-6 text-ssAccentColor" />
            <span class="sr-only">Acme Inc</span>
        </a>
        <a href="/dashboard" class="nav-link {isActive('/dashboard')}">
            Smart Seminarian
        </a>
        <a href="/concepts" class="nav-link {isActive('/concepts')}">
            Concepts
        </a>
        <a href="/training" class="nav-link {isActive('/training')}">
            Training
        </a>
        <a href="/chat" class="nav-link {isActive('/chat')}">
            Chat
        </a>
    </nav>

    <Sheet.Root>
        <Sheet.Trigger asChild let:builder>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
                <Menu class="h-5 w-5" />
                <span class="sr-only">Toggle navigation menu</span>
            </Button>
        </Sheet.Trigger>
        <Sheet.Content side="left">
            <nav class="grid gap-6 text-lg font-medium">
                <a href="/" class="flex items-center gap-2 text-lg font-semibold">
                    <Home class="h-6 w-6 text-ssAccentColor" />
                    <span class="sr-only">Acme Inc</span>
                </a>
                <a href="/dashboard" class="nav-link {isActive('/dashboard')}"> Dashboard </a>
                <a href="/concepts" class="nav-link {isActive('/concepts')}"> Concepts </a>
                <a href="/training" class="nav-link {isActive('/training')}"> Training </a>
                <a href="/chat" class="nav-link {isActive('/chat')}"> Chat </a>
            </nav>
        </Sheet.Content>
    </Sheet.Root>
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form class="ml-auto flex-1 sm:flex-initial">
            <div class="relative">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Ask a question..." class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
            </div>
        </form>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
                    {#if $page.data.session?.user?.image}
                        <img
                                src={$page.data.session.user.image}
                                alt="User Profile"
                                class="w-10 h-10 rounded-full"
                        />
                    {:else}
                        <CircleUser class="h-5 w-5" />
                    {/if}
                    <span class="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content align="end">
                <DropdownMenu.Label>
                    {#if $page.data.session}
                        {$page.data.session.user?.name}
                    {:else}
                        My Account
                    {/if}
                </DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    <a href="/settings" class="nav-link"> Settings </a>
                </DropdownMenu.Item>
                <DropdownMenu.Item>Support</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item on:click={handleSignOut}>Logout</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
</header>
