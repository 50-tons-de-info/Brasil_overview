const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const getAcessToken = async    () => {
    const authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`
    };
    try {   
    const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
    const data = await response.json();
    return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
};

export const getPLaylistTracks = async (playlistId) => {
    const token = await getAcessToken();
    if (!token) return null;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestOptions);
        const data = await response.json();
        const formattedTracks = data.items.map((item, index) => {
            const track = item.track;
            return {
                id: track.id,
                name: track.name,
                position: index + 1,
                artists: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                release_date: track.album.release_date,
                album_image: track.album.images[0]?.url || null,
                preview_url: track.preview_url,
                external_url: track.external_urls.spotify
            };
        });
    return formattedTracks;
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        return null;
    }
};