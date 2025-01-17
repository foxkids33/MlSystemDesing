<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Github, Loader2 } from 'lucide-svelte';

    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { signIn } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';

    const dispatcher = createEventDispatcher();

    // Function to check session and redirect if logged in
    const checkSessionAndRedirect = () => {
        onMount(() => {
            const unsubscribe = page.subscribe($page => {
                if ($page.data.session) {
                    goto('/dashboard');
                }
            });

            return () => unsubscribe();
        });
    };

    checkSessionAndRedirect();

    let isLoading = false;

    const quotes = [
        {
            text: "Controlling complexity is the essence of computer programming.",
            author: "Brian Kernighan"
        },
        {
            text: "The best way to learn is to do; the worst way to teach is to talk.",
            author: "Donald Knuth"
        },
        {
            text: "Computer science is no more about computers than astronomy is about telescopes.",
            author: "Edsger Dijkstra"
        },
        {
            text: "He who refuses to do arithmetic is doomed to talk nonsense.",
            author: "John McCarthy"
        },
        {
            text: "Simplicity is prerequisite for reliability.",
            author: "Edsger Dijkstra"
        },
        {
            text: "Programs must be written for people to read, and only incidentally for machines to execute.",
            author: "Harold Abelson"
        },
        {
            text: "The purpose of computing is insight, not numbers.",
            author: "Richard Hamming"
        },
        {
            text: "Premature optimization is the root of all evil.",
            author: "Donald Knuth"
        },
        {
            text: "Learning to write programs stretches your mind, and helps you think better.",
            author: "Bill Gates"
        },
        {
            text: "The best way to predict the future is to invent it.",
            author: "Alan Kay"
        }
    ];

    let selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];

    async function handleSignIn() {
        isLoading = true;
        await signIn("github");
        isLoading = false;
    }
</script>

<div class="container relative h-screen flex items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col text-white lg:flex dark:border-r">
        <div
                class="absolute inset-0 bg-cover"
                style="background-image: url(https://images.unsplash.com/photo-1637946175559-22c4fe13fc54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFic3RyYWN0JTIwJTIwZ2VvbWV0cmljJTIwZGFya3xlbnwwfHwwfHx8MA%3D%3D);"
        />
        <div class="relative z-20 p-10 text-lg font-medium">
            <a href="/" class="hover:text-ssAccentLighter">
                Smart Seminarian
            </a>

        </div>
        <div class="relative z-20 mt-auto p-10">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &ldquo;{selectedQuote.text}&rdquo;
                </p>
                <footer class="text-sm">{selectedQuote.author}</footer>
            </blockquote>
        </div>
    </div>


    <div class="flex items-center justify-center p-8 h-full">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">Login with GitHub</h1>
                <p class="text-ssGray text-sm">
                    Use your GitHub account to log in.
                </p>
            </div>

            <Button on:click={() => signIn("github")} class="w-full bg-black text-white hover:bg-ssAccentColor">
                {#if isLoading}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin text-white" />
                    Loading...
                {:else}
                    <Github class="mr-2 h-4 w-4 text-white" />
                    Login with GitHub
                {/if}
            </Button>


            <p class="text-muted-foreground px-4 text-center text-[12px] text-ssMiddleGray">
                By logging in, you agree to our
                <a href="/terms" class="hover:text-primary underline underline-offset-4">
                    Terms of Service
                </a>
                and
                <a href="/privacy" class="hover:text-primary underline underline-offset-4">
                    Privacy Policy
                </a>
                .
            </p>

        </div>
    </div>
</div>
