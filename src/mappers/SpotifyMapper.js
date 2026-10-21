export const mapSpotifyTracks = (rawItems) => {
  if (!rawItems || !Array.isArray(rawItems)) {
    return [];
  }

  return rawItems.flatMap((item, index) => {
    const track = item?.track || item;

    if (!track || !track.name) {
      return [];
    }

    return [{
      id: track.id || `spotify-${index}`,
      position: index + 1,
      title: track.name || 'Música sem título',
      artist: track.artists?.map((artist) => artist.name).filter(Boolean).join(', ') || 'Artista desconhecido',
      albumCover: track.album?.images?.[0]?.url || '',
      previewUrl: track.preview_url || null,
      externalUrl: track.external_urls?.spotify || '',
    }];
  });
};