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
  <article
    class="max-w-2xl mx-auto py-12 px-6 min-h-screen flex flex-col justify-center sm:py-16 sm:px-8"
    in:fly={{ y: 20, duration: 700, delay: 200 }}
  >
    <header class="mb-8">
      {#if recipientName}
        <p class="text-base text-gray-500 mb-3 italic">Dear {recipientName},</p>
      {/if}
      <h1
        class="text-3xl font-normal text-gray-800 leading-tight font-serif sm:text-4xl"
      >
        {title}
      </h1>
    </header>

    <div class="flex-1 mb-8">
      <p
        class="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap font-serif sm:text-xl"
      >
        {body}
      </p>
    </div>

    <footer class="pt-8 border-t border-gray-200">
      {#if createdAt}
        <time class="text-sm text-gray-400">{formatDate(createdAt)}</time>
      {/if}
    </footer>
  </article>
{/if}
