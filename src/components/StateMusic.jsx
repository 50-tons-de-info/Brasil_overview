import { useSpotify } from '../hooks/SpotifyHooker';
import './TopTracksPanel.css';

export default function StateMusic({ stateUf, stateName }) {
  const { tracks, artistsUsed, topArtist, region, genresUsed, loading, error } = useSpotify(stateUf, stateName);

  return (
    <aside className="top-tracks-panel">
      <header className="top-tracks-panel__header">
        <span className="top-tracks-panel__eyebrow">Top 10 · Spotify</span>
        <h2 className="top-tracks-panel__state">{stateName || 'Selecione um estado'}</h2>
        {region && <small className="top-tracks-panel__artists">{region} · {genresUsed.join(' · ')}</small>}
        {topArtist && <small className="top-tracks-panel__artists">Líder regional: {topArtist}</small>}
        {artistsUsed.length > 0 && (
          <small className="top-tracks-panel__artists">{artistsUsed.join(' · ')}</small>
        )}
      </header>

      <div className="top-tracks-panel__body">
        {loading && (
          <ul className="top-tracks-panel__skeleton" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, index) => (
              <li key={index} className="skeleton-row">
                <span className="skeleton-row__art" />
                <span className="skeleton-row__lines">
                  <span className="skeleton-row__line skeleton-row__line--title" />
                  <span className="skeleton-row__line skeleton-row__line--artist" />
                </span>
              </li>
            ))}
          </ul>
        )}

        {!loading && error && (
          <div className="top-tracks-panel__state-msg" role="alert">
            <p>Não foi possível carregar as músicas.</p>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && tracks.length === 0 && (
          <div className="top-tracks-panel__state-msg">
            <p>Nenhuma música encontrada.</p>
            <span>Escolha um estado no mapa para ver o ranking.</span>
          </div>
        )}

        {!loading && !error && tracks.length > 0 && (
          <ol className="top-tracks-panel__list">
            {tracks.map((track) => (
              <li className="track-row" key={track.id}>
                <span className="track-row__rank">{track.position}</span>
                <span className="track-row__art-wrap">
                  {track.albumCover ? (
                    <img className="track-row__art" src={track.albumCover} alt="" loading="lazy" />
                  ) : (
                    <span className="track-row__art track-row__art--empty" />
                  )}
                </span>
                <span className="track-row__info">
                  <span className="track-row__title">{track.title}</span>
                  <span className="track-row__artist">{track.artist}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
