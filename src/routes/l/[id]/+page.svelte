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
            letterTitle={currentLetter.title}
            recipientName={currentLetter.recipientName ?? ""}
            isVisible={!isOpened}
            onopen={handleLetterOpen}
        />

        <LetterView
            title={currentLetter.title}
            body={currentLetter.body}
            recipientName={currentLetter.recipientName ?? ""}
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
