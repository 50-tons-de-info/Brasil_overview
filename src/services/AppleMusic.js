const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const getAccessToken = async () => {
    const authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }),
    };
    const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
    const data = await response.json();

    if (!response.ok || !data.access_token) {
        throw new Error(data.error_description || 'Não foi possível autenticar no Spotify.');
    }

    return data.access_token;
};

const spotifyFetch = async (endpoint) => {
    const token = await getAccessToken();
    const response = await fetch(https://api.spotify.com/v1${endpoint}, {
        headers: {
            Authorization: Bearer ${token},
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'O Spotify não respondeu à solicitação.');
    }

    return data;
};

export const getTopTracksByState = async (stateName) => {
    try {
        const queries = [Viral ${stateName}, Top 50 ${stateName}];
        let playlist = null;

        for (const queryText of queries) {
            const search = await spotifyFetch(
                /search?q=${encodeURIComponent(queryText)}&type=playlist&limit=1&market=BR,
            );
            playlist = search.playlists?.items?.[0];
            if (playlist) break;
        }

        if (!playlist) {
            throw new Error(Nenhuma playlist encontrada para ${stateName}.);
        }

        return {
            playlistName: playlist.name,
            playlistUrl: playlist.external_urls.spotify,
            embedUrl: https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator,
        };
    } catch (error) {
        console.error('Error fetching regional Spotify playlist:', error);
        throw error;
    }
};