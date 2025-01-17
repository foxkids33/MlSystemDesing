<script lang="ts">
    export let title: string;
    export let updatedOn: string;
    export let description: string;
    export let nodeCount: number;
    export let nodeTypes: { label: string; count: number; color: string }[];
    export let relationshipCount: number;
</script>

<div class="w-80 border-l bg-white p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-semibold">{title}</h1>
    </div>

    <div class="space-y-6">
        <div>
            <p class="text-gray-600">Updated {updatedOn}</p>
            <p class="mt-4 text-gray-700">{description}</p>
        </div>

        <div>
            <h3 class="font-medium mb-2">
                Nodes <span class="bg-gray-200 px-2 py-1 rounded text-sm">{nodeCount}</span>
            </h3>
            <div class="space-y-2">
                {#each nodeTypes as { label, count, color }}
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: {color}"></div>
                        <span>{label} <span class="text-gray-500">({count})</span></span>
                    </div>
                {/each}
            </div>
        </div>

        <div>
            <h3 class="font-medium mb-2">
                Relationships <span class="bg-gray-200 px-2 py-1 rounded text-sm">{relationshipCount}</span>
            </h3>
        </div>
    </div>
</div>

<style>
</style>
