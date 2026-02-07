<!--
  LetterHistory Component
  
  Full-screen overlay displaying the user's letter history.
  Links are stored locally and auto-deleted after 7 days.
  Matches the exact design from the reference UI.
-->

<script lang="ts">
    import { fade } from "svelte/transition";
    import {
        getLetterHistory,
        deleteLetterFromHistory,
    } from "$lib/utils/letterStorage";

    // Props
    let { isVisible = true, onCreateNew } = $props();

    /** Letter type definition */
    type Letter = {
        id: string;
        link: string;
        recipientName: string;
        createdAt: number;
        expiresAt: number;
    };

    let history = $state<Letter[]>([]);

    // Load history on mount and set up reactivity
    $effect(() => {
        history = getLetterHistory();
    });

    /**
     * Copy link to clipboard
     * @param {string} link - The link to copy
     */
    async function copyLink(link: string) {
        try {
            await navigator.clipboard.writeText(link);
            // Simple feedback - could enhance with toast notification
            alert("Link copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    }

    /**
     * Refresh history (useful after creating a new letter)
     */
    export function refresh() {
        history = getLetterHistory();
    }
</script>

{#if isVisible}
    <div class="overlay" transition:fade={{ duration: 300 }}>
        <!-- Logo -->
        <div class="logo-container">
            <a href="/" aria-label="Go to home">
                <img src="/images/logo.png" alt="Between Lines" class="logo" />
            </a>
        </div>

        <!-- Content Container -->
        <div class="content-container">
            <!-- Title -->
            <h1 class="title">History</h1>

            <!-- Description -->
            <p class="description">
                These are links to your previously submitted messages. They're
                stored locally and will be automatically deleted after 7 days.
            </p>

            <!-- Dashed Container with Corner Markers -->
            <div class="history-box">
                <!-- Corner Markers -->
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>

                <!-- Scrollable Links Container -->
                <div class="links-container">
                    {#if history.length > 0}
                        {#each history as letter (letter.id)}
                            <div class="link-item">
                                <a
                                    href={letter.link}
                                    class="link-text"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {letter.link}
                                </a>
                                <button
                                    type="button"
                                    class="copy-btn"
                                    onclick={() => copyLink(letter.link)}
                                    aria-label="Copy link"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path
                                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"
                                        />
                                    </svg>
                                </button>
                            </div>
                        {/each}
                    {:else}
                        <p class="no-history">No history yet</p>
                    {/if}
                </div>
            </div>

            <!-- Create New Letter Button -->
            <button
                type="button"
                class="create-btn"
                onclick={() => onCreateNew?.()}
            >
                Create new letter
            </button>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(
            135deg,
            #3986d0 0%,
            #4c9aae 50%,
            #659883 100%
        );
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        z-index: 1000;
        overflow: hidden;
        padding: 2rem 1rem;
    }

    .logo-container {
        margin-bottom: 3rem;
        margin-top: 1rem;
    }

    .logo {
        max-width: 300px;
        height: auto;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    }

    .content-container {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-family: "Carter One", cursive;
        font-size: 3rem;
        color: white;
        margin: 0 0 1rem 0;
        font-weight: 400;
        text-align: left;
        align-self: flex-start;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .description {
        font-family: "Caveat", cursive;
        font-size: 1.3rem;
        color: white;
        margin: 0 0 1.5rem 0;
        text-align: left;
        align-self: flex-start;
        max-width: 850px;
        line-height: 1.6;
        font-style: italic;
        padding: 0;
    }

    /* Dashed Container Box */
    .history-box {
        position: relative;
        background: rgba(139, 213, 202, 0.85);
        border-radius: 12px;
        border: 3px dashed rgba(255, 255, 255, 0.6);
        width: 100%;
        max-width: 100%;
        height: 280px;
        backdrop-filter: blur(5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    /* Corner Markers (Plus Signs) */
    .corner {
        position: absolute;
        color: rgba(255, 255, 255, 0.9);
        font-size: 32px;
        font-weight: 300;
        line-height: 1;
        pointer-events: none;
        z-index: 2;
    }

    .corner::before {
        content: "+";
    }

    .corner-tl {
        top: -16px;
        left: -16px;
    }

    .corner-tr {
        top: -16px;
        right: -16px;
    }

    .corner-bl {
        bottom: -16px;
        left: -16px;
    }

    .corner-br {
        bottom: -16px;
        right: -16px;
    }

    /* Scrollable Links Container */
    .links-container {
        width: 100%;
        height: 100%;
        padding: 2rem 1.75rem;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Custom Scrollbar */
    .links-container::-webkit-scrollbar {
        width: 8px;
    }

    .links-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .links-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }

    .links-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }

    .link-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.6rem 1rem;
        border-radius: 8px;
        transition: background 0.2s ease;
    }

    .link-item:hover {
        background: rgba(255, 255, 255, 0.25);
    }

    .link-text {
        flex: 1;
        color: #2c3e50;
        font-size: 0.95rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: underline;
        cursor: pointer;
    }

    .link-text:hover {
        color: #1a252f;
        text-decoration: underline;
    }

    .copy-btn {
        background: rgba(255, 255, 255, 0.25);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        padding: 0.5rem;
        color: #2c3e50;
        transition: all 0.2s ease;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .copy-btn:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-1px);
    }

    .copy-btn:active {
        transform: translateY(0);
    }

    .copy-btn svg {
        width: 20px;
        height: 20px;
    }

    .no-history {
        text-align: center;
        color: rgba(31, 41, 55, 0.6);
        font-size: 1.1rem;
        font-style: italic;
    }

    .create-btn {
        margin-top: 1.5rem;
        padding: 0.85rem 2.5rem;
        background: #4a9eff;
        color: white;
        border: none;
        border-radius: 50px;
        font-size: 1.2rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(74, 158, 255, 0.4);
    }

    .create-btn:hover {
        background: #3b8ee6;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(74, 158, 255, 0.5);
    }

    .create-btn:active {
        transform: translateY(0);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .logo {
            max-width: 200px;
        }

        .title {
            font-size: 2.5rem;
        }

        .description {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }

        .history-box {
            height: 300px;
        }

        .corner {
            font-size: 28px;
        }

        .corner-tl,
        .corner-tr {
            top: -14px;
        }

        .corner-bl,
        .corner-br {
            bottom: -14px;
        }

        .corner-tl,
        .corner-bl {
            left: -14px;
        }

        .corner-tr,
        .corner-br {
            right: -14px;
        }

        .links-container {
            padding: 2rem 1.5rem;
        }

        .link-text {
            font-size: 1rem;
        }

        .copy-btn svg {
            width: 24px;
            height: 24px;
        }

        .create-btn {
            padding: 0.9rem 2.5rem;
            font-size: 1.2rem;
        }
    }

    @media (max-width: 480px) {
        .overlay {
            padding: 1.5rem 0.75rem;
        }

        .logo-container {
            margin-bottom: 2rem;
        }

        .logo {
            max-width: 160px;
        }

        .title {
            font-size: 2rem;
            margin-bottom: 0.75rem;
        }

        .description {
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .history-box {
            height: 280px;
            border-width: 2px;
        }

        .corner {
            font-size: 24px;
        }

        .corner-tl,
        .corner-tr {
            top: -12px;
        }

        .corner-bl,
        .corner-br {
            bottom: -12px;
        }

        .corner-tl,
        .corner-bl {
            left: -12px;
        }

        .corner-tr,
        .corner-br {
            right: -12px;
        }

        .links-container {
            padding: 1.75rem 1.25rem;
        }

        .link-text {
            font-size: 0.9rem;
        }

        .copy-btn svg {
            width: 22px;
            height: 22px;
        }

        .create-btn {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            margin-top: 2rem;
        }
    }
</style>
