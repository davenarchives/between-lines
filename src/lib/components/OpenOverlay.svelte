<!--
  OpenOverlay Component
  
  A full-screen overlay that appears before the letter is revealed.
  Uses Svelte 5 syntax.
-->

<script>
  import { fade } from "svelte/transition";
  import "$lib/styles/open-overlay.css";

  // Props using Svelte 5 $props
  let {
    letterTitle = "",
    recipientName = "",
    isVisible = true,
    onopen,
  } = $props();
</script>

{#if isVisible}
  <div class="overlay" transition:fade={{ duration: 500 }}>
    <div class="overlay-content">
      {#if recipientName}
        <p class="recipient">For {recipientName}</p>
      {/if}

      <h1 class="title">{letterTitle}</h1>

      <button class="open-button" onclick={onopen}> Open Letter </button>

      <p class="hint">Click to reveal and play music</p>
    </div>
  </div>
{/if}
