<script>
    import { fade, fly } from "svelte/transition";
    import LetterView from "./LetterView.svelte";
    import MusicPlayer from "./MusicPlayer.svelte";

    let {
        isOpen = $bindable(false),
        envelopeTheme = "envelope-red",
        letterTheme,
        recipientName,
        body,
        musicUrl,
    } = $props();

    let isLetterOpen = $state(false);

    // Envelope theme mapping
    const envelopeImages = {
        "envelope-red": "/images/envelope1.png",
        "envelope-pink": "/images/envelope2.png",
        "envelope-green": "/images/envelope3.png",
    };

    function close() {
        isOpen = false;
        isLetterOpen = false; // Reset for next time
    }

    function handleOpenLetter() {
        isLetterOpen = true;
        // Dispatch letter-opened event for music player
        window.dispatchEvent(new CustomEvent("letter-opened"));
    }

    /** @param {MouseEvent} e */
    function handleBackdropClick(e) {
        // Close if clicking the backdrop, not the content
        if (e.target === e.currentTarget) {
            close();
        }
    }
</script>

<!-- Preview Overlay with backdrop click -->
<div
    class="preview-backdrop"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Escape" && close()}
    role="dialog"
    aria-label="Letter preview"
    tabindex="-1"
>
    <div class="preview-overlay">
        {#if !isLetterOpen}
            <div class="preview-content">
                <!-- Simple Envelope Display -->
                <div
                    class="envelope-preview"
                    onclick={handleOpenLetter}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === "Enter" && handleOpenLetter()}
                >
                    <!-- Envelope Image -->
                    <img
                        src={envelopeImages[
                            /** @type {keyof typeof envelopeImages} */ (
                                envelopeTheme
                            )
                        ] || envelopeImages["envelope-red"]}
                        alt="Envelope"
                        class="envelope-img"
                    />

                    <!-- Recipient Name -->
                    {#if recipientName}
                        <div class="recipient-text">
                            To {recipientName}
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div
                class="preview-content letter-content"
                in:fly={{ y: -20, duration: 400, opacity: 0 }}
                onclick={close}
                onkeydown={(e) => e.key === "Enter" && close()}
                role="button"
                tabindex="0"
            >
                <LetterView
                    {letterTheme}
                    {recipientName}
                    {body}
                    isVisible={true}
                />
            </div>

            {#if musicUrl}
                <MusicPlayer audioUrl={musicUrl} isVisible={isLetterOpen} />
            {/if}
        {/if}
    </div>
</div>

<style>
    .preview-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview-overlay {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .preview-content {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .letter-content {
        width: 100vw;
        height: 100vh;
    }

    .envelope-preview {
        position: relative;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .envelope-preview:hover {
        transform: scale(1.02);
    }

    .envelope-img {
        max-width: 600px;
        width: 100%;
        height: auto;
        display: block;
        filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
    }

    .recipient-text {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
        font-family: "Caveat", cursive;
        font-size: 2rem;
        color: #374151;
        text-align: center;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        .envelope-img {
            max-width: 400px;
        }

        .recipient-text {
            font-size: 1.5rem;
        }
    }
</style>
