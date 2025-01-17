<script lang="ts">
    import { onMount } from 'svelte';
    import { jsonData } from '../graph/nodes.js';
    import {HelpCircle, Image, Info, Minus, Plus, Settings} from "lucide-svelte";

    let Sigma: typeof import('sigma').default | undefined;
    let Graph: typeof import('graphology').default | undefined;
    let renderer: typeof import('sigma').default | undefined;
    let layout: 'circular' | 'random' = 'random'; // Define layout as a union type

    let showSidebar = true;

    const toggleSidebar = () => {
        showSidebar = !showSidebar;
    };

    onMount(async () => {
        if (typeof window !== 'undefined') {
            const sigmaModule = await import('sigma');
            const graphologyModule = await import('graphology');

            Sigma = sigmaModule.default;
            Graph = graphologyModule.default;

            initializeGraph();
        }
    });

    function initializeGraph() {
        const container1 = document.getElementById('sigma-container');
        if (container1 && Graph && Sigma) {
            const graph = new Graph({ allowSelfLoops: false });

            // Add nodes with dynamic layout
            applyLayout(graph);

            // Add edges and avoid duplicates
            jsonData.forEach(item => {
                item.relationships.forEach(relatedId => {
                    if (graph.hasNode(relatedId) && !graph.hasEdge(item.id, relatedId)) {
                        graph.addEdge(item.id, relatedId, {
                            size: 1 + item.difficulty * 0.5,
                            color: '#d3d3d3',
                            hover_color: '#000',
                        });
                    }
                });
            });

            // Initialize Sigma renderer
            if (renderer) renderer.kill(); // Clean up previous instance
            renderer = new Sigma(graph, container1, {
                renderLabels: true, // Always render labels
            });
        } else {
            console.error('Sigma container not found or modules not loaded!');
        }
    }

    function applyLayout(graph: typeof Graph.prototype) {
        const radius = 300;
        const centerX = 500;
        const centerY = 350;

        jsonData.forEach((item, index) => {
            const x = layout === 'circular'
                ? centerX + radius * Math.cos((2 * Math.PI * index) / jsonData.length)
                : Math.random() * 1000;
            const y = layout === 'circular'
                ? centerY + radius * Math.sin((2 * Math.PI * index) / jsonData.length)
                : Math.random() * 700;

            graph.addNode(item.id, {
                x,
                y,
                type: 'circle',
                size: 10 + item.difficulty * 5,
                label: item.name, // Show the label directly
                color: (() => {
                    const vibrantColors = ['#FF4500', '#FF8C00', '#FFD700', '#32CD32', '#1E90FF'];
                    return vibrantColors[item.difficulty - 1] || '#FFD700';
                })(),
                hover_color: '#FF1493',
            });
        });
    }

    export function toggleLayout() {
        layout = layout === 'circular' ? 'random' : 'circular';
        initializeGraph();
    }
</script>

<div class="relative h-screen w-full bg-gray-50">
    <!-- Main Content -->
    <div class="h-full w-full flex">
        <!-- Graph Area -->
        <div class="flex-1 relative">
            <div id="sigma-container"></div>

            <!-- Control Buttons -->
            <div class="absolute right-4 top-4 flex flex-col gap-2">
                <button class="p-2 bg-white rounded-full shadow hover:bg-gray-50" on:click={toggleSidebar}>
                    <Info class="w-5 h-5" />
                </button>
                <button class="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                    <Settings class="w-5 h-5" />
                </button>
                <button class="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                    <Image class="w-5 h-5" />
                </button>
                <button class="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                    <Plus class="w-5 h-5" />
                </button>
                <button class="p-2 bg-white rounded-full shadow hover:bg-gray-50">
                    <Minus class="w-5 h-5" />
                </button>
                <button  class="p-2 bg-white rounded-full shadow hover:bg-gray-50" on:click={toggleLayout}>
                    <HelpCircle class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- Sidebar -->
        {#if showSidebar}
            <div class="w-80 border-l bg-white p-6 ">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-xl font-semibold">Object-Oriented Programming (OOP)</h1>
                </div>

                <div class="space-y-6">

                    <div>
                        <p class="text-gray-600">
                            Updated Dec 7, 2022
                        </p>
                        <p class="mt-4 text-gray-700">
                            OOP is a paradigm based on the concept of objects containing data and methods. Core principles include encapsulation, inheritance, and polymorphism, essential for complex software development.

                        </p>
                    </div>

                    <div>
                        <h3 class="font-medium mb-2">Related Concepts <span class="bg-gray-200 px-2 py-1 rounded text-sm">2</span></h3>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full bg-blue-400"></div>
                                <span>Data Structures<span class="text-gray-500"></span></span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full bg-purple-400"></div>
                                <span>Algorithms <span class="text-gray-500"></span></span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="font-medium mb-2">Learning artifacts <span class="bg-gray-200 px-2 py-1 rounded text-sm">3</span></h3>
                        <div class="flex space-x-2 mt-2">
                            <span class="bg-gray-200 px-4 py-2 rounded text-sm"></span>
                            <span class="bg-gray-200 px-4 py-2 rounded text-sm"></span>
                            <span class="bg-gray-200 px-4 py-2 rounded text-sm"></span>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>


<style>
    #sigma-container {
        width: 100%;
        height: 80%;
    }
    button {
        margin-bottom: 10px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
