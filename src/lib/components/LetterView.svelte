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
    "letter-minimal": "/images/theme4.png",
  };

  const letterBackground = $derived(
    // @ts-ignore - dynamic index access is safe here
    letterThemeImages[letterTheme] || letterThemeImages["letter-sticky"],
  );

  // Pagination logic - responsive character limit
  // We use a "cost" system: each character is 1 cost, but newlines are expensive (e.g. 60 chars worth of space)
  let windowWidth = $state(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  // Update window width on resize
  $effect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        windowWidth = window.innerWidth;
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  });

  // Responsive character limit: 200 for mobile, 550 for desktop
  const MAX_COST = $derived(windowWidth <= 480 ? 200 : 550);
  const NEWLINE_COST = 60;
  let currentPage = $state(0);

  const pages = $derived.by(() => {
    if (!body) return [""];

    const chunks = [];
    let remaining = body;

    while (remaining.length > 0) {
      let currentCost = 0;
      let splitIndex = 0;

      // Calculate how many characters fit within MAX_COST
      for (let i = 0; i < remaining.length; i++) {
        const char = remaining[i];
        const cost = char === "\n" ? NEWLINE_COST : 1;

        if (currentCost + cost > MAX_COST) {
          break;
        }
        currentCost += cost;
        splitIndex++;
      }

      // If we reached the end of the string, take it all
      if (splitIndex === remaining.length) {
        chunks.push(remaining);
        break;
      }

      // If we are in the middle, try to split at a space or newline nicely
      // Look back from splitIndex for a space or newline to avoid cutting words
      let niceSplitIndex = -1;

      // Look for the last whitespace within the last 100 chars of the range to be safe
      const searchStart = Math.max(0, splitIndex - 100);
      const searchEnd = splitIndex;

      for (let i = searchEnd; i >= searchStart; i--) {
        if (remaining[i] === " " || remaining[i] === "\n") {
          niceSplitIndex = i;
          break;
        }
      }

      // If found a nice spot, split there
      if (niceSplitIndex !== -1) {
        splitIndex = niceSplitIndex;
      }

      // Ensure we make at least some progress to avoid infinite loops
      if (splitIndex === 0) splitIndex = 1;

      chunks.push(remaining.slice(0, splitIndex));
      // Trim start of next chunk to remove the split char if it was a space
      remaining = remaining.slice(splitIndex).trim();
    }
    return chunks;
  });

  const currentTextRaw = $derived(pages[currentPage] || "");

  const currentText = $derived.by(() => {
    let text = currentTextRaw;
    // Add "..." to start if not first page
    if (currentPage > 0) {
      text = "..." + text;
    }
    // Add "..." to end if not last page
    if (currentPage < pages.length - 1) {
      text = text + "...";
    }
    return text;
  });

  const paragraphs = $derived(currentText.split("\n"));

  function nextPage() {
    if (currentPage < pages.length - 1) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
    }
  }

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
      <div class="text-overlay {letterTheme}">
        {#if recipientName && currentPage === 0}
          <p class="recipient-text">To {recipientName},</p>
        {/if}

        {#each paragraphs as paragraph}
          <p class="body-text">
            {paragraph}
          </p>
        {/each}
      </div>

      <!-- Navigation Arrows -->
      {#if pages.length > 1}
        {#if currentPage > 0}
          <button
            class="nav-arrow prev"
            onclick={(e) => {
              e.stopPropagation();
              prevPage();
            }}
            aria-label="Previous page"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
        {/if}

        {#if currentPage < pages.length - 1}
          <button
            class="nav-arrow next"
            onclick={(e) => {
              e.stopPropagation();
              nextPage();
            }}
            aria-label="Next page"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        {/if}
      {/if}
    </div>
  </article>
{/if}

<style>
  .letter-display {
    width: 100%;
    /* min-height: 100vh; - Removed to allow natural flow with MusicPlayer below */
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 3rem 1rem 2rem 1rem;
  }

  .theme-container {
    position: relative;
    max-width: 1100px;
    width: 95%;
  }

  /* Navigation Arrows */
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 3rem;
    color: #2d3748;
    cursor: pointer;
    padding: 1rem;
    opacity: 0.7;
    transition: all 0.2s;
    z-index: 10;
  }

  .nav-arrow:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }

  .nav-arrow.prev {
    left: -60px;
  }

  .nav-arrow.next {
    right: -60px;
  }

  /* Responsive styling for arrows */
  @media (max-width: 1200px) {
    .nav-arrow {
      font-size: 2.5rem;
    }
    .nav-arrow.prev {
      left: -40px;
    }
    .nav-arrow.next {
      right: -40px;
    }
  }

  @media (max-width: 768px) {
    .nav-arrow {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .nav-arrow.prev {
      left: 10px;
    }
    .nav-arrow.next {
      right: 10px;
    }
  }

  .theme-background {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 15px 50px rgba(0, 0, 0, 0.35));
  }

  .text-overlay {
    position: absolute;
    top: 13%;
    left: 28%;
    right: 20%;
    max-width: 55%;
    padding: 1rem;
    padding-right: 2rem;
  }

  /* Keep other themes as default for now, or tune them if needed later */

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
    margin-bottom: 0.5rem; /* Reduced margin for split paragraphs */
    text-indent: 2rem; /* Indentation for paragraphs */
    min-height: 1.5rem; /* Ensure empty lines take up space */
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
      top: 12%;
      left: 25%;
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
      top: 10%;
      left: 20%;
      right: 14%;
      max-width: 70%;
      padding: 0.5rem;
    }

    .recipient-text {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .body-text {
      font-size: 0.95rem;
      line-height: 1.5;
      text-indent: 1.5rem;
      margin-bottom: 0.35rem;
    }

    .date-text {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .letter-display {
      padding: 2rem 0.5rem 1.5rem 0.5rem;
    }

    .theme-container {
      width: 98%;
    }

    .nav-arrow {
      font-size: 1.75rem;
      width: 40px;
      height: 40px;
    }

    .nav-arrow.prev {
      left: 5px;
    }

    .nav-arrow.next {
      right: 5px;
    }

    .text-overlay {
      top: 18%;
      left: 23%;
      right: 20%;
      width: 57%;
      max-width: none;
      padding: 0.5rem 1rem;
    }

    .recipient-text {
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .body-text {
      font-size: 0.75rem;
      line-height: 1.45;
      text-indent: 1.2rem;
      margin-bottom: 0.3rem;
    }

    .date-text {
      font-size: 0.8rem;
      margin-top: 1.2rem;
    }
  }
</style>
