import { useParams, useNavigate } from "react-router-dom";
import { states } from "../data/states";
import StateResume from "../components/StateResume";
import StateMusic from "../components/StateMusic";

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const state = states[code];

  // teste de como vai ficar a aparencia
  const tamplet = "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  if (!state) {
    return <div>State not found</div>;
  }

  return (
    <div className="state-music">
      <h1>{state.name}</h1>
      
      <div className="state-detail-columns">
        <StateMusic stateUf={code} stateName={state.name} />
        
        <div className="state-main-content">
          <StateResume
            title={state.name}
            resume={tamplet}
          />
          <button onClick={() => navigate("/")} style={{ marginTop: '20px' }}>Back to Map</button>
        </div>
      </div>
    </div>
  );
}

export default StateDetail;
