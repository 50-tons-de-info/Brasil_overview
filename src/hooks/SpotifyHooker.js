/**
 * SpotifyHooker.js — hook React que liga o serviço do Spotify à interface.
 *
 * useSpotify(stateUf, stateName) busca o Top 10 do estado informado e devolve
 * os dados prontos para o componente, junto com os estados de carregamento e erro.
 * Fluxo: componente -> useSpotify -> services/Spotify.js -> mappers/SpotifyMapper.js
 */
import { useState, useEffect } from "react";
import { getTopTracksByState } from "../services/Spotify";
import { mapSpotifyTracks } from "../mappers/SpotifyMapper";

export function useSpotify(stateUf, stateName) {
    // Dados exibidos no painel
    const [tracks, setTracks] = useState([]);
    const [artistsUsed, setArtistsUsed] = useState([]);
    const [topArtist, setTopArtist] = useState("");
    const [region, setRegion] = useState("");
    const [genresUsed, setGenresUsed] = useState([]);
    // Controle da requisição
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Refaz a busca sempre que o estado selecionado mudar
    useEffect(() => {
        // Sem estado selecionado: limpa tudo e encerra o carregamento
        if (!stateUf) {
            setTracks([]);
            setArtistsUsed([]);
            setTopArtist("");
            setRegion("");
            setGenresUsed([]);
            setLoading(false);
            return;
        }

        const fetchTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTopTracksByState(stateUf, stateName);
                // O mapper converte o formato do Spotify no formato da interface
                setTracks(mapSpotifyTracks(data.rawItems));
                setArtistsUsed(data.artistsUsed);
                setTopArtist(data.topArtist);
                setRegion(data.region);
                setGenresUsed(data.genresUsed);
            } catch (err) {
                // Em caso de erro, limpa os dados e guarda a mensagem para a tela
                setTracks([]);
                setArtistsUsed([]);
                setTopArtist("");
                setRegion("");
                setGenresUsed([]);
                setError(err.message || "Não foi possível carregar as músicas.");
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [stateUf, stateName]);

    return { tracks, artistsUsed, topArtist, region, genresUsed, loading, error };
}