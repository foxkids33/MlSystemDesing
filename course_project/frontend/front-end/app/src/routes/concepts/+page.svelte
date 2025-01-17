<script lang="ts">
    import { onMount } from "svelte";
    import { getCookie } from "$lib/cookies";
    import { PUBLIC_VITE_API_URL } from "$env/static/public";
    import Navbar from "$lib/components/Navbar.svelte";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
    import { Badge } from "$lib/components/ui/badge/index.js";

    interface Concept {
        id: string;
        name: string;
        description: string;
        difficulty: number;
        image?: string;
    }

    let concepts: Concept[] = [];
    let easyConcepts: Concept[] = [];
    let mediumConcepts: Concept[] = [];
    let hardConcepts: Concept[] = [];
    let apiDescription = '';

    let easyApi: CarouselAPI;
    let mediumApi: CarouselAPI;
    let hardApi: CarouselAPI;

    let easyCurrent = 0, mediumCurrent = 0, hardCurrent = 0;
    let easyCount = 0, mediumCount = 0, hardCount = 0;

    $: if (easyApi) {
        easyCount = easyApi.scrollSnapList().length;
        easyCurrent = easyApi.selectedScrollSnap() + 1;
        easyApi.on("select", () => {
            easyCurrent = easyApi.selectedScrollSnap() + 1;
        });
    }

    $: if (mediumApi) {
        mediumCount = mediumApi.scrollSnapList().length;
        mediumCurrent = mediumApi.selectedScrollSnap() + 1;
        mediumApi.on("select", () => {
            mediumCurrent = mediumApi.selectedScrollSnap() + 1;
        });
    }

    $: if (hardApi) {
        hardCount = hardApi.scrollSnapList().length;
        hardCurrent = hardApi.selectedScrollSnap() + 1;
        hardApi.on("select", () => {
            hardCurrent = hardApi.selectedScrollSnap() + 1;
        });
    }

    onMount(async () => {
        const sessionId = getCookie('sessionID');
        if (!sessionId) {
            apiDescription = 'Session ID not found';
            return;
        }

        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/concept`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'X-Session-ID': sessionId
                }
            });

            console.log("response", response);

            if (!response.ok) {
                throw new Error('Failed to fetch concepts, status: ' + response.status);
            }

            concepts = await response.json() as Concept[];

            concepts.sort((a, b) => a.difficulty - b.difficulty);

            easyConcepts = concepts.filter(concept => concept.difficulty === 1);
            mediumConcepts = concepts.filter(concept => concept.difficulty === 2);
            hardConcepts = concepts.filter(concept => concept.difficulty >= 3);

            concepts.forEach(concept => {
                concept.image = getRandomLocalImage();
            });

        } catch (error) {
            console.error('Error fetching concepts:', error);
            apiDescription = 'Failed to fetch concepts';
        }
    });

    function getRandomLocalImage() {
        const randomImageNumber = Math.floor(Math.random() * 19) + 1;
        return `/src/lib/assets/images/image${randomImageNumber}.jpg`;
    }
</script>

<Navbar />
<div class="flex min-h-screen w-full flex-col">
    <main class="flex flex-1 flex-col gap-8 px-4 py-8 md:px-16 lg:px-32">
        <div class="w-full flex justify-center mb-8">
            <h1 class="text-3xl font-bold text-center">Browse Concepts by Difficulty</h1>
        </div>

        <!-- Easy Concepts Carousel -->
        <h2 class="text-2xl font-semibold mb-4">Easy Concepts</h2>
        {#if easyConcepts.length === 0}
            <p>No easy concepts found.</p>
        {:else}
            <div class="relative w-full">
                <Carousel.Root bind:api={easyApi} class="w-full overflow-hidden">
                    <Carousel.Content class="flex gap-4"> <!-- Ensure spacing between items -->
                        {#each easyConcepts as concept (concept.id)}
                            <Carousel.Item class="min-w-[250px] max-w-[250px] mx-auto">
                                <Card.Root class="rounded-lg h-[350px] w-[250px]">
                                    <Card.Content class="p-4 relative h-full flex flex-col justify-between">
                                        <img src={concept.image} alt="Concept Image" class="w-full h-40 object-cover rounded-md mb-4" />
                                        <Badge class="absolute top-2 left-2 bg-blue-500 text-white">Easy</Badge>
                                        <div class="text-center">
                                            <h3 class="text-lg font-bold mb-2">{concept.name}</h3>
                                            <p class="text-sm text-muted-foreground">{concept.description}</p>
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            </Carousel.Item>
                        {/each}
                    </Carousel.Content>
                    <Carousel.Previous class="absolute -left-12 top-1/2 transform -translate-y-1/2" />
                    <Carousel.Next class="absolute -right-12 top-1/2 transform -translate-y-1/2" />
                </Carousel.Root>

            </div>
        {/if}

        <!-- Medium Concepts Carousel -->
        <h2 class="text-2xl font-semibold mb-4">Medium Concepts</h2>
        {#if mediumConcepts.length === 0}
            <p>No medium concepts found.</p>
        {:else}
            <div class="relative w-full">
                <Carousel.Root bind:api={mediumApi} class="w-full overflow-hidden">
                    <Carousel.Content class="flex gap-4"> <!-- Ensure spacing between items -->
                        {#each mediumConcepts as concept (concept.id)}
                            <Carousel.Item class="min-w-[250px] max-w-[250px] mx-auto">
                                <Card.Root class="rounded-lg h-[350px] w-[250px]">
                                    <Card.Content class="p-4 relative h-full flex flex-col justify-between">
                                        <img src={concept.image} alt="Concept Image" class="w-full h-40 object-cover rounded-md mb-4" />
                                        <Badge class="absolute top-2 left-2 bg-yellow-500 text-white">Medium</Badge>
                                        <div class="text-center">
                                            <h3 class="text-lg font-bold mb-2">{concept.name}</h3>
                                            <p class="text-sm text-muted-foreground">{concept.description}</p>
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            </Carousel.Item>
                        {/each}
                    </Carousel.Content>
                    <Carousel.Previous class="absolute -left-12 top-1/2 transform -translate-y-1/2" />
                    <Carousel.Next class="absolute -right-12 top-1/2 transform -translate-y-1/2" />
                </Carousel.Root>

            </div>
        {/if}

        <!-- Hard Concepts Carousel -->
        <h2 class="text-2xl font-semibold mb-4">Hard Concepts</h2>
        {#if hardConcepts.length === 0}
            <p>No hard concepts found.</p>
        {:else}
            <div class="relative w-full">
                <Carousel.Root bind:api={hardApi} class="w-full overflow-hidden">
                    <Carousel.Content class="flex gap-4"> <!-- Ensure spacing between items -->
                        {#each hardConcepts as concept (concept.id)}
                            <Carousel.Item class="min-w-[250px] max-w-[250px] mx-auto">
                                <Card.Root class="rounded-lg h-[350px] w-[250px]">
                                    <Card.Content class="p-4 relative h-full flex flex-col justify-between">
                                        <img src={concept.image} alt="Concept Image" class="w-full h-40 object-cover rounded-md mb-4" />
                                        <Badge class="absolute top-2 left-2 bg-red-500 text-white">Hard</Badge>
                                        <div class="text-center">
                                            <h3 class="text-lg font-bold mb-3">{concept.name}</h3>
                                            <p class="text-sm text-muted-foreground">{concept.description}</p>
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            </Carousel.Item>
                        {/each}
                    </Carousel.Content>
                    <Carousel.Previous class="absolute -left-12 top-1/2 transform -translate-y-1/2" />
                    <Carousel.Next class="absolute -right-12 top-1/2 transform -translate-y-1/2" />
                </Carousel.Root>

            </div>
        {/if}
    </main>
</div>

<style>
    body, html {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
