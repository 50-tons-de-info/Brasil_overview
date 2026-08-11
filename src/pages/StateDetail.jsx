import { useParams, useNavigate } from "react-router-dom";
import { states } from "../data/states";

function StateDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const state = states[code];

  if (!state) {
    return <div>State not found</div>;
  }

  return (
    <div>
      <h1>{state.name}</h1>
      <button onClick={() => navigate("/")}>Back to Map</button>
    </div>
  );
}

export default StateDetail;
