import { useParams, useNavigate } from "react-router-dom";
import { states } from "../data/states";
import { IBGE_STATE_DATA } from "../data/ibgeData";
import { getStateTheme } from "../data/stateThemes";
import StateResume from "../components/StateResume";
import StateMusic from "../components/StateMusic";
import StateIndicatorsWidget from "../components/StateIndicatorsWidget";
import StateWeatherWidget from "../components/StateWeatherWidget";
import StateRadioPlayer from "../components/StateRadioPlayer";
import StateHolidaysWidget from "../components/StateHolidaysWidget";
import GeminiOut from "../components/geminiOut";
import "./StateDetail.css";

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const stateCode = code?.toLowerCase();
  const state = states[stateCode];
  const stateData = IBGE_STATE_DATA[stateCode];
  const theme = getStateTheme(stateCode);

  if (!state) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Estado não encontrado</h2>
        <p>O código de estado informado não existe.</p>
        <button
          style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Voltar ao Mapa
        </button>
      </div>
    );
  }

  // Estilo dinâmico com as cores e características do estado
  const dynamicThemeStyle = {
    "--state-primary": theme.primaryColor,
    "--state-secondary": theme.secondaryColor,
    "--state-accent": theme.accentColor,
    "--state-glow": theme.heroGlow,
    "--state-badge-bg": theme.badgeBg,
    "--state-badge-border": theme.badgeBorder,
    "--state-badge-text": theme.badgeText,
  };

  return (
    <div className="state-page-container" style={dynamicThemeStyle}>
      {/* Ambient Glow Temático no Fundo */}
      <div className="state-hero-glow" />

      {/* Topo / Botão Voltar */}
      <nav className="state-top-nav">
        <button
          type="button"
          className="state-back-btn"
          onClick={() => navigate("/")}
        >
          ← Voltar ao mapa
        </button>
        <span className="state-region-badge">Região {state.region || "Brasil"}</span>
      </nav>

      {/* Hero Header com Identidade Visual Própria */}
      <header className="state-hero-header">
        <div className="state-title-row">
          <div className="state-title-group">
            <span className="state-icon-emoji">{theme.icon}</span>
            <h1 className="state-name-title">
              {state.name}
              <span className="state-uf-badge">{state.uf}</span>
            </h1>
          </div>
          <span className="state-tagline-text">{theme.tagline}</span>
        </div>

        {/* Faixa de Identidade (Capital, Gentílico, Bioma) */}
        {stateData && (
          <div className="state-identity-chips">
            <span className="identity-chip">
              📍 <strong>Capital:</strong> {state.capital}
            </span>
            <span className="identity-chip">
              👥 <strong>Gentílico:</strong> {stateData.gentilico.split("/")[0].trim()}
            </span>
            <span className="identity-chip">
              🌿 <strong>Bioma Predominante:</strong> {stateData.biomaPrincipal}
            </span>
          </div>
        )}
      </header>

      {/* Bento Dashboard Grid: 2 Colunas Integradas */}
      <main className="state-dashboard-grid">
        {/* Coluna Principal: Resumo e Painel Estatístico IBGE */}
        <section className="dashboard-main-col">
          <StateResume title={state.name} wikiTitle={state.wikiTitle || state.name} />
          <StateIndicatorsWidget stateCode={code} stateName={state.name} />
          <GeminiOut stateName={state.name} />
        </section>

        {/* Coluna Lateral: Ferramentas em Tempo Real (Clima, Rádios, Feriados) */}
        <aside className="dashboard-side-col">
          <StateMusic stateUf={code} stateName={state.name} />
          <StateWeatherWidget stateCode={code} stateName={state.name} />
          <StateRadioPlayer stateCode={code} stateName={state.name} />
          <StateHolidaysWidget stateCode={code} stateName={state.name} />
        </aside>
      </main>
    </div>
  );
}

export default StateDetail;
