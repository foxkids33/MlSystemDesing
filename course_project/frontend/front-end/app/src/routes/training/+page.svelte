<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import { getCookie } from '$lib/cookies';
    import { goto } from "$app/navigation";
    import Navbar from "@/components/Navbar.svelte";
    import problemImage from "$lib/assets/png/new-problem.png";
    import trainImage from "$lib/assets/png/training.png";
    import {
        AlertDialog,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogAction,
        AlertDialogTrigger
    } from "$lib/components/ui/alert-dialog";
    import { PUBLIC_VITE_API_URL } from "$env/static/public";

    interface Problem {
        description: string;
        exampleInput: string;
        exampleOutput: string;
        id: string;
    }

    interface ProblemResponse {
        message: string;
        problem: Problem | null;
    }

    let problemDetails: Writable<ProblemResponse> = writable({
        message: "Fetching problem...",
        problem: {
            description: "...",
            exampleInput: "...",
            exampleOutput: "...",
            id: "placeholder",
        },
    });

    const generateNewProblem = async () => {
        console.log("Getting new problem");
        const sessionId = getCookie('sessionID');

        // Trigger alert immediately
        const trigger = document.querySelector(".alert-dialog-trigger") as HTMLElement;
        trigger?.click();

        if (!sessionId) {
            problemDetails.set({
                message: "Session ID not found. Please log in.",
                problem: null,
            });
            return;
        }

        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/problem`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-ID": sessionId,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ProblemResponse = await response.json();
            problemDetails.set(data);
        } catch (error) {
            console.error("Error fetching problem:", error);
            problemDetails.set({
                message: "Error fetching problem. Please try again later.",
                problem: null,
            });
        }
    };

    const trainAndViewSolutions = () => {
        goto("/problems");
    };
</script>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 50px;
        flex-wrap: wrap;
    }

    .button-container {
        text-align: center;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.2s, background-color 0.2s;
        padding: 15px;
        border-radius: 10px;
    }

    .button-container:hover {
        transform: scale(1.03);
        background-color: #f9f9f9;
    }

    .button-image {
        width: 140px;
        height: 140px;
        border-radius: 10px;
    }

    .button-text {
        margin-top: 15px;
        font-size: 1.2rem;
        font-weight: 600;
        color: #222;
    }

    .alert-dialog {
        font-family: Arial, sans-serif;
    }
</style>

<Navbar />
<div class="container">
    <div class="button-container" on:click={generateNewProblem}>
        <img src={problemImage} alt="Generate Problem" class="button-image" />
        <div class="button-text">Generate New Problem</div>
    </div>

    <div class="button-container" on:click={trainAndViewSolutions}>
        <img src={trainImage} alt="Train and View Solutions" class="button-image" />
        <div class="button-text">Train and View Solutions</div>
    </div>
</div>

<AlertDialog>
    <AlertDialogTrigger class="alert-dialog-trigger" style="display: none;"></AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>New Problem Generated</AlertDialogTitle>
            <AlertDialogDescription>
                <p>{$problemDetails.message}</p>
                {#if $problemDetails.problem}
                    <p><strong>Description:</strong> {$problemDetails.problem.description}</p>
                    <p><strong>Example Input:</strong> {$problemDetails.problem.exampleInput}</p>
                    <p><strong>Example Output:</strong> {$problemDetails.problem.exampleOutput}</p>
                {/if}
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

