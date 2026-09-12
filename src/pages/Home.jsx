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
    const stateName = states[hoveredStateCode]?.name;

    if (stateName) {
      getFlagFromWiki(stateName).then(flagUrl => {
        if (isMounted) setHoveredFlag(flagUrl);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [hoveredStateCode]);

  const hoveredStateName = hoveredStateCode ? states[hoveredStateCode]?.name.replace(/\s*\(.*?\)/, "") : null;

  return (
    <main
      className="home-page"
      style={{
        backgroundImage: `url(${bgTexture})`,
        backgroundRepeat: "repeat",
        backgroundColor: "rgb(136, 125, 108)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${paper})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "90px",
        }}
      >
        <div
          style={{
            /* 👇 AQUI VOCÊ POSICIONA O BLOCO INTEIRO (TÍTULO + BANDEIRA) 👇 */
            position: "absolute",
            top: "270px",   // Movimenta para cima/baixo
            left: "785px",  // Movimenta para esquerda/direita (ajuste até ficar perfeito)
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Garante que a bandeira fique no meio do texto
          }}
        >
          
          <h1 className="Titulo_topo" style={{ margin: 0, textAlign: "center" }}>
            Overview dos estados brasileiros
          </h1>
          
          {hoveredStateName && (
            <div 
              style={{ 
                /* 👇 AQUI VOCÊ AJUSTA O ESPAÇAMENTO ENTRE O TÍTULO E A BANDEIRA 👇 */
                marginTop: "80px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center" 
              }}
            >
              {hoveredFlag ? (
                <img 
                  src={hoveredFlag} 
                  alt={`Bandeira de ${hoveredStateName}`} 
                  style={{ width: "500px", borderRadius: "25px", boxShadow: "0 6px 12px rgba(0,0,0,0.15)" }} 
                />
              ) : (
                <div style={{ width: "250px", height: "166px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: "#555" }}>
                  Carregando...
                </div>
              )}
              <h2 className="Nome_Estado" style={{ margin: 0, marginTop: "15px" }}>
                {hoveredStateName}
              </h2>
            </div>
          )}
        </div>

        <div
          style={{
            position: "relative",
            top: "300px",       // ↑↓ positivo desce, negativo sobe
            left: "-380px",       // ←→ positivo vai pra direita, negativo pra esquerda
            transform: "scale(2.08)", // tamanho
          }}
        >
          <MapBrazil onStateHover={setHoveredStateCode} />
        </div>
      </div>
    </main>
  );
}

export default Home;