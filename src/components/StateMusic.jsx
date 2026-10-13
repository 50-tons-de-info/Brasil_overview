import { useSpotify } from '../hooks/SpotifyHooker';
import { getStateTheme } from '../data/stateThemes';
import './TopTracksPanel.css';

// Ano em que os dados do ranking foram coletados.
const DATA_YEAR = '2025';

export default function StateMusic({ stateUf, stateName }) {
  const { tracks, artistsUsed, topArtist, region, genresUsed, loading, error } = useSpotify(stateUf, stateName);
  const theme = getStateTheme(stateUf);

  const themeStyle = {
    '--panel-accent': theme.primaryColor,
    '--panel-secondary': theme.secondaryColor,
    '--panel-surface': theme.secondaryBg,
    '--panel-border': theme.secondaryBorder,
    '--panel-tag': theme.badgeBg,
    '--panel-text': '#151b2b',
    '--panel-text-soft': '#475367',
    '--panel-shadow': theme.badgeBorder,
  };

  return (
    <aside className="top-tracks-panel" style={themeStyle}>
      <header className="top-tracks-panel__header">
        <span className="top-tracks-panel__eyebrow">Top 10 · Spotify</span>
        <h2 className="top-tracks-panel__state">{stateName || 'Selecione um estado'}</h2>
        {(region || genresUsed.length > 0) && (
          <small className="top-tracks-panel__artists">
            {region && <span>{region}</span>}
            {region && genresUsed.length > 0 && <span className="top-tracks-panel__dot">•</span>}
            {genresUsed.length > 0 && <span>{genresUsed.join(' · ')}</span>}
          </small>
        )}
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
                <span className="track-row__rank">#{track.position}</span>
                <div className="track-row__art-wrap">
                  {track.albumCover ? (
                    <img className="track-row__art" src={track.albumCover} alt={track.title} loading="lazy" />
                  ) : (
                    <span className="track-row__art track-row__art--empty" aria-label="Capa indisponível" />
                  )}
                  <span className="track-row__meta">
                    <span className="track-row__title">{track.title}</span>
                    <span className="track-row__artist">{track.artist}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {DATA_YEAR && (
        <footer className="top-tracks-panel__note">
          Observação: ranking montado com dados de {DATA_YEAR}. Por isso podem aparecer músicas fora de época.
        </footer>
      )}
    </aside>
  );
}