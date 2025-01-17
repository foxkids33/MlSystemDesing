<script lang="ts">
    import loader from '@monaco-editor/loader';
    import { onDestroy, onMount } from 'svelte';
    import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
    import Navbar from "@/components/Navbar.svelte";
    import { getCookie } from '@/cookies';
    import { PUBLIC_VITE_API_URL } from "$env/static/public";
    import * as Resizable from "@/components/ui/resizable";
    import { writable, type Writable } from 'svelte/store';
    import {
        AlertDialog,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogAction,
        AlertDialogCancel
    } from "@/components/ui/alert-dialog";
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { CheckCircle2, AlertCircle } from 'lucide-svelte';

    interface Problem {
        id: string;
        description: string;
        exampleInput: string;
        exampleOutput: string;
        hasSubmission: boolean;
        solutionCode: string;
        userProblemId: number;
    }

    interface Evaluation {
        evaluation: string;
        message: string;
    }

    let editor: Monaco.editor.IStandaloneCodeEditor;
    let monaco: typeof Monaco;
    let editorContainer: HTMLElement;
    let output: string = '';
    let problemID: string = '';

    const currentProblem: Writable<Problem | null> = writable(null);
    const problems: Writable<Problem[]> = writable([]);
    const evaluation: Writable<Evaluation> = writable({ evaluation: '', message: '' });
    const isLoading: Writable<boolean> = writable(false);
    const error: Writable<string | null> = writable(null);
    const showConfirmDialog: Writable<boolean> = writable(false);

    async function fetchUserProblems() {
        const sessionId = getCookie('sessionID');
        if (!sessionId) {
            error.set('Session ID not found');
            return;
        }

        isLoading.set(true);
        error.set(null);

        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/user/problems`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            problems.set(data.problems || []);
        } catch (err) {
            error.set(err instanceof Error ? err.message : 'Failed to fetch problems');
            problems.set([]);
        } finally {
            isLoading.set(false);
        }
    }

    async function submitSolution() {
        const sessionId = getCookie('sessionID');
        if (!sessionId) {
            error.set('Session ID not found');
            return;
        }

        isLoading.set(true);
        error.set(null);

        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/solution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                body: JSON.stringify({
                    problemId: problemID,
                    solutionCode: "mock mock mock" // Using mock string as requested
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            evaluation.set({
                evaluation: data.evaluation?.evaluation || '',
                message: data.message || ''
            });

            await fetchUserProblems();
        } catch (err) {
            error.set(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            isLoading.set(false);
            showConfirmDialog.set(false);
        }
    }

    function runCodeInEditor() {
        const code = editor.getValue();
        output = '';

        const originalConsoleLog = console.log;
        console.log = (...args) => {
            output += args.join(' ') + '\n';
            originalConsoleLog(...args);
        };

        try {
            eval(code);
        } catch (e) {
            output += `Error: ${e instanceof Error ? e.message : 'Unknown error occurred'}`;
        }
        console.log = originalConsoleLog; // Restore original console.log
    }

    onMount(async () => {
        const monacoEditor = await import('monaco-editor');
        loader.config({ monaco: monacoEditor.default });
        monaco = await loader.init();

        editor = monaco.editor.create(editorContainer, {
            value: `const firstName = "Smart";
                    const lastName = "Seminarian";

            const fullName = firstName + " " + lastName;
            console.log("Hello, " + fullName); // Output: "Hello, Smart Seminarian"`,
            language: 'javascript',
            theme: 'vs-dark'
        });

        await fetchUserProblems();
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach(model => model.dispose());
        editor?.dispose();
    });


    function selectProblem(problem: Problem) {
        currentProblem.set(problem);
        problemID = problem.id;
        if (editor) {
            editor.setValue(problem.solutionCode || '// Write your solution here');
        }
    }
</script>

