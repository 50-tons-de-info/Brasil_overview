const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const RANKING_URL = '/data/270_musicas_regionalistas_por_estado.csv';

let rankingPromise;
let accessTokenPromise;

const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        const next = text[index + 1];

        if (character === '"' && quoted && next === '"') {
            field += '"';
            index += 1;
        } else if (character === '"') {
            quoted = !quoted;
        } else if (character === ',' && !quoted) {
            row.push(field);
            field = '';
        } else if ((character === '\n' || character === '\r') && !quoted) {
            if (character === '\r' && next === '\n') index += 1;
            row.push(field);
            if (row.some((value) => value.trim())) rows.push(row);
            row = [];
            field = '';
        } else {
            field += character;
        }
    }

    if (field || row.length) {
        row.push(field);
        rows.push(row);
    }

    const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, '').trim());
    return rows.map((values) => Object.fromEntries(
        headers.map((header, index) => [header, values[index]?.trim() || '']),
    ));
};

const getRanking = async () => {
    if (!rankingPromise) {
        rankingPromise = fetch(RANKING_URL)
            .then((response) => {
                if (!response.ok) throw new Error('Não foi possível carregar o ranking estadual.');
                return response.text();
            })
            .then(parseCsv);
    }

    return rankingPromise;
};

const getAccessToken = async () => {
    if (!accessTokenPromise) {
        accessTokenPromise = fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
        }).then(async (response) => {
            const data = await response.json();

            if (!response.ok || !data.access_token) {
                throw new Error(data.error_description || 'Não foi possível autenticar no Spotify.');
            }

            return data.access_token;
        });
    }

    return accessTokenPromise;
};

const spotifyFetch = async (endpoint) => {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'O Spotify não respondeu à solicitação.');
    }

    return data;
};

const createLocalTrack = (row, stateUf) => ({
    id: `csv-${stateUf}-${row.posicao}`,
    name: row.musica,
    artists: [{ name: row.artista }],
    album: { images: [] },
    preview_url: null,
    external_urls: { spotify: '' },
});

const enrichTrackWithSpotify = async (row, stateUf) => {
    if (!CLIENT_ID || !CLIENT_SECRET) return createLocalTrack(row, stateUf);

    const query = encodeURIComponent(`track:"${row.musica}" artist:"${row.artista}"`);
    const exact = await spotifyFetch(`/search?q=${query}&type=track&market=BR&limit=1`);
    if (exact.tracks?.items?.[0]) return exact.tracks.items[0];

    const titleOnly = encodeURIComponent(`track:"${row.musica}"`);
    const fallback = await spotifyFetch(`/search?q=${titleOnly}&type=track&market=BR&limit=1`);
    return fallback.tracks?.items?.[0] || createLocalTrack(row, stateUf);
};

export const getTopTracksByState = async (stateUf, stateName) => {
    try {
        const uf = String(stateUf || '').toUpperCase();

        if (!uf) {
            return {
                topArtist: '',
                artistsUsed: [],
                region: '',
                genresUsed: [],
                rawItems: [],
            };
        }

        const rows = (await getRanking())
            .filter((row) => row.uf.toUpperCase() === uf)
            .sort((first, second) => Number(first.posicao) - Number(second.posicao))
            .slice(0, 10);

        if (rows.length === 0) {
            throw new Error(`Não foi possível encontrar músicas para ${stateName || uf}.`);
        }

        const tracks = await Promise.all(rows.map(async (row) => {
            try {
                return await enrichTrackWithSpotify(row, uf);
            } catch {
                return createLocalTrack(row, uf);
            }
        }));

        return {
            topArtist: rows[0].artista,
            artistsUsed: [...new Set(rows.map((row) => row.artista))],
            region: rows[0].regiao,
            genresUsed: [...new Set(rows.map((row) => row.genero))],
            rawItems: tracks.map((track) => ({ track })),
        };
    } catch (error) {
        console.error('Error fetching regional Spotify tracks:', error);
        throw error;
    }
};
