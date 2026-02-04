<!--
  View Page
  Route: /l/[id]
-->
<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import OpenOverlay from "$lib/components/OpenOverlay.svelte";
    import LetterView from "$lib/components/LetterView.svelte";
    import MusicPlayer from "$lib/components/MusicPlayer.svelte";
    import { getLetter } from "$lib/utils/letterService.js";
    import "$lib/styles/view-page.css";

    // Get ID from route params
    let id = $derived($page.params.id);

    // State using Svelte 5 $state runes
    /**
     * @typedef {Object} Letter
     * @property {string} title
     * @property {string} body
     * @property {string|null} recipientName
     * @property {string} envelopeTheme
     * @property {string} letterTheme
     * @property {string|null} musicUrl
     * @property {Date} createdAt
     * @property {string|null} [audioUrl]
     */

    /** @type {Letter | null} */
    let currentLetter = $state(null);
    let isLoading = $state(true);
    /** @type {string | null} */
    let errorMessage = $state(null);
    let isOpened = $state(false);
    /** @type {import('$lib/components/MusicPlayer.svelte').default | null} */
    let musicPlayerRef = $state(null);

    // Re-fetch when ID changes
    $effect(() => {
        if (id) {
            fetchLetter(id);
        }
    });

    /**
     * Fetch the letter data
     */
    async function fetchLetter(/** @type {string} */ letterId) {
        if (!letterId) {
            errorMessage = "Invalid letter link";
            isLoading = false;
            return;
        }

        try {
            isLoading = true;
            const letter = await getLetter(letterId);

            if (letter) {
                currentLetter = letter;
                // Document title is handled by svelte:head, but we can update it if needed?
                // Actually svelte:head below handles it.
            } else {
                errorMessage = "Letter not found";
            }
        } catch (error) {
            console.error("Error fetching letter:", error);
            errorMessage = "Failed to load letter";
        } finally {
            isLoading = false;
        }
    }

    /**
     * Handle overlay open - starts music and shows letter
     */
    function handleLetterOpen() {
        isOpened = true;
        // window.dispatchEvent(new CustomEvent("letter-opened")); // Not strictly needed if logic is local?
        // Wait, MusicPlayer listens for this event.
        // In MusicPlayer.svelte: window.addEventListener("letter-opened", handleLetterOpened);
        // So we must dispatch it.
        window.dispatchEvent(new CustomEvent("letter-opened"));
    }
</script>

<svelte:head>
    <title>{currentLetter?.title || "Loading..."} | Between Lines</title>
    {#if currentLetter}
        <!-- Open Graph for Link Previews -->
        <meta property="og:title" content={currentLetter.title} />
        <meta
            property="og:description"
            content={`A letter for ${currentLetter.recipientName}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={$page.url.href} />
    {/if}
</svelte:head>

<div class="view-page">
    {#if isLoading}
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Opening your letter...</p>
        </div>
    {:else if errorMessage}
        <div class="error-container">
            <p class="error-text">{errorMessage}</p>
            <a href="/" class="error-link">Create a new letter</a>
        </div>
    {:else if currentLetter}
        <OpenOverlay
            recipientName={currentLetter.recipientName || ""}
            envelopeTheme={currentLetter.envelopeTheme || "envelope-red"}
            isVisible={!isOpened}
            onopen={handleLetterOpen}
        />

        <LetterView
            body={currentLetter.body}
            recipientName={currentLetter.recipientName || ""}
            letterTheme={currentLetter.letterTheme || "letter-sticky"}
            createdAt={currentLetter.createdAt}
            isVisible={isOpened}
        />

        {#if currentLetter.audioUrl}
            <MusicPlayer
                bind:this={musicPlayerRef}
                audioUrl={currentLetter.audioUrl}
                isVisible={isOpened}
            />
        {/if}

        {#if isOpened}
            <div class="cta-section">
                <a href="/" class="cta-link">
                    Write your own letter on Between Lines
                </a>
            </div>
        {/if}
    {/if}
</div>

<style>
    .page-container {
        min-height: 100vh;
        width: 100%;
        background: linear-gradient(
            135deg,
            #3986d0 0%,
            #4c9aae 50%,
            #659883 100%
        );
        position: relative;
    }

    .loading-container,
    .error-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        font-family: "Caveat", cursive;
    }

    .cta-section {
        text-align: center;
        padding: 3rem 1rem;
    }

    .cta-link {
        display: inline-block;
        padding: 1rem 2rem;
        background: white;
        color: #3986d0;
        text-decoration: none;
        border-radius: 50px;
        font-family: "Caveat", cursive;
        font-size: 1.3rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .cta-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
</style>