<div class="h-screen flex flex-col">
    <Navbar />

    <div class="flex-1 flex overflow-hidden">
        <Resizable.PaneGroup direction="horizontal" class="w-full">
            <Resizable.Pane defaultSize={25} class="bg-gray-100 overflow-hidden flex flex-col">
                <div class="h-full flex flex-col overflow-auto">
                    <div class="p-4 border-b bg-gray-100">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-bold">Problems</h2>
                            <button
                                    on:click={fetchUserProblems}
                                    class="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    disabled={$isLoading}
                            >
                                {$isLoading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>

                        {#if $error}
                            <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {$error}
                            </div>
                        {/if}
                    </div>

                    <div class="flex-1  p-4">
                        {#if $isLoading && !$problems.length}
                            <div class="flex items-center justify-center p-4">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        {:else if !$problems.length}
                            <div class="text-center p-4 text-gray-500">
                                No problems available
                            </div>
                        {:else}
                            <div class="space-y-2">
                                {#each $problems as problem (problem.id)}
                                    <button
                                            on:click={() => selectProblem(problem)}
                                            class="w-full p-3 text-left bg-white rounded-lg shadow hover:bg-gray-50 transition-colors
                                        {$currentProblem?.id === problem.id ? 'ring-2 ring-blue-500' : ''}"
                                    >
                                        <div class="flex items-center justify-between">
                                            <h3 class="font-medium truncate">Problem {problem.id}</h3>
                                            {#if problem.hasSubmission}
                                                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                                    Submitted
                                                </span>
                                            {/if}
                                        </div>
                                        <p class="text-sm text-gray-600 truncate">{problem.description}</p>
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </Resizable.Pane>

            <Resizable.Handle/>

            <Resizable.Pane defaultSize={75} class="bg-white overflow-hidden flex flex-col">
                <div class="h-full flex flex-col overflow-auto">
                    {#if $currentProblem}
                        <div class="p-6 border-b ">
                            <h2 class="text-2xl font-bold mb-4">{$currentProblem.description}</h2>
                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-medium">Example Input:</h3>
                                    <pre class="bg-gray-50 p-3 rounded">{$currentProblem.exampleInput}</pre>
                                </div>
                                <div>
                                    <h3 class="font-medium">Expected Output:</h3>
                                    <pre class="bg-gray-50 p-3 rounded">{$currentProblem.exampleOutput}</pre>
                                </div>
                            </div>
                        </div>

                        <div class="flex-1 flex flex-col min-h-0 p-6 ">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-medium">Code Editor</h3>
                                <div class="space-x-2">
                                    <button
                                            on:click={runCodeInEditor}
                                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                            disabled={$isLoading}
                                    >
                                        Run Code
                                    </button>
                                    <button
                                            on:click={() => showConfirmDialog.set(true)}
                                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            disabled={$isLoading}
                                    >
                                        {$isLoading ? 'Submitting...' : 'Submit Solution'}
                                    </button>
                                </div>
                            </div>

                            <div class="min-h-[300px] flex-1 border rounded" bind:this={editorContainer}></div>

                            {#if output || $evaluation.evaluation}
                                <div class="mt-4">
                                    {#if output}
                                        <div class="mb-4">
                                            <h3 class="font-medium mb-2">Output</h3>
                                            <pre class="bg-gray-50 p-3 rounded whitespace-pre-wrap">{output}</pre>
                                        </div>
                                    {/if}

                                    {#if $evaluation.evaluation}
                                        <div class="space-y-4">
                                            <Alert variant={$evaluation.evaluation.includes("error") ? "destructive" : "default"}>
                                                <div class="flex items-start gap-4">
                                                    {#if $evaluation.evaluation.includes("error")}
                                                        <AlertCircle class="h-5 w-5" />
                                                    {:else}
                                                        <CheckCircle2 class="h-5 w-5" />
                                                    {/if}
                                                    <div>
                                                        <AlertTitle>Evaluation Result</AlertTitle>
                                                        <AlertDescription>{$evaluation.message}</AlertDescription>
                                                    </div>
                                                </div>
                                            </Alert>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Detailed Feedback</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <pre class="bg-gray-50 p-4 rounded-lg  whitespace-pre-wrap">
                                                        {$evaluation.evaluation}
                                                    </pre>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {:else}
                        <div class="flex items-center justify-center h-full text-gray-500">
                            Select a problem to begin
                        </div>
                    {/if}
                </div>
            </Resizable.Pane>
        </Resizable.PaneGroup>
    </div>
</div>

<AlertDialog bind:open={$showConfirmDialog}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Submit Solution</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to submit your solution? This action cannot be undone.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel on:click={() => showConfirmDialog.set(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction on:click={submitSolution}>Submit</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

<style>
    :global(.pane-group) {
        height: calc(100vh - 64px);
    }
</style>