<!--
  Create Page
  Route: /create
-->
<script>
    import LetterForm from "$lib/components/LetterForm.svelte";

    // Theme state
    let selectedEnvelopeTheme = $state("envelope-red");
    let selectedLetterTheme = $state("letter-sticky");
    let isSubmitted = $state(false);
</script>

<div class="create-page">
    <!-- Centered Logo -->
    <header class="page-header">
        <a href="/" aria-label="Go to home">
            <img src="/images/logo.png" alt="Between Lines" class="page-logo" />
        </a>
    </header>

    <!-- Main 3-Column Layout -->
    <main class="create-main" class:submitted={isSubmitted}>
        <!-- Left Column: Envelope Themes -->
        {#if !isSubmitted}
            <aside class="theme-column envelope-column">
                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedEnvelopeTheme === "envelope-red"}
                    onclick={() => (selectedEnvelopeTheme = "envelope-red")}
                    aria-label="Select red envelope"
                >
                    <img
                        src="/images/envelope1.png"
                        alt="Red envelope"
                        class="theme-image"
                    />
                </button>

                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedEnvelopeTheme === "envelope-pink"}
                    onclick={() => (selectedEnvelopeTheme = "envelope-pink")}
                    aria-label="Select pink envelope"
                >
                    <img
                        src="/images/envelope2.png"
                        alt="Pink envelope"
                        class="theme-image"
                    />
                </button>

                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedEnvelopeTheme === "envelope-green"}
                    onclick={() => (selectedEnvelopeTheme = "envelope-green")}
                    aria-label="Select green envelope"
                >
                    <img
                        src="/images/envelope3.png"
                        alt="Green envelope"
                        class="theme-image"
                    />
                </button>
            </aside>
        {/if}

        <!-- Center Column: Form -->
        <section class="form-column">
            <LetterForm
                bind:envelopeTheme={selectedEnvelopeTheme}
                bind:letterTheme={selectedLetterTheme}
                bind:isSubmitted
            />
        </section>

        <!-- Right Column: Letter Themes -->
        {#if !isSubmitted}
            <aside class="theme-column letter-column">
                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedLetterTheme === "letter-sticky"}
                    onclick={() => (selectedLetterTheme = "letter-sticky")}
                    aria-label="Select sticky note theme"
                >
                    <img
                        src="/images/theme1.png"
                        alt="Sticky note"
                        class="theme-image"
                    />
                </button>

                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedLetterTheme === "letter-lined"}
                    onclick={() => (selectedLetterTheme = "letter-lined")}
                    aria-label="Select lined paper theme"
                >
                    <img
                        src="/images/theme2.png"
                        alt="Lined paper"
                        class="theme-image"
                    />
                </button>

                <button
                    type="button"
                    class="theme-preview-btn"
                    class:selected={selectedLetterTheme === "letter-pastel"}
                    onclick={() => (selectedLetterTheme = "letter-pastel")}
                    aria-label="Select pastel note theme"
                >
                    <img
                        src="/images/theme3.png"
                        alt="Pastel note"
                        class="theme-image"
                    />
                </button>
            </aside>
        {/if}
    </main>
</div>

<style>
    .create-page {
        height: 100vh;
        width: 100vw;
        max-width: 100%;
        background: linear-gradient(
            135deg,
            #3986d0 0%,
            #4c9aae 50%,
            #659883 100%
        );
        display: flex;
        flex-direction: column;
        padding: 2rem 1rem;
        overflow: hidden; /* Prevent scrolling */
        box-sizing: border-box;
    }

    .page-header {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 2rem;
    }

    .page-logo {
        max-width: 300px;
        width: 80%;
        height: auto;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
    }

    .create-main {
        flex: 1;
        display: grid;
        grid-template-columns: 100px 1fr 100px;
        gap: 1.5rem;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        align-items: start;
        box-sizing: border-box;
    }

    .create-main.submitted {
        grid-template-columns: 1fr;
        max-width: 800px; /* Constrain width for single column */
    }

    /* Theme Columns */
    .theme-column {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Theme Preview Buttons */
    .theme-preview-btn {
        background: rgba(164, 225, 225, 0.4); /* Teal tint */
        border: none;
        border-radius: 20px;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .theme-preview-btn:hover {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.4);
    }

    .theme-preview-btn.selected {
        border: 3px solid white;
        background: rgba(164, 225, 225, 0.6);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .theme-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .form-column {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .create-main {
            grid-template-columns: 120px 1fr 120px;
            gap: 1rem;
        }

        .page-logo {
            max-width: 250px;
        }
    }

    @media (max-width: 768px) {
        .create-main {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .theme-column {
            flex-direction: row;
            justify-content: center;
        }

        .theme-preview-btn {
            max-width: 100px;
        }

        .page-logo {
            max-width: 200px;
        }
    }
</style>
