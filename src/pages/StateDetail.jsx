import { useState } from "react";
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

const TABS = [
  { key: "overview", label: "Visão Geral", roman: "I" },
  { key: "indicators", label: "Estatísticas & Economia", roman: "II" },
  { key: "weather", label: "Clima & Previsão", roman: "III" },
  { key: "radios", label: "Rádios ao Vivo", roman: "IV" },
  { key: "holidays", label: "Feriados", roman: "V" },
];

const STATE_REGIONS = {
  ac: "Norte", ap: "Norte", am: "Norte", pa: "Norte", ro: "Norte", rr: "Norte", to: "Norte",
  al: "Nordeste", ba: "Nordeste", ce: "Nordeste", ma: "Nordeste", pb: "Nordeste", pe: "Nordeste", pi: "Nordeste", rn: "Nordeste", se: "Nordeste",
  df: "Centro-Oeste", go: "Centro-Oeste", mt: "Centro-Oeste", ms: "Centro-Oeste",
  es: "Sudeste", mg: "Sudeste", rj: "Sudeste", sp: "Sudeste",
  pr: "Sul", rs: "Sul", sc: "Sul"
};

const COMPASS_ROSES = Object.fromEntries(
  Object.entries(
    import.meta.glob("../assets/icons/compass-roses/rosa_dos_ventos_*.png", {
      eager: true,
      query: "?url",
      import: "default",
    })
  )
    .map(([path, url]) => [path.match(/_([A-Z]{2})\.png$/)?.[1].toLowerCase(), url])
    .filter(([code]) => code)
);

