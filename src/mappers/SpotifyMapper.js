export const mapSpotifyTracks = (rawItems) => {
    if (!rawItems || !Array.isArray(rawItems)) {
        return [];
    }

    return rawItems.map((item, index) => {
        const track = item.track || item;
        return {
            id: track.id,
            position: index + 1,
            title: track.name,
            artist: track.artists?.map((artist) => artist.name).join(', ') || 'Artista desconhecido',
            albumCover: track.album?.images?.[0]?.url || "",
            previewUrl: track.preview_url || null,
            externalUrl: track.external_urls?.spotify || '',
        };
    });
};