<!--
  OpenOverlay Component
  
  A full-screen overlay that displays the envelope before the letter is revealed.
  Uses the selected envelope theme image with gradient background.
  Uses Svelte 5 syntax.
-->

<script>
  import { fade } from "svelte/transition";

  // Props using Svelte 5 $props
  let {
    recipientName = "",
    envelopeTheme = "envelope-red",
    isVisible = true,
    onopen,
  } = $props();

  // Map envelope theme to image number
  const envelopeImages = {
    "envelope-red": "/images/envelope1.png",
    "envelope-pink": "/images/envelope2.png",
    "envelope-green": "/images/envelope3.png",
  };

  const envelopeImageSrc = $derived(
    // @ts-ignore - dynamic index access is safe here
    envelopeImages[envelopeTheme] || envelopeImages["envelope-red"],
  );
</script>

{#if isVisible}
  <div class="overlay" transition:fade={{ duration: 1000 }}>
    <!-- Logo -->
    <div class="logo-container">
      <img src="/images/logo.png" alt="Between Lines" class="logo" />
    </div>

    <div
      class="envelope-container"
      onclick={onopen}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && onopen()}
    >
      <!-- Envelope Image -->
      <img src={envelopeImageSrc} alt="Envelope" class="envelope-image" />

      <!-- Recipient Name on Letter Inside Envelope -->
      {#if recipientName}
        <div class="letter-peek">
          To {recipientName}
        </div>
      {/if}
    </div>

    <div class="click-hint">
      <button class="open-btn">Click to Open</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #3986d0 0%, #4c9aae 50%, #659883 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    gap: 2rem;
  }

  .logo-container {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo {
    max-width: 300px;
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  }

  .envelope-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-top: 4rem;
  }

  .envelope-image {
    max-width: 600px;
    width: 90vw;
    height: auto;
    filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;
  }

  .envelope-container:hover .envelope-image {
    transform: scale(1.03);
  }

  .letter-peek {
    position: absolute;
    top: 25%;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: "Caveat", cursive;
    font-size: 2.5rem;
    color: #4a5568;
    font-weight: 600;
    pointer-events: none;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  .click-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .open-btn {
    background: white;
    border: 2px solid #8b7355;
    color: #8b7355;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Caveat", cursive;
  }

  .open-btn:hover {
    background: #8b7355;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .envelope-image {
      max-width: 480px;
    }

    .logo {
      max-width: 200px;
    }

    .letter-peek {
      font-size: 1.5rem;
    }
  }
</style>
