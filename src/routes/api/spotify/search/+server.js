import { json } from "@sveltejs/kit";
import { searchTracks } from "$lib/server/spotify.js";

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function GET({ url }) {
    const query = url.searchParams.get("q");

    if (!query) {
        return json([]);
    }

    const tracks = await searchTracks(query);
    return json(tracks);
}
