<!--
  View Page
  
  The public view for reading a letter.
  Route: /#/l/:id
  
  Uses Svelte 5 runes for state management.
-->

<script>
  import { onMount } from "svelte";
  import OpenOverlay from "../components/OpenOverlay.svelte";
  import LetterView from "../components/LetterView.svelte";
  import MusicPlayer from "../components/MusicPlayer.svelte";
  import { getLetter } from "../lib/utils/letterService.js";

  // Props - letter ID from route params
  let { id } = $props();

  // State using Svelte 5 $state runes
  let currentLetter = $state(null);
  let isLoading = $state(true);
  let errorMessage = $state(null);
  let isOpened = $state(false);
  let musicPlayerRef = $state(null);

  onMount(async () => {
    await fetchLetter();
  });

  /**
   * Fetch the letter data
   */
  async function fetchLetter() {
    if (!id) {
      errorMessage = "Invalid letter link";
      isLoading = false;
      return;
    }

    try {
      isLoading = true;
      const letter = await getLetter(id);

      if (letter) {
        currentLetter = letter;
        document.title = `${letter.title} | Between Lines`;
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
    window.dispatchEvent(new CustomEvent("letter-opened"));
  }
</script>

<svelte:head>
  <title>{currentLetter?.title || "Loading..."} | Between Lines</title>
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
      <a href="/#/" class="error-link">Create a new letter</a>
    </div>
  {:else if currentLetter}
    <OpenOverlay
      letterTitle={currentLetter.title}
      recipientName={currentLetter.recipientName}
      isVisible={!isOpened}
      onopen={handleLetterOpen}
    />

    <LetterView
      title={currentLetter.title}
      body={currentLetter.body}
      recipientName={currentLetter.recipientName}
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
        <a href="/#/" class="cta-link">
          Write your own letter on Between Lines
        </a>
      </div>
    {/if}
  {/if}
</div>

<style>
  .view-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 50%, #f5f3ff 100%);
  }

  .loading-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e5e7eb;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .error-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .error-text {
    font-size: 1.125rem;
    color: #6b7280;
  }

  .error-link {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
  }

  .error-link:hover {
    text-decoration: underline;
  }

  .cta-section {
    padding: 3rem 1rem 6rem;
    text-align: center;
  }

  .cta-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    transition: all 0.2s;
  }

  .cta-link:hover {
    color: #374151;
    border-color: #d1d5db;
    background: white;
  }
</style>
