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
  let refs = $state({ audio: /** @type {HTMLAudioElement | null} */ (null) });
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
    if (audioUrl && refs.audio) {
      refs.audio.play().catch((err) => {
        console.log("Audio autoplay blocked:", err);
      });
      isPlaying = true;
    }
  }

  /**
   * Toggle play/pause state
   */
  function togglePlayPause() {
    if (!refs.audio) return;

    if (isPlaying) {
      refs.audio.pause();
    } else {
      refs.audio.play();
    }
    isPlaying = !isPlaying;
  }
</script>

{#if audioUrl}
  <audio
    bind:this={refs.audio}
    src={audioUrl}
    onended={() => (isPlaying = false)}
    preload="auto"
  ></audio>

  {#if isVisible}
    <div
      class="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 py-3 px-5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-40"
      transition:fade={{ duration: 500 }}
    >
      <button
        class="w-10 h-10 flex items-center justify-center bg-gray-800 text-white border-none rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:scale-105"
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

      <span class="text-sm text-gray-500">
        {isPlaying ? "Now playing" : "Music paused"}
      </span>
    </div>
  {/if}
{/if}
