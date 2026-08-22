import { useParams, useNavigate } from "react-router-dom";
import { states } from "../data/states";
import { IBGE_STATE_DATA } from "../data/ibgeData";
import StateResume from "../components/StateResume";
import StateIndicatorsWidget from "../components/StateIndicatorsWidget";
import StateWeatherWidget from "../components/StateWeatherWidget";
import StateRadioPlayer from "../components/StateRadioPlayer";
import StateHolidaysWidget from "../components/StateHolidaysWidget";

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const state = states[code?.toLowerCase()];
  const stateData = IBGE_STATE_DATA[code?.toLowerCase()];

  // teste de como vai ficar a aparencia
  const tamplet = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px", textAlign: "left", boxSizing: "border-box" }}>
      <button
        style={{
          background: "transparent",
          border: "1px solid var(--border, #e5e4e7)",
          color: "var(--text, #6b6375)",
          padding: "6px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "24px",
          fontSize: "13px",
          fontWeight: 500
        }}
        onClick={() => navigate("/")}
      >
        ← Voltar ao mapa
      </button>

      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "36px", letterSpacing: "-0.5px" }}>
          {state.name} <span style={{ fontSize: "20px", color: "var(--text, #888)", fontWeight: 400 }}>{state.uf}</span>
        </h1>
        {stateData && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            <span style={{ fontSize: "12px", padding: "4px 10px", background: "var(--code-bg, #f3f4f6)", borderRadius: "16px", color: "var(--text-h, #111)", fontWeight: 500, border: "1px solid var(--border, #e5e4e7)" }}>
              📍 Capital: {state.capital}
            </span>
            <span style={{ fontSize: "12px", padding: "4px 10px", background: "var(--code-bg, #f3f4f6)", borderRadius: "16px", color: "var(--text-h, #111)", fontWeight: 500, border: "1px solid var(--border, #e5e4e7)" }}>
              👥 Gentílico: {stateData.gentilico.split("/")[0].trim()}
            </span>
            <span style={{ fontSize: "12px", padding: "4px 10px", background: "var(--code-bg, #f3f4f6)", borderRadius: "16px", color: "var(--text-h, #111)", fontWeight: 500, border: "1px solid var(--border, #e5e4e7)" }}>
              🌿 Bioma: {stateData.biomaPrincipal}
            </span>
          </div>
        )}
      </header>
      
      {/* Resumo do Estado */}
      <section style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        <StateResume
          title={state.name}
          resume={tamplet}
        />
      </section>

      {/* Indicadores Oficiais IBGE */}
      <StateIndicatorsWidget stateCode={code} stateName={state.name} />

      {/* Condições Climáticas & Previsão */}
      <StateWeatherWidget stateCode={code} stateName={state.name} />

      {/* Rádios ao Vivo */}
      <StateRadioPlayer stateCode={code} stateName={state.name} />

      {/* Calendário & Feriados */}
      <StateHolidaysWidget stateCode={code} stateName={state.name} />
    </div>
  );
}

export default StateDetail;
