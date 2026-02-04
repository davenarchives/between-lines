<!--
  LetterForm Component
  
  A form for creating new letters with optional music attachment.
  Handles validation, submission, and displays the shareable link after success.
  
  Uses Svelte 5 runes for state management.
-->

<script>
  import {
    createLetter,
    generateShareableUrl,
  } from "$lib/utils/letterService.js";
  import "$lib/styles/letter-form.css";

  // Form state using Svelte 5 $state rune
  let title = $state("");
  let body = $state("");
  let recipientName = $state("");
  /** @type {File | null} */
  let audioFile = $state(null);
  let shareableLink = $state("");
  let isSubmitted = $state(false);
  let isLoading = $state(false);
  /** @type {string | null} */
  let errorMessage = $state(null);

  /**
   * Handle file input change
   * Validates that the file is an audio file
   */
  function handleFileChange(/** @type {Event} */ event) {
    const input = /** @type {HTMLInputElement} */ (event.target);
    const file = input.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("audio/")) {
        errorMessage = "Please select a valid audio file (MP3)";
        audioFile = null;
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errorMessage = "Audio file must be less than 10MB";
        audioFile = null;
        return;
      }

      audioFile = file;
      errorMessage = null;
    }
  }

  /**
   * Clear the selected audio file
   */
  function clearAudioFile() {
    audioFile = null;
  }

  /**
   * Handle form submission
   * Creates the letter and generates a shareable link
   */
  async function handleSubmit(/** @type {SubmitEvent} */ event) {
    event.preventDefault();

    // Basic validation
    if (!title.trim()) {
      errorMessage = "Please enter a title";
      return;
    }

    if (!body.trim()) {
      errorMessage = "Please write your letter";
      return;
    }

    try {
      isLoading = true;
      errorMessage = null;

      // Create the letter
      const letterId = await createLetter(
        {
          title: title.trim(),
          body: body.trim(),
          recipientName: recipientName.trim(),
        },
        audioFile,
      );

      // Generate the shareable link (Standard URL)
      shareableLink = generateShareableUrl(letterId);
      isSubmitted = true;
    } catch (error) {
      console.error("Error creating letter:", error);
      errorMessage = "Failed to create letter. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  /**
   * Copy the shareable link to clipboard
   */
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareableLink);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  /**
   * Reset form to create another letter
   */
  function createAnother() {
    title = "";
    body = "";
    recipientName = "";
    audioFile = null;
    shareableLink = "";
    isSubmitted = false;
    errorMessage = null;
  }
</script>

<div class="form-container">
  {#if !isSubmitted}
    <!-- Letter creation form -->
    <form onsubmit={handleSubmit} class="letter-form">
      <div class="form-header">
        <h2 class="form-title">Write Your Letter</h2>
        <p class="form-subtitle">Share your thoughts with someone special</p>
      </div>

      <!-- Title input -->
      <div class="form-group">
        <label for="title" class="label">Letter Title</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          placeholder="Give your letter a title"
          class="input"
          maxlength="100"
        />
      </div>

      <!-- Recipient name (optional) -->
      <div class="form-group">
        <label for="recipient" class="label">
          Recipient Name
          <span class="optional">(optional)</span>
        </label>
        <input
          type="text"
          id="recipient"
          bind:value={recipientName}
          placeholder="Who is this letter for?"
          class="input"
          maxlength="50"
        />
      </div>

      <!-- Letter body -->
      <div class="form-group">
        <label for="body" class="label">Your Letter</label>
        <textarea
          id="body"
          bind:value={body}
          placeholder="Write your heart out..."
          class="textarea"
          rows="10"
        ></textarea>
      </div>

      <!-- Music upload (optional) -->
      <div class="form-group">
        <label for="audio" class="label">
          Attach Music
          <span class="optional">(optional)</span>
        </label>

        {#if audioFile}
          <div class="file-selected">
            <span class="file-name">{audioFile.name}</span>
            <button type="button" onclick={clearAudioFile} class="clear-file">
              Remove
            </button>
          </div>
        {:else}
          <div class="file-upload">
            <input
              type="file"
              id="audio"
              accept="audio/*"
              onchange={handleFileChange}
              class="file-input"
            />
            <label for="audio" class="file-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span>Choose an MP3 file</span>
            </label>
          </div>
        {/if}
        <p class="hint">Add a song to play when they open your letter</p>
      </div>

      <!-- Error message -->
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}

      <!-- Submit button -->
      <button type="submit" class="submit-button" disabled={isLoading}>
        {#if isLoading}
          <span class="loading-spinner"></span>
          Creating...
        {:else}
          Create Letter
        {/if}
      </button>
    </form>
  {:else}
    <!-- Success state with shareable link -->
    <div class="success-container">
      <div class="success-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 class="success-title">Letter Created</h2>
      <p class="success-subtitle">Your letter is ready to be shared</p>

      <!-- Shareable link display -->
      <div class="share-box">
        <input type="text" value={shareableLink} readonly class="share-input" />
        <button onclick={copyLink} class="copy-button"> Copy Link </button>
      </div>

      <!-- Action buttons -->
      <div class="success-actions">
        <a href={shareableLink} target="_blank" class="preview-link">
          Preview Letter
        </a>
        <button onclick={createAnother} class="create-another">
          Write Another Letter
        </button>
      </div>
    </div>
  {/if}
</div>
