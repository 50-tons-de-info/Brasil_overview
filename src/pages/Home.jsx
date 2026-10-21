import { useState, useEffect } from "react";
import bgTexture from "../assets/textures/stone2.jpg";
import paper from "../assets/textures/medieval.png";
import MapBrazil from "../components/MapBrazil";
import { getFlagFromWiki } from "../mappers/getFlags";
import { states } from "../data/states";
import "./Home.css";

function Home() {
  const [hoveredStateCode, setHoveredStateCode] = useState(null);
  const [hoveredFlag, setHoveredFlag] = useState(null);

  useEffect(() => {
    if (!hoveredStateCode) {
      setHoveredFlag(null);
      return;
    }

    let isMounted = true;
    const stateName = states[hoveredStateCode]?.wikiTitle || states[hoveredStateCode]?.name;

    if (stateName) {
      getFlagFromWiki(stateName).then((flagUrl) => {
        if (isMounted) setHoveredFlag(flagUrl);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [hoveredStateCode]);

  const hoveredStateName = hoveredStateCode
    ? states[hoveredStateCode]?.name.replace(/\s*\(.*?\)/, "")
    : null;

  return (
    <main
      className="home-page"
      style={{ backgroundImage: `url(${bgTexture})` }}
    >
      <div className="home-stage" style={{ backgroundImage: `url(${paper})` }}>
        <div className="home-map-slot">
          <MapBrazil onStateHover={setHoveredStateCode} />
        </div>

        <div className="home-info">
          <h1 className="Titulo_topo">Overview dos estados brasileiros</h1>

          {hoveredStateName && (
            <div className="home-flag-box">
              {hoveredFlag ? (
                <img
                  className="home-flag"
                  src={hoveredFlag}
                  alt={`Bandeira de ${hoveredStateName}`}
                />
              ) : (
                <div className="home-flag-loading">Carregando...</div>
              )}
              <h2 className="Nome_Estado">{hoveredStateName}</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;