<script>
    import { fade, slide } from "svelte/transition";

    // Props
    let { selectedMusic = $bindable(null) } = $props();

    // State
    let query = $state("");
    /** @type {Array<{id: string, name: string, artist: string, albumArt: string, uri: string, externalUrl: string, previewUrl: string | null}>} */
    let results = $state([]);
    let isSearching = $state(false);
    let isOpen = $state(false);
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let searchTimeout;

    // Selected track display
    let selectedTrackName = $state("");

    /** @param {Event & { currentTarget: HTMLInputElement }} e */
    function handleInput(e) {
        query = e.currentTarget.value;
        isOpen = true;

        clearTimeout(searchTimeout);
        if (query.trim().length < 2) {
            results = [];
            return;
        }

        isSearching = true;
        searchTimeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/spotify/search?q=${encodeURIComponent(query)}`,
                );
                if (res.ok) {
                    results = await res.json();
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                isSearching = false;
            }
        }, 500); // 500ms debounce
    }

    /** @param {{id: string, name: string, artist: string, albumArt: string, uri: string, externalUrl: string, previewUrl: string | null}} track */
    function selectTrack(track) {
        // We store the Spotify Link (externalUrl) or URI?
        // Using externalUrl (https://open.spotify.com/track/...) is easier for embed logic usually,
        // but URI (spotify:track:...) also works.
        // Let's store externalUrl as 'musicUrl'.
        // Wait, LetterView might need ID for embed.
        // https://open.spotify.com/embed/track/{id}
        // Let's store the full object or just the ID?
        // The existing logic expects a string.
        // Let's store the full HTTP URL: track.externalUrl (e.g. https://open.spotify.com/track/12345)
        selectedMusic = track.externalUrl;
        selectedTrackName = `${track.name} - ${track.artist}`;
        query = "";
        isOpen = false;
    }

    function clearSelection() {
        selectedMusic = "";
        selectedTrackName = "";
        query = "";
        results = [];
    }

    // Close dropdown on click outside logic could be added, but minimal for now.
</script>

<div class="spotify-search-container">
    {#if isOpen && (results.length > 0 || isSearching)}
        <div class="results-dropdown" transition:slide={{ duration: 200 }}>
            {#if isSearching}
                <div class="loading-item">Searching...</div>
            {:else}
                {#each results as track}
                    <button
                        type="button"
                        class="result-item"
                        onclick={() => selectTrack(track)}
                        aria-label="Select {track.name} by {track.artist}"
                    >
                        <img
                            src={track.albumArt}
                            alt="Album Art"
                            class="album-art"
                        />
                        <div class="track-details">
                            <div class="track-name">{track.name}</div>
                            <div class="artist-name">{track.artist}</div>
                        </div>
                    </button>
                {/each}
            {/if}
        </div>
    {/if}

    <div class="input-wrapper">
        <i class="fa-brands fa-spotify spotify-icon"></i>

        {#if selectedMusic}
            <div class="selected-display">
                <span class="track-info">{selectedTrackName}</span>
                <button
                    type="button"
                    class="clear-btn"
                    onclick={clearSelection}
                    aria-label="Clear selected song"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        {:else}
            <input
                type="text"
                class="search-input"
                placeholder="Search for a song..."
                value={query}
                oninput={handleInput}
                onfocus={() => (isOpen = true)}
            />
        {/if}

        {#if !selectedMusic}
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
        {/if}
    </div>
</div>

<style>
    .spotify-search-container {
        position: relative;
        width: 100%;
        font-family: "Poppins", sans-serif;
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        padding: 0.8rem 1rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .input-wrapper:focus-within {
        border-color: #1db954; /* Spotify Green */
        box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.2);
    }

    .spotify-icon {
        color: #1db954;
        font-size: 1.5rem;
        margin-right: 0.8rem;
    }

    .search-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 1rem;
        color: #374151;
        outline: none;
    }

    .search-input::placeholder {
        color: #9ca3af;
    }

    .search-icon {
        color: #9ca3af;
    }

    /* Selected State */
    .selected-display {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
    }

    .track-info {
        font-weight: 500;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 0.5rem;
    }

    .clear-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .clear-btn:hover {
        background: #f3f4f6;
        color: #ef4444;
    }

    /* Dropdown */
    .results-dropdown {
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        background: white;
        border-radius: 12px;
        margin-bottom: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 50;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .loading-item {
        padding: 1rem;
        text-align: center;
        color: #6b7280;
    }

    .result-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.8rem;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
        transition: background 0.2s;
        border-bottom: 1px solid #f3f4f6;
    }

    .result-item:last-child {
        border-bottom: none;
    }

    .result-item:hover {
        background: #f0fdf4; /* Light green tint */
    }

    .album-art {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 1rem;
        object-fit: cover;
    }

    .track-details {
        flex: 1;
        overflow: hidden;
    }

    .track-name {
        font-weight: 600;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.95rem;
    }

    .artist-name {
        font-size: 0.85rem;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
