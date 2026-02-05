import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

let cachedToken = null;
let tokenExpiration = 0;

/**
 * Get Spotify Access Token (Client Credentials Flow)
 */
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiration) {
        return cachedToken;
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        throw new Error("Missing Spotify credentials in .env");
    }

    const auth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Spotify Token Error:", errorText);
        throw new Error("Failed to get Spotify access token");
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Token valid for 3600s, refresh 5 min early
    tokenExpiration = now + data.expires_in * 1000 - 300000;

    return cachedToken;
}

/**
 * Search Spotify Tracks
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchTracks(query) {
    if (!query) return [];

    try {
        const token = await getAccessToken();
        const url = new URL(SEARCH_ENDPOINT);
        url.searchParams.set("q", query);
        url.searchParams.set("type", "track");
        url.searchParams.set("limit", "10");

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Spotify Search Failed");
        }

        const data = await response.json();

        return data.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            albumArt: track.album.images[2]?.url || track.album.images[0]?.url, // [2] is usually 64x64, [0] is 640x640
            uri: track.uri,
            externalUrl: track.external_urls.spotify,
            previewUrl: track.preview_url
        }));
    } catch (error) {
        console.error("Spotify Search Error:", error);
        return [];
    }
}
