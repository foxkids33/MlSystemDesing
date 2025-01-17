<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { getCookie } from "@/cookies";
    import * as Command from "$lib/components/ui/command";
    import * as Popover from "$lib/components/ui/popover";
    import { Button } from "$lib/components/ui/button";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Separator } from "$lib/components/ui/separator";
    import { formatDistance } from "date-fns";
    import Navbar from "@/components/Navbar.svelte";
    import { PUBLIC_VITE_API_URL } from "$env/static/public";

    interface Message {
        content: {
            assistant: string;
            user: string;
            context_id: string | null;
            context_type: string | null;
        };
        id: number;
        timestamp: string;
    }

    interface Concept {
        id: string;
        name: string;
        description: string;
        difficulty: number;
    }

    interface SessionGroup {
        sessionId: string;
        messages: Message[];
        lastTimestamp: string;
    }

    export let messages = writable<Message[]>([]);
    export let concepts: Concept[] = [];
    export let loading = writable(false);

    let sessionGroups: SessionGroup[] = [];
    let currentSessionId = getCookie('sessionID');
    let activeSessionId = writable<string>(currentSessionId);
    let inputMessage = '';
    let messageContainer: HTMLElement;
    let contextType: 'concept' | 'problem' | null = null;
    let contextPopoverOpen = false;
    let selectedContext: Concept | null = null;
    let contextMessages = new Map<string, Message[]>();

    $: contextLabel = selectedContext
        ? `${contextType?.charAt(0).toUpperCase()}${contextType?.slice(1)}: ${selectedContext.name}`
        : "Select Context";

    function getContextKey(type: string | null, id: string | null): string {
        return type && id ? `${type}-${id}` : 'general';
    }

    onMount(async () => {
        await Promise.all([
            fetchDialogues(),
            fetchConcepts()
        ]);
        contextMessages.set('general', $messages);
    });

    async function fetchConcepts() {
        const sessionId = getCookie('sessionID');
        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/concept`, {
                headers: { 'X-Session-ID': sessionId }
            });
            if (response.ok) {
                concepts = await response.json();
            }
        } catch (error) {
            console.error('Error fetching concepts:', error);
        }
    }

    async function fetchDialogues() {
        const sessionId = getCookie('sessionID');
        if (!sessionId) {
            console.error('Session ID not found');
            return;
        }
        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/dialogues`, {
                headers: {
                    'accept': 'application/json',
                    'X-Session-ID': sessionId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dialogues');
            }

            const dialogues = await response.json() as Message[];

            const groups = new Map<string, Message[]>();
            dialogues.forEach(message => {
                const sessionId = message.session_id || 'default';
                if (!groups.has(sessionId)) {
                    groups.set(sessionId, []);
                }
                groups.get(sessionId)?.push(message);
            });

            sessionGroups = Array.from(groups.entries())
                .map(([sessionId, msgs]) => ({
                    sessionId,
                    messages: msgs.sort((a, b) =>
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ),
                    lastTimestamp: msgs[0].timestamp
                }))
                .sort((a, b) =>
                    new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
                );

            if (currentSessionId) {
                const currentSession = sessionGroups.find(g => g.sessionId === currentSessionId);
                if (currentSession) {
                    messages.set(currentSession.messages);
                }
            }
        } catch (error) {
            console.error('Error fetching dialogues:', error);
        }
    }

    function switchSession(sessionId: string) {
        activeSessionId.set(sessionId);
        const session = sessionGroups.find(g => g.sessionId === sessionId);
        if (session) {
            messages.set(session.messages);
        }
    }

    $: if ($messages && messageContainer) {
        setTimeout(() => {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 0);
    }

    function formatMessageTime(timestamp: string): string {
        return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    }

    async function handleContextSelect(type: 'concept' | 'problem', item: Concept) {
        const newContextKey = getContextKey(type, item.id);

        if (!contextMessages.has(newContextKey)) {
            const initialMessage = {
                content: {
                    assistant: `Let's discuss the concept: ${item.name}${item.description ? `\n\n${item.description}` : ''}\n\nWhat would you like to know about this concept?`,
                    user: '',
                    context_id: item.id,
                    context_type: type
                },
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            contextMessages.set(newContextKey, [initialMessage]);
        }

        contextType = type;
        selectedContext = item;
        contextPopoverOpen = false;
        messages.set(contextMessages.get(newContextKey) || []);
    }

    function clearContext() {
        if (contextType && selectedContext) {
            const currentContextKey = getContextKey(contextType, selectedContext.id);
            contextMessages.set(currentContextKey, $messages);
        }

        contextType = null;
        selectedContext = null;
        messages.set(contextMessages.get('general') || []);
    }

    async function handleSendMessage() {
        if (!inputMessage.trim()) return;

        const sessionId = getCookie('sessionID');
        if (!sessionId) return;

        const contextKey = getContextKey(contextType, selectedContext?.id);

        const newMessage = {
            content: {
                assistant: '',
                user: inputMessage,
                context_id: selectedContext?.id || null,
                context_type: contextType
            },
            id: Date.now(),
            timestamp: new Date().toISOString()
        };

        messages.update(msgs => [...msgs, newMessage]);
        contextMessages.set(contextKey, [...(contextMessages.get(contextKey) || []), newMessage]);

        inputMessage = '';
        loading.set(true);

        try {
            const response = await fetch(`${PUBLIC_VITE_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId,
                },
                body: JSON.stringify({
                    message: newMessage.content.user,
                    context: selectedContext ? {
                        type: contextType,
                        id: selectedContext.id
                    } : {}
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            messages.update(msgs => {
                const lastMsg = msgs[msgs.length - 1];
                lastMsg.content.assistant = data.assistant_response;
                return msgs;
            });

            const updatedMessages = contextMessages.get(contextKey) || [];
            updatedMessages[updatedMessages.length - 1].content.assistant = data.assistant_response;
            contextMessages.set(contextKey, updatedMessages);

            await fetchDialogues();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            loading.set(false);
        }
    }
</script>

<div class="flex flex-col h-screen bg-background">
    <Navbar />

    <main class="flex-1 flex overflow-hidden">
        <div class="w-64 border-r flex-shrink-0">
            <div class="h-full flex flex-col">
                <div class="p-4">
                    <h2 class="text-lg font-semibold">Chat History</h2>
                </div>
                <ScrollArea class="flex-1">
                    <div class="px-2 space-y-2">
                        {#each sessionGroups as group}
                            <button
                                class="w-full p-3 text-left hover:bg-muted rounded-lg transition-colors
                                {$activeSessionId === group.sessionId ? 'bg-muted' : ''}"
                                on:click={() => switchSession(group.sessionId)}
                            >
                                <div class="font-medium truncate">Session {group.sessionId}</div>
                                <div class="text-sm text-muted-foreground">
                                    {formatMessageTime(group.lastTimestamp)}
                                </div>
                            </button>
                            <Separator class="my-2" />
                        {/each}
                    </div>
                </ScrollArea>
            </div>
        </div>

        <div class="flex-1 flex flex-col min-w-0">
            <ScrollArea class="flex-1" bind:this={messageContainer}>
                <div class="p-4 space-y-4">
                    {#each $messages as message}
                        {#if message.content.user}
                            <div class="flex flex-col items-end gap-1">
                                <div class="max-w-[80%] bg-primary text-primary-foreground rounded-xl rounded-tr-sm p-3">
                                    {message.content.user}
                                </div>
                                <span class="text-xs text-muted-foreground">
                                    {formatMessageTime(message.timestamp)}
                                </span>
                            </div>
                        {/if}

                        {#if message.content.assistant}
                            <div class="flex flex-col items-start gap-1">
                                <div class="max-w-[80%] bg-muted rounded-xl rounded-tl-sm p-3">
                                    {message.content.assistant}
                                </div>
                                <span class="text-xs text-muted-foreground">
                                    {formatMessageTime(message.timestamp)}
                                </span>
                            </div>
                        {/if}
                    {/each}

                    {#if $loading}
                        <div class="flex items-center space-x-2 p-3 bg-muted w-fit rounded-xl">
                            {#each Array(3) as _, i}
                                <div
                                    class="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                                    style="animation-delay: {i * 0.2}s"
                                />
                            {/each}
                        </div>
                    {/if}
                </div>
            </ScrollArea>

            <div class="border-t p-4 bg-background">
                <div class="flex gap-2">
                    <Popover.Root bind:open={contextPopoverOpen}>
                        <Popover.Trigger asChild let:builder>
                            <Button
                                builders={[builder]}
                                variant="outline"
                                role="combobox"
                                aria-expanded={contextPopoverOpen}
                                class="w-[200px] justify-between truncate"
                            >
                                {contextLabel}
                                {#if selectedContext}
                                    <button
                                        class="ml-2 text-muted-foreground hover:text-foreground"
                                        on:click|stopPropagation={clearContext}
                                    >
                                        ×
                                    </button>
                                {/if}
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content class="w-[200px] p-0">
                            <Command.Root>
                                <Command.Input placeholder="Search..." class="h-9" />
                                <Command.Empty>No items found.</Command.Empty>
                                <Command.Group heading="Concepts">
                                    {#each concepts as concept}
                                        <Command.Item
                                            value={concept.name}
                                            onSelect={() => handleContextSelect('concept', concept)}
                                            class="truncate"
                                        >
                                            <span class="truncate">{concept.name}</span>
                                            <span class="ml-2 text-xs text-muted-foreground">
                                                Level {concept.difficulty}
                                            </span>
                                        </Command.Item>
                                    {/each}
                                </Command.Group>
                            </Command.Root>
                        </Popover.Content>
                    </Popover.Root>

                    <input
                        type="text"
                        class="flex-1 px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Type your message..."
                        bind:value={inputMessage}
                        on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    />

                    <Button
                        variant="default"
                        disabled={$loading}
                        on:click={handleSendMessage}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    </main>
</div>