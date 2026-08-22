import { useParams, useNavigate } from "react-router-dom";
import { states } from "../data/states";
import StateResume from "../components/StateResume";
import StateRadioPlayer from "../components/StateRadioPlayer";

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const state = states[code?.toLowerCase()];

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

      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "36px", letterSpacing: "-0.5px" }}>
          {state.name} <span style={{ fontSize: "20px", color: "var(--text, #888)", fontWeight: 400 }}>{state.uf}</span>
        </h1>
      </header>
      
      {/* Resumo do Estado */}
      <section style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        <StateResume
          title={state.name}
          resume={tamplet}
        />
      </section>

      {/* Rádios ao Vivo */}
      <StateRadioPlayer stateCode={code} stateName={state.name} />
    </div>
  );
}

export default StateDetail;
