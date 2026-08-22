import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import { fetchRadiosByState } from "../services/radioApi";
import "./StateRadioPlayer.css";

export default function StateRadioPlayer({ stateCode, stateName }) {
  const [radios, setRadios] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // Carrega as rádios ao mudar o estado
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    cleanupHls();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }

    fetchRadiosByState(stateCode, stateName)
      .then((data) => {
        if (!isMounted) return;
        setRadios(data);
        if (data.length > 0) {
          setSelectedRadio(data[0]);
        } else {
          setSelectedRadio(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Não foi possível carregar as estações deste estado.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      cleanupHls();
    };
  }, [stateCode, stateName, cleanupHls]);

  // Sincroniza o volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Gerencia fonte de áudio
  useEffect(() => {
    if (!selectedRadio || !audioRef.current) return;

    setError(null);
    cleanupHls();

    const streamUrl = selectedRadio.streamUrl;
    const isHls = streamUrl.includes(".m3u8") || streamUrl.includes("sdp");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(audioRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isPlaying && audioRef.current) {
          setIsBuffering(true);
          audioRef.current
            .play()
            .then(() => setIsBuffering(false))
            .catch(() => {
              setIsPlaying(false);
              setIsBuffering(false);
            });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              cleanupHls();
              setIsPlaying(false);
              setIsBuffering(false);
              setError(`Transmissão de "${selectedRadio.name}" indisponível.`);
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl") && isHls) {
      audioRef.current.src = streamUrl;
      if (isPlaying) {
        setIsBuffering(true);
        audioRef.current
          .play()
          .then(() => setIsBuffering(false))
          .catch(() => {
            setIsPlaying(false);
            setIsBuffering(false);
          });
      }
    } else {
      audioRef.current.src = streamUrl;
      if (isPlaying) {
        setIsBuffering(true);
        audioRef.current
          .play()
          .then(() => setIsBuffering(false))
          .catch(() => {
            setIsPlaying(false);
            setIsBuffering(false);
            setError(`Transmissão de "${selectedRadio.name}" indisponível.`);
          });
      }
    }

    return () => {
      cleanupHls();
    };
  }, [selectedRadio, isPlaying, cleanupHls]);

  const togglePlay = () => {
    if (!audioRef.current || !selectedRadio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsBuffering(false);
    } else {
      setError(null);
      setIsBuffering(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsBuffering(false);
          setError(`Transmissão de "${selectedRadio.name}" offline.`);
        });
    }
  };

  const handleSelectRadio = (radio) => {
    if (selectedRadio?.id === radio.id) {
      togglePlay();
      return;
    }
    setSelectedRadio(radio);
    setIsPlaying(true);
  };

  const handleNextStation = () => {
    if (!radios.length || !selectedRadio) return;
    const currentIndex = radios.findIndex((r) => r.id === selectedRadio.id);
    const nextIndex = (currentIndex + 1) % radios.length;
    setSelectedRadio(radios[nextIndex]);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="radio-player-skeleton">
        <span className="radio-skeleton-pulse">Carregando estações de {stateName}...</span>
      </div>
    );
  }

  if (radios.length === 0) {
    return null;
  }

  const mainTag = selectedRadio?.tags?.[0] || "Geral";

  return (
    <section className="radio-player-minimal">
      <audio
        ref={audioRef}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onError={() => {
          if (!hlsRef.current) {
            setIsPlaying(false);
            setIsBuffering(false);
            setError(`Transmissão de "${selectedRadio?.name}" indisponível.`);
          }
        }}
      />

      <div className="radio-deck">
        <div className="radio-meta">
          <div className="radio-logo-wrap">
            {selectedRadio?.favicon ? (
              <img
                key={selectedRadio.id}
                src={selectedRadio.favicon}
                alt={selectedRadio.name}
                className="radio-logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".radio-logo-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="radio-logo-fallback"
              style={{ display: selectedRadio?.favicon ? "none" : "flex" }}
            >
              {selectedRadio?.name ? selectedRadio.name.replace(/^(Rádio|Radio)\s+/i, "").charAt(0).toUpperCase() : "R"}
            </div>
          </div>

          <div className="radio-info-text">
            <div className="radio-info-title-row">
              <span className="radio-station-name">{selectedRadio?.name}</span>
              {isPlaying && <span className="radio-status-dot" title="Transmissão ao vivo" />}
            </div>
            <span className="radio-station-sub">
              {mainTag} • {stateName}
            </span>
          </div>
        </div>

        <div className="radio-actions">
          {/* Play/Pause */}
          <button
            type="button"
            className={`radio-ctrl-btn radio-play-btn ${isPlaying ? "playing" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar" : "Tocar"}
          >
            {isBuffering ? (
              <span className="radio-mini-spinner" />
            ) : isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Próxima */}
          <button
            type="button"
            className="radio-ctrl-btn radio-skip-btn"
            onClick={handleNextStation}
            aria-label="Próxima rádio"
            title="Próxima rádio"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,4 15,12 5,20" />
              <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Volume */}
          <div className="radio-volume-wrap">
            <button
              type="button"
              className="radio-mute-btn"
              onClick={toggleMute}
              aria-label="Controle de áudio"
            >
              {isMuted || volume === 0 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="radio-volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="radio-error-inline">
          <span>{error}</span>
          <button type="button" onClick={handleNextStation} className="radio-error-skip">
            Pular para a próxima
          </button>
        </div>
      )}

      {/* Seletor Minimalista em Pills */}
      <div className="radio-station-pills">
        {radios.map((radio) => {
          const isSelected = selectedRadio?.id === radio.id;
          return (
            <button
              key={radio.id}
              type="button"
              className={`radio-pill ${isSelected ? "active" : ""}`}
              onClick={() => handleSelectRadio(radio)}
            >
              {isSelected && isPlaying && <span className="pill-dot" />}
              <span className="pill-label">{radio.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
