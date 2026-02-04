<!--
  LetterView Component
  
  Displays the letter content in a clean, readable format.
  Uses Svelte 5 syntax.
-->

<script>
  import { fly } from "svelte/transition";

  // Props using Svelte 5 $props
  let {
    title = "",
    body = "",
    recipientName = "",
    createdAt = null,
    isVisible = false,
  } = $props();

  /**
   * Format the date in a friendly way
   */
  function formatDate(date) {
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
  <article class="letter-view" in:fly={{ y: 20, duration: 700, delay: 200 }}>
    <header class="letter-header">
      {#if recipientName}
        <p class="recipient">Dear {recipientName},</p>
      {/if}
      <h1 class="title">{title}</h1>
    </header>

    <div class="letter-body">
      <p class="body-text">{body}</p>
    </div>

    <footer class="letter-footer">
      {#if createdAt}
        <time class="date">{formatDate(createdAt)}</time>
      {/if}
    </footer>
  </article>
{/if}

<style>
  .letter-view {
    max-width: 40rem;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .letter-header {
    margin-bottom: 2rem;
  }

  .recipient {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
    font-style: italic;
  }

  .title {
    font-size: 2rem;
    font-weight: 400;
    color: #1f2937;
    line-height: 1.3;
    font-family: "Georgia", serif;
  }

  .letter-body {
    flex: 1;
    margin-bottom: 2rem;
  }

  .body-text {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #374151;
    white-space: pre-wrap;
    font-family: "Georgia", serif;
  }

  .letter-footer {
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .date {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  @media (min-width: 640px) {
    .letter-view {
      padding: 4rem 2rem;
    }

    .title {
      font-size: 2.5rem;
    }

    .body-text {
      font-size: 1.25rem;
    }
  }
</style>
