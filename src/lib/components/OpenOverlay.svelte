<!--
  OpenOverlay Component
  
  A full-screen overlay that appears before the letter is revealed.
  Uses Svelte 5 syntax.
-->

<script>
  import { fade } from "svelte/transition";

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

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 50%, #f5f3ff 100%);
  }

  .overlay-content {
    text-align: center;
    padding: 2rem;
    max-width: 24rem;
  }

  .recipient {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .title {
    font-size: 1.875rem;
    font-weight: 300;
    color: #1f2937;
    margin-bottom: 2rem;
    line-height: 1.3;
    font-family: "Georgia", serif;
  }

  .open-button {
    padding: 1rem 2.5rem;
    background: #1f2937;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
  }

  .open-button:hover {
    background: #374151;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  }

  .hint {
    margin-top: 1.5rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }
</style>
