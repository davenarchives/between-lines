<!--
  LetterForm Component
  
  Simplified form for creating letters with theme selection.
  Uses Svelte 5 runes for state management.
-->

<script>
  import {
    createLetter,
    generateShareableUrl,
  } from "$lib/utils/letterService.js";
  import "$lib/styles/letter-form.css";

  // Props for theme selection (bound to parent)
  let {
    envelopeTheme = $bindable("envelope-red"),
    letterTheme = $bindable("letter-sticky"),
  } = $props();

  // Form state using Svelte 5 $state rune
  let recipientName = $state("");
  let body = $state("");
  let selectedMusic = $state("");
  let shareableLink = $state("");
  let isSubmitted = $state(false);
  let isLoading = $state(false);
  /** @type {string | null} */
  let errorMessage = $state(null);

  /**
   * Handle form submission
   * Creates the letter and generates a shareable link
   */
  async function handleSubmit(/** @type {SubmitEvent} */ event) {
    event.preventDefault();

    // Basic validation
    if (!body.trim()) {
      errorMessage = "Please write a message";
      return;
    }

    errorMessage = null;
    isLoading = true;

    try {
      // Create the letter
      const letterId = await createLetter(
        {
          title: "Letter", // Default title
          body: body.trim(),
          recipientName: recipientName.trim() || null,
          envelopeTheme: envelopeTheme,
          letterTheme: letterTheme,
          musicUrl: selectedMusic || null,
        },
        null,
      ); // No audio file

      // Generate shareable link
      const link = generateShareableUrl(letterId);
      shareableLink = link;
      isSubmitted = true;
    } catch (error) {
      console.error("Error creating letter:", error);
      errorMessage = "Failed to create letter. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  /**
   * Copy link to clipboard
   */
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  /**
   * Reset form
   */
  function resetForm() {
    recipientName = "";
    body = "";
    selectedMusic = "";
    shareableLink = "";
    isSubmitted = false;
    errorMessage = null;
  }
</script>

{#if isSubmitted}
  <!--Success State -->
  <div class="form-card success-card">
    <div class="success-content">
      <i class="fa-solid fa-circle-check success-icon"></i>
      <h2 class="success-title">Letter Created!</h2>
      <p class="success-text">Share this link with your recipient:</p>

      <div class="link-container">
        <input type="text" readonly value={shareableLink} class="link-input" />
        <button
          type="button"
          onclick={copyToClipboard}
          class="copy-button"
          aria-label="Copy link to clipboard"
        >
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>

      <button type="button" onclick={resetForm} class="new-letter-button">
        Create Another Letter
      </button>
    </div>
  </div>
{:else}
  <!-- Letter Form -->
  <form class="form-card" onsubmit={handleSubmit}>
    <div class="form-content">
      <!-- Recipient Field -->
      <div class="form-group">
        <input
          type="text"
          bind:value={recipientName}
          placeholder="Recipient"
          class="form-input recipient-input"
        />
      </div>

      <!-- Message Field -->
      <div class="form-group">
        <textarea
          bind:value={body}
          placeholder="Message"
          rows="6"
          class="form-input message-input"
          required
        ></textarea>
      </div>

      <!-- Music Selection -->
      <div class="form-group">
        <div class="music-selector">
          <i class="fa-brands fa-spotify spotify-icon"></i>
          <select bind:value={selectedMusic} class="music-select">
            <option value="">Select a music</option>
            <option value="lofi-1">Lo-Fi Beats #1</option>
            <option value="lofi-2">Chill Vibes</option>
            <option value="lofi-3">Study Session</option>
            <option value="acoustic-1">Acoustic Dreams</option>
            <option value="piano-1">Piano Ballad</option>
          </select>
          <i class="fa-solid fa-chevron-down dropdown-icon"></i>
        </div>
      </div>

      <!-- Error Message -->
      {#if errorMessage}
        <div class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          {errorMessage}
        </div>
      {/if}

      <!-- Submit Button -->
      <button type="submit" class="submit-button" disabled={isLoading}>
        {isLoading ? "Creating..." : "Send Letter"}
        {#if !isLoading}
          <i class="fa-solid fa-paper-plane"></i>
        {/if}
      </button>
    </div>
  </form>
{/if}
