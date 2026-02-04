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

  // Form state using Svelte 5 $state rune
  let title = $state("");
  let body = $state("");
  let recipientName = $state("");
  let audioFile = $state(null);
  let shareableLink = $state("");
  let isSubmitted = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state(null);

  /**
   * Handle file input change
   * Validates that the file is an audio file
   */
  function handleFileChange(event) {
    const file = event.target.files[0];

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
  async function handleSubmit(event) {
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

<style>
  .form-container {
    max-width: 32rem;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .letter-form {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .form-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .form-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .form-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .optional {
    font-weight: 400;
    color: #9ca3af;
  }

  .input,
  .textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .input:focus,
  .textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .textarea {
    resize: vertical;
    min-height: 200px;
    line-height: 1.6;
  }

  .file-upload {
    position: relative;
  }

  .file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px dashed #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .file-label:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.05);
  }

  .file-selected {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
  }

  .file-name {
    font-size: 0.875rem;
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clear-file {
    font-size: 0.75rem;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
  }

  .hint {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.5rem;
  }

  .error-message {
    padding: 0.75rem 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #dc2626;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    background: #1f2937;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background: #374151;
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Success state styles */
  .success-container {
    text-align: center;
    padding: 3rem 1rem;
  }

  .success-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ecfdf5;
    color: #10b981;
    border-radius: 50%;
  }

  .success-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .success-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .share-box {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .share-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background: #f9fafb;
    color: #374151;
  }

  .copy-button {
    padding: 0.75rem 1.25rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .copy-button:hover {
    background: #4f46e5;
  }

  .success-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-link {
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    color: #374151;
    text-decoration: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .preview-link:hover {
    background: #e5e7eb;
  }

  .create-another {
    padding: 0.75rem 1rem;
    background: none;
    color: #6366f1;
    border: 1px solid #6366f1;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .create-another:hover {
    background: #6366f1;
    color: white;
  }
</style>
