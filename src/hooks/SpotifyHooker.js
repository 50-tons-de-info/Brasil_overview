import { useState, useEffect } from "react";
import { getPlaylistTracks } from "../services/spotifyService";

export function useSpotify(playlistId) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!playlistId) {
            setTracks([]);
            return;
        }

        const fetchTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPlaylistTracks(playlistId);
                setTracks(data);
            } catch (err) {
                setError(err.message || "An error occurred while fetching tracks.");
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [playlistId]);

    return { tracks, loading, error };
}