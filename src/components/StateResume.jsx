import { useWikipedia } from "../hooks/useWiki";

export default function StateResume({ title, wikiTitle, fallbackResume }) {
  const queryTitle = wikiTitle || title;
  const { dados, carregando } = useWikipedia(queryTitle);

  const defaultFallback =
    fallbackResume ||
    "O estado possui papel fundamental na formação socioeconômica, cultural e histórica do Brasil. Com forte dinamismo produtivo, rica herança cultural e biodiversidade exuberante, destaca-se regional e nacionalmente em múltiplos setores da economia, turismo e desenvolvimento humano.";

  const textContent = dados?.resumo || defaultFallback;
  const wikiUrl = dados?.linkCompleto || `https://pt.wikipedia.org/wiki/${encodeURIComponent(queryTitle)}`;

  return (
    <div className="geral-top">
      {dados?.imagem && (
        <div className="escutcheon">
          <img
            src={dados.imagem}
            alt={`Bandeira / Escudo de ${title}`}
            className="escutcheon-img"
          />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {carregando && !dados ? (
          <p className="lede" style={{ marginTop: 0, fontStyle: "italic", opacity: 0.7 }}>
            Carregando resumo histórico e enciclopédico de {title}...
          </p>
        ) : (
          <>
            <p className="lede wiki-summary" style={{ marginTop: 0 }}>
              {textContent}
            </p>
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-out"
              style={{ display: "inline-block", marginTop: "8px", textDecoration: "none" }}
            >
              Ler artigo completo na Wikipedia ↗
            </a>
          </>
        )}
      </div>
    </div>
  );
}