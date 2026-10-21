/**
 * Spotify.js — serviço de dados do painel "Top 10 · Spotify".
 *
 * Como funciona:
 *  1. O ranking de cada estado (10 músicas regionalistas) vem de um CSV local
 *     (public/data/270_musicas_regionalistas_por_estado.csv = 27 estados x 10 músicas).
 *     A API do Spotify NÃO oferece ranking por estado; a seleção é do projeto.
 *  2. Para cada música do CSV, consultamos a Spotify Web API (endpoint /search)
 *     para obter capa do álbum, link e demais metadados.
 *  3. Se o Spotify falhar ou não estiver configurado, a música continua na lista
 *     (sem capa), usando apenas os dados do CSV.
 */

// Credenciais do app Spotify, lidas das variáveis de ambiente do Vite (.env)
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Caminho do CSV com o ranking regional (servido pela pasta public/)
const RANKING_URL = '/data/270_musicas_regionalistas_por_estado.csv';

// Promises em cache: o CSV e o token são buscados uma única vez por sessão
let rankingPromise;
let accessTokenPromise;

/**
 * Converte o texto de um CSV em uma lista de objetos {coluna: valor}.
 * Lê caractere a caractere para tratar campos entre aspas, aspas escapadas ("")
 * e quebras de linha (\n ou \r\n). A primeira linha é usada como cabeçalho.
 */
const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false; // true enquanto estamos dentro de um campo entre aspas

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        const next = text[index + 1];

        if (character === '"' && quoted && next === '"') {
            // Aspas duplas dentro de um campo entre aspas = uma aspa literal
            field += '"';
            index += 1;
        } else if (character === '"') {
            // Abre ou fecha um campo entre aspas
            quoted = !quoted;
        } else if (character === ',' && !quoted) {
            // Vírgula fora de aspas separa campos
            row.push(field);
            field = '';
        } else if ((character === '\n' || character === '\r') && !quoted) {
            // Fim de linha fora de aspas: fecha o registro (ignora linhas vazias)
            if (character === '\r' && next === '\n') index += 1;
            row.push(field);
            if (row.some((value) => value.trim())) rows.push(row);
            row = [];
            field = '';
        } else {
            field += character;
        }
    }

    // Último registro (arquivo sem quebra de linha no final)
    if (field || row.length) {
        row.push(field);
        rows.push(row);
    }

    // Primeira linha = cabeçalho (remove BOM do Excel e espaços)
    const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, '').trim());
    return rows.map((values) => Object.fromEntries(
        headers.map((header, index) => [header, values[index]?.trim() || '']),
    ));
};

/** Carrega e interpreta o CSV do ranking (uma única requisição, em cache). */
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

/**
 * Autentica na Spotify Web API pelo fluxo "Client Credentials"
 * (acesso a dados públicos do catálogo, sem login do usuário).
 * O token é guardado em cache e reutilizado nas próximas chamadas.
 */
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

/** GET autenticado em qualquer endpoint da API v1 do Spotify; devolve o JSON. */
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

/**
 * Monta uma faixa "local" (só com os dados do CSV) no mesmo formato
 * da resposta do Spotify. Usada quando não há credenciais ou a busca falha.
 */
const createLocalTrack = (row, stateUf) => ({
    id: `csv-${stateUf}-${row.posicao}`,
    name: row.musica,
    artists: [{ name: row.artista }],
    album: { images: [] },
    preview_url: null,
    external_urls: { spotify: '' },
});

/**
 * Enriquece uma música do CSV com os dados do Spotify (capa, link, etc.).
 * Estratégia de busca, da mais precisa para a mais flexível:
 *  1) título + artista; 2) só o título; 3) dados locais do CSV.
 */
const enrichTrackWithSpotify = async (row, stateUf) => {
    // Sem credenciais configuradas: segue só com o CSV
    if (!CLIENT_ID || !CLIENT_SECRET) return createLocalTrack(row, stateUf);

    // Busca exata (título + artista), restrita ao mercado brasileiro
    const query = encodeURIComponent(`track:"${row.musica}" artist:"${row.artista}"`);
    const exact = await spotifyFetch(`/search?q=${query}&type=track&market=BR&limit=1`);
    if (exact.tracks?.items?.[0]) return exact.tracks.items[0];

    // Segunda tentativa: só o título (pode retornar outro artista)
    const titleOnly = encodeURIComponent(`track:"${row.musica}"`);
    const fallback = await spotifyFetch(`/search?q=${titleOnly}&type=track&market=BR&limit=1`);
    return fallback.tracks?.items?.[0] || createLocalTrack(row, stateUf);
};

/**
 * Função principal do serviço: devolve o Top 10 de um estado.
 * @param {string} stateUf   Sigla do estado (ex.: "RO")
 * @param {string} stateName Nome do estado (usado nas mensagens de erro)
 * @returns {Promise<{topArtist, artistsUsed, region, genresUsed, rawItems}>}
 */
export const getTopTracksByState = async (stateUf, stateName) => {
    try {
        const uf = String(stateUf || '').toUpperCase();

        // Nenhum estado selecionado: devolve estrutura vazia
        if (!uf) {
            return {
                topArtist: '',
                artistsUsed: [],
                region: '',
                genresUsed: [],
                rawItems: [],
            };
        }

        // Filtra as linhas do estado, ordena pela posição e fica com as 10 primeiras
        const rows = (await getRanking())
            .filter((row) => row.uf.toUpperCase() === uf)
            .sort((first, second) => Number(first.posicao) - Number(second.posicao))
            .slice(0, 10);

        if (rows.length === 0) {
            throw new Error(`Não foi possível encontrar músicas para ${stateName || uf}.`);
        }

        // Consulta o Spotify para as 10 músicas em paralelo.
        // Se uma busca falhar, só aquela música cai para os dados locais.
        const tracks = await Promise.all(rows.map(async (row) => {
            try {
                return await enrichTrackWithSpotify(row, uf);
            } catch {
                return createLocalTrack(row, uf);
            }
        }));

        return {
            topArtist: rows[0].artista,                              // artista da 1ª posição
            artistsUsed: [...new Set(rows.map((row) => row.artista))], // artistas sem repetição
            region: rows[0].regiao,
            genresUsed: [...new Set(rows.map((row) => row.genero))],   // gêneros sem repetição
            rawItems: tracks.map((track) => ({ track })),            // formato esperado pelo mapper
        };
    } catch (error) {
        console.error('Error fetching regional Spotify tracks:', error);
        throw error;
    }
};