function formatStateNameParts(name) {
  if (!name) return { main: "", sub: "" };
  const words = name.split(" ");
  if (words.length <= 1) return { main: name, sub: "" };
  if (words.length === 2) return { main: words[0], sub: words[1] };
  if (words.length >= 3 && ["do", "da", "de", "dos", "das"].includes(words[1].toLowerCase())) {
    return { main: words[0], sub: words.slice(1).join(" ") };
  }
  const mid = Math.ceil(words.length / 2);
  return { main: words.slice(0, mid).join(" "), sub: words.slice(mid).join(" ") };
}

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const stateCode = code?.toLowerCase();
  const state = states[stateCode];
  const stateData = IBGE_STATE_DATA[stateCode];
  const theme = getStateTheme(stateCode);

  const [activeTab, setActiveTab] = useState("overview");

  if (!state) {
    return (
      <div className="state-not-found">
        <h2>Estado não encontrado</h2>
        <p>O código de estado informado não existe.</p>
        <button type="button" className="back-btn" onClick={() => navigate("/")}>
          ← Voltar ao Mapa
        </button>
      </div>
    );
  }

  const dynamicThemeStyle = {
    "--state-primary": theme.primaryColor,
    "--state-secondary": theme.secondaryColor,
    "--state-accent": theme.accentColor,
    "--state-badge-bg": theme.badgeBg,
    "--state-badge-border": theme.badgeBorder,
    "--state-badge-text": theme.badgeText,
    "--state-secondary-bg": theme.secondaryBg,
    "--state-secondary-border": theme.secondaryBorder,
    "--state-accent-bg": theme.accentBg,
    "--state-accent-border": theme.accentBorder,
  };

  const fmtNumber = (val) => new Intl.NumberFormat("pt-BR").format(val);
  const activeTabMeta = TABS.find((t) => t.key === activeTab) || TABS[0];

  const sectionHeadings = {
    overview: `Sobre ${state.name}`,
    indicators: `${state.name} em números`,
    weather: `Clima & previsão — ${state.name}`,
    radios: `Rádios ao vivo — ${state.name}`,
    holidays: `Feriados & datas comemorativas`,
  };

  const nameParts = formatStateNameParts(state.name);

  return (
    <div className="state-page-shell" style={dynamicThemeStyle}>
      <div className="sheet">
        {/* Topbar com fita horizontal */}
        <div className="topbar">
          <div className="ribbon" id="ribbonTitle">
            {activeTabMeta.roman} · {activeTabMeta.label.toUpperCase()}
          </div>
        </div>

        <div className="layout">
          {/* Cartucho / Sidebar */}
          <aside className="cartouche">
            <button type="button" className="back-btn" onClick={() => navigate("/")}>
              ← Todos os estados
            </button>
            <div className="identity-block">
              <div className="compass-wrap">
                <img
                  className="compass-rose"
                  src={COMPASS_ROSES[stateCode]}
                  alt={`Rosa dos ventos de ${state.name}`}
                />
              </div>
              <h1 className="state-name">
                {nameParts.main}
                {nameParts.sub && <span>{nameParts.sub}</span>}
              </h1>
              <p className="motto">"{theme.tagline}"</p>
              <div className="flag-ribbon">
                <i style={{ "--c": theme.primaryColor }} />
                <i style={{ "--c": theme.secondaryColor }} />
                <i style={{ "--c": theme.accentColor }} />
              </div>
              <div className="state-meta">
                <span className="uf-mark">{state.uf}</span>
                <span className="meta-sep" />
                <span className="region-mark">Região {STATE_REGIONS[stateCode] || "Brasil"}</span>
              </div>
            </div>

            <div className="rope" />

            {stateData && (
              <dl className="facts">
                <div>
                  <dt>Capital</dt>
                  <dd>{state.capital}</dd>
                </div>
                <div>
                  <dt>Gentílico</dt>
                  <dd>{stateData.gentilico.split("/")[0].trim()}</dd>
                </div>
                <div>
                  <dt>Bioma</dt>
                  <dd>{stateData.biomaPrincipal}</dd>
                </div>
              </dl>
            )}

            <div className="rope" />

            <nav className="seal-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  data-tab={tab.key}
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className="num">{tab.roman}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Painel Principal de Gráficos e Dados */}
          <main className="chart-panel">
            {/* Cabeçalho da Seção */}
            <div className="section-head">
              <span className="roman">{activeTabMeta.roman}</span>
              <h2>{sectionHeadings[activeTab]}</h2>
            </div>

            {/* ABA 1: VISÃO GERAL */}
            {activeTab === "overview" && (
              <div className="tab active">
                <StateResume title={state.name} wikiTitle={state.wikiTitle || state.name} />

                {stateData && (
                  <div className="legend-grid">
                    <div className="legend-box">
                      <span className="tag">Censo IBGE</span>
                      <div className="sub">População</div>
                      <div className="big">{fmtNumber(stateData.populacaoCenso)}</div>
                      <div className="sub">{stateData.municipios} municípios</div>
                    </div>

                    <div className="legend-box">
                      <span className="tag">Economia</span>
                      <div className="sub">PIB total</div>
                      <div className="big">R$ {stateData.pibTotalBilhoes} bi</div>
                      <div className="sub">R$ {fmtNumber(stateData.pibPerCapita)} per capita</div>
                    </div>

                    <div className="legend-box">
                      <span className="tag">Desenvolvimento</span>
                      <div className="sub">IDH estadual</div>
                      <div className="big">{stateData.idh.toFixed(3)}</div>
                      <div className="sub">{stateData.socialDemografia.expectativaVida} anos exp. vida</div>
                    </div>

                    <div className="legend-box">
                      <span className="tag">Geografia</span>
                      <div className="sub">Área territorial</div>
                      <div className="big">{fmtNumber(Math.round(stateData.areaKm2))} km²</div>
                      <div className="sub">
                        Densidade {(stateData.populacaoCenso / stateData.areaKm2).toFixed(1)} hab/km²
                      </div>
                    </div>
                  </div>
                )}
                <StateMusic stateUf={code} stateName={state.name} />
                <GeminiOut stateName={state.name} />
              </div>
            )}

            {/* ABA 2: ESTATÍSTICAS & ECONOMIA */}
            {activeTab === "indicators" && (
              <div className="tab active">
                <StateIndicatorsWidget stateCode={code} stateName={state.name} />
              </div>
            )}

            {/* ABA 3: CLIMA & PREVISÃO */}
            {activeTab === "weather" && (
              <div className="tab active">
                <StateWeatherWidget stateCode={code} stateName={state.name} />
              </div>
            )}

            {/* ABA 4: RÁDIOS AO VIVO */}
            {activeTab === "radios" && (
              <div className="tab active">
                <StateRadioPlayer stateCode={code} stateName={state.name} />
              </div>
            )}

            {/* ABA 5: FERIADOS */}
            {activeTab === "holidays" && (
              <div className="tab active">
                <StateHolidaysWidget stateCode={code} stateName={state.name} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default StateDetail;