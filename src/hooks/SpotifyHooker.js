import { useState, useEffect } from "react";
import { getTopTracksByState } from "../services/Spotify";
import { mapSpotifyTracks } from "../mappers/SpotifyMapper";

export function useSpotify(stateUf, stateName) {
  const [tracks, setTracks] = useState([]);
  const [artistsUsed, setArtistsUsed] = useState([]);
  const [topArtist, setTopArtist] = useState("");
  const [region, setRegion] = useState("");
  const [genresUsed, setGenresUsed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setTracks(mapSpotifyTracks(data.rawItems));
        setArtistsUsed(data.artistsUsed);
        setTopArtist(data.topArtist);
        setRegion(data.region);
        setGenresUsed(data.genresUsed);
      } catch (err) {
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