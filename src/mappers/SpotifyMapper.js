/**
 * SpotifyMapper.js — normaliza as faixas para o formato usado pela interface.
 *
 * Recebe os itens "crus" (vindos da API do Spotify ou do CSV local) e devolve
 * uma lista simples, com apenas os campos que o componente StateMusic precisa.
 * Assim, o resto do app não depende da estrutura da resposta do Spotify.
 */
export const mapSpotifyTracks = (rawItems) => {
    // Entrada inválida: devolve lista vazia em vez de quebrar a tela
    if (!rawItems || !Array.isArray(rawItems)) {
        return [];
    }

    // flatMap permite descartar itens inválidos (retornando []) sem criar buracos
    return rawItems.flatMap((item, index) => {
        // Aceita tanto { track: {...} } quanto a faixa diretamente
        const track = item?.track || item;

        // Faixa sem nome não tem como ser exibida
        if (!track || !track.name) {
            return [];
        }

        return [{
            id: track.id || `spotify-${index}`,
            position: index + 1, // posição no ranking (1 a 10)
            title: track.name || 'Música sem título',
            // Une todos os artistas da faixa em um único texto
            artist: track.artists?.map((artist) => artist.name).filter(Boolean).join(', ') || 'Artista desconhecido',
            // Primeira imagem do álbum (a de maior resolução); vazio = sem capa
            albumCover: track.album?.images?.[0]?.url || '',
            previewUrl: track.preview_url || null,
            externalUrl: track.external_urls?.spotify || '',
        }];
    });
};