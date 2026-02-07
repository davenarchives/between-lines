<!--
  MusicPlayer Component
  
  A minimal audio player that appears at the bottom of the letter view.
  Uses Svelte 5 syntax.
-->

<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  // Props using Svelte 5 $props
  let { audioUrl = "", isVisible = false, isSticky = true } = $props();

  // State using Svelte 5 $state
  let refs = $state({ audio: /** @type {HTMLAudioElement | null} */ (null) });
  let isPlaying = $state(false);

  // Derived state to check for Spotify URL
  let isSpotify = $derived(
    audioUrl.includes("spotify.com") || audioUrl.includes("spotify:"),
  );

  let spotifyId = $derived.by(() => {
    if (!audioUrl) return "";
    const match = audioUrl.match(/(?:track\/|track:)([\w\d]+)/);
    return match ? match[1] : "";
  });

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
  {#if isSpotify}
    {#if isVisible}
      <div
        class="{isSticky
          ? 'fixed bottom-6 left-1/2 -translate-x-1/2'
          : 'relative mx-auto mt-4 mb-8'} z-[9999] shadow-xl rounded-2xl overflow-hidden spotify-player"
        transition:fade={{ duration: 500 }}
      >
        <iframe
          style="border-radius:12px"
          src="https://open.spotify.com/embed/track/{spotifyId}?utm_source=generator&theme=0"
          width="280"
          height="80"
          frameBorder="0"
          allowfullscreen={true}
          title="Spotify Music Player"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>

      <style>
        @media (max-width: 480px) {
          .spotify-player {
            width: calc(100vw - 2rem) !important;
            max-width: 280px;
          }

          .spotify-player iframe {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .spotify-player {
            bottom: 1rem !important;
          }
        }
      </style>
    {/if}
  {:else}
    <audio
      bind:this={refs.audio}
      src={audioUrl}
      onended={() => (isPlaying = false)}
      preload="auto"
    ></audio>

    {#if isVisible}
      <div
        class="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 py-3 px-5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-40 audio-controls"
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

        <span class="text-sm text-gray-500 music-status">
          {isPlaying ? "Now playing" : "Music paused"}
        </span>
      </div>

      <style>
        @media (max-width: 480px) {
          .audio-controls {
            bottom: 1.5rem !important;
            padding: 0.625rem 1rem;
            gap: 0.5rem;
          }

          .audio-controls button {
            width: 2.5rem;
            height: 2.5rem;
          }

          .music-status {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .audio-controls {
            bottom: 1rem !important;
            padding: 0.5rem 0.875rem;
          }

          .music-status {
            display: none;
          }
        }
      </style>
    {/if}
  {/if}
{/if}
