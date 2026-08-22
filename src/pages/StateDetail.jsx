import { useParams, Link } from "react-router-dom";
import { states } from "../data/states";
import { useWikipedia } from "../hooks/useWiki";

function StateDetail() {
  const { code } = useParams();
  const stateData = states[code];
  const stateName = stateData ? stateData.name : "";

  // Chama o hook passando o nome do estado
  const { dados, carregando, erro } = useWikipedia(stateName);

  if (!stateData) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Estado não encontrado.</h2>
        <Link to="/">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header>
        <Link to="/" style={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold", fontSize: "1.1rem" }}>
          &larr; Voltar para o Mapa
        </Link>
      </header>
      
      <article style={{ marginTop: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#333" }}>{stateName}</h1>

        {carregando && (
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            Carregando informações da Wikipedia...
          </p>
        )}
        
        {erro && (
          <p style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "15px", borderRadius: "8px" }}>
            <strong>Ocorreu um erro:</strong> {erro}
          </p>
        )}

        {dados && !carregando && (
          <div style={{ backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            {dados.imagem && (
              <img 
                src={dados.imagem} 
                alt={`Imagem de ${dados.titulo}`} 
                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", marginBottom: "20px", objectFit: "cover" }} 
              />
            )}
            
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#444" }}>
              {dados.resumo}
            </p>
            
            {dados.linkCompleto && (
              <a 
                href={dados.linkCompleto} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: "20px", color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}
              >
                Ler artigo completo na Wikipedia &rarr;
              </a>
            )}
          </div>
        )}
      </article>
    </main>
  );
}

export default StateDetail;
