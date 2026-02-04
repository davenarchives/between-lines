<!--
  MusicPlayer Component
  
  A minimal audio player that appears at the bottom of the letter view.
  Uses Svelte 5 syntax.
-->

<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  // Props using Svelte 5 $props
  let { audioUrl = "", isVisible = false } = $props();

  // State using Svelte 5 $state
  let audioElement;
  let isPlaying = $state(false);

  onMount(() => {
    window.addEventListener("letter-opened", handleLetterOpened);
  });

  onDestroy(() => {
    window.removeEventListener("letter-opened", handleLetterOpened);
  });

  /**
   * Called when the letter overlay is dismissed
   */
  function handleLetterOpened() {
    if (audioUrl && audioElement) {
      audioElement.play().catch((err) => {
        console.log("Audio autoplay blocked:", err);
      });
      isPlaying = true;
    }
  }

  /**
   * Toggle play/pause state
   */
  function togglePlayPause() {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isPlaying = !isPlaying;
  }
</script>

{#if audioUrl}
  <audio
    bind:this={audioElement}
    src={audioUrl}
    onended={() => (isPlaying = false)}
    preload="auto"
  />

  {#if isVisible}
    <div class="music-player" transition:fade={{ duration: 500 }}>
      <button
        class="play-button"
        onclick={togglePlayPause}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {#if isPlaying}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        {/if}
      </button>

      <span class="music-label">
        {isPlaying ? "Now playing" : "Music paused"}
      </span>
    </div>
  {/if}
{/if}

<style>
  .music-player {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 9999px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 40;
  }

  .play-button {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f2937;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-button:hover {
    background: #374151;
    transform: scale(1.05);
  }

  .music-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
</style>
