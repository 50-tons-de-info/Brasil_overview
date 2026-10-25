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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  if (isLoading) {
    return (
      <div className="radio-player-skeleton">
        <span>Carregando estações de {stateName}...</span>
      </div>
    );
  }

  if (radios.length === 0) {
    return null;
  }


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

      <div className="gramophone">
        <button
          type="button"
          className="seal-play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pausar" : "Tocar"}
        >
          {isBuffering ? (
            <span className="radio-mini-spinner" />
          ) : isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" />
              <rect x="9" y="2" width="4" height="12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6z" />
            </svg>
          )}
        </button>

        <div style={{ flex: 1 }}>
          <div className="station-name">{selectedRadio?.name}</div>
          <div className="station-meta">{stateName}</div>
        </div>

        <div className="gramophone-volume">
          <button
            type="button"
            className="volume-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Ativar som" : "Mutar"}
          >
            {isMuted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="volume-slider"
            title="Volume"
          />
        </div>
      </div>

      {error && <div className="radio-error-inline">{error}</div>}

      <p className="panel-title">Outras emissoras</p>
      <div className="station-list">
        {radios.map((radio) => (
          <button
            key={radio.id}
            type="button"
            className={`station-row ${selectedRadio?.id === radio.id ? "active" : ""}`}
            onClick={() => handleSelectRadio(radio)}
          >
            <span>{radio.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}