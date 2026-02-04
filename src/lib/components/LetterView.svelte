<!--
  LetterView Component
  
  Displays the letter content overlaid on the full theme image with gradient background.
  Uses Caveat font and proper formatting.
  Uses Svelte 5 syntax.
-->

<script>
  import { fly } from "svelte/transition";

  // Props using Svelte 5 $props
  let {
    body = "",
    recipientName = "",
    letterTheme = "letter-sticky",
    createdAt = null,
    isVisible = false,
  } = $props();

  // Map letter theme to image
  const letterThemeImages = {
    "letter-sticky": "/images/theme1.png",
    "letter-lined": "/images/theme2.png",
    "letter-pastel": "/images/theme3.png",
  };

  const letterBackground = $derived(
    // @ts-ignore - dynamic index access is safe here
    letterThemeImages[letterTheme] || letterThemeImages["letter-sticky"],
  );

  /**
   * Format the date in a friendly way
   */
  function formatDate(/** @type {string | Date | null} */ date) {
    if (!date) return "";

    /** @type {Intl.DateTimeFormatOptions} */
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(date).toLocaleDateString("en-US", options);
  }
</script>

{#if isVisible}
  <!-- Full Theme Image Display with Gradient Background -->
  <article class="letter-display" in:fly={{ y: 50, duration: 800, delay: 300 }}>
    <!-- Theme Background Image -->
    <div class="theme-container">
      <img src={letterBackground} alt="Letter theme" class="theme-background" />

      <!-- Text Overlay -->
      <div class="text-overlay">
        {#if recipientName}
          <p class="recipient-text">To {recipientName},</p>
        {/if}

        <p class="body-text">
          {body}
        </p>

        {#if createdAt}
          <time class="date-text">{formatDate(createdAt)}</time>
        {/if}
      </div>
    </div>
  </article>
{/if}

<style>
  .letter-display {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
  }

  .theme-container {
    position: relative;
    max-width: 1100px;
    width: 95%;
  }

  .theme-background {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 15px 50px rgba(0, 0, 0, 0.35));
  }

  .text-overlay {
    position: absolute;
    top: 22%;
    left: 31%;
    right: 25%;
    padding: 1rem;
    max-width: 45%;
  }

  .recipient-text {
    font-family: "Caveat", cursive;
    font-size: 1.5rem;
    color: #2d3748;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .body-text {
    font-family: "Caveat", cursive;
    font-size: 1.3rem;
    line-height: 1.8;
    color: #1a202c;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
    font-weight: 500;
  }

  .date-text {
    display: block;
    font-family: "Caveat", cursive;
    font-size: 1.3rem;
    color: #4a5568;
    font-style: italic;
    text-align: right;
    margin-top: 2rem;
    font-weight: 500;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .theme-container {
      max-width: 900px;
    }

    .text-overlay {
      top: 16%;
      left: 20%;
      right: 16%;
      max-width: 60%;
    }

    .recipient-text {
      font-size: 1.6rem;
    }

    .body-text {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 768px) {
    .theme-container {
      max-width: 700px;
    }

    .text-overlay {
      top: 14%;
      left: 18%;
      right: 14%;
      max-width: 65%;
      padding: 0.5rem;
    }

    .recipient-text {
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }

    .body-text {
      font-size: 1.1rem;
      line-height: 1.7;
    }

    .date-text {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .text-overlay {
      top: 12%;
      left: 15%;
      right: 12%;
      max-width: 70%;
    }

    .recipient-text {
      font-size: 1.2rem;
    }

    .body-text {
      font-size: 1rem;
    }

    .date-text {
      font-size: 1rem;
    }
  }
</style>
