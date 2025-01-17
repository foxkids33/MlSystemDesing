<script lang="ts">
    import { onMount } from 'svelte';
    import { jsonData } from '../graph/nodes.js';

    let Sigma: typeof import('sigma').default | undefined;
    let Graph: typeof import('graphology').default | undefined;
    let renderer: typeof import('sigma').default | undefined;
    let layout: 'circular' | 'random' = 'random'; // Define layout as a union type

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

    function toggleLayout() {
        layout = layout === 'circular' ? 'random' : 'circular';
        initializeGraph();
    }
</script>

<h1>Sigma Graph Example</h1>
<button on:click={toggleLayout}>
    Toggle to {layout === 'circular' ? 'Random' : 'Circular'} Layout
</button>
<div id="sigma-container"></div>

<style>
    #sigma-container {
        width: 700px;
        height: 700px;
    }
    button {
        margin-bottom: 10px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
