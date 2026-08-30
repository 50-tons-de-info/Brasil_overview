import { useWikipedia } from "../hooks/useWiki";

export default function StateResume({ title, wikiTitle, fallbackResume }) {
  const queryTitle = wikiTitle || title;
  const { dados, carregando, erro } = useWikipedia(queryTitle);

  const defaultFallback =
    fallbackResume ||
    "O estado possui papel fundamental na formação socioeconômica, cultural e histórica do Brasil. Com forte dinamismo produtivo, rica herança cultural e biodiversidade exuberante, destaca-se regional e nacionalmente em múltiplos setores da economia, turismo e desenvolvimento humano.";

  return (
    <div className="state-resume-box">
      <div className="state-resume-header">
        <h3 className="state-resume-title">Sobre {title || "o Estado"}</h3>
        <span className="state-resume-badge">Wikipedia API</span>
      </div>

      {carregando && !dados && (
        <p className="state-resume-loading">Carregando resumo enciclopédico...</p>
      )}

      {erro && !dados && (
        <p className="state-resume-text">{defaultFallback}</p>
      )}

      {dados && (
        <div className="state-resume-body">
          {dados.imagem && (
            <div className="state-resume-image-wrapper">
              <img
                src={dados.imagem}
                alt={`Bandeira ou símbolo de ${title}`}
                className="state-resume-flag-img"
              />
            </div>
          )}

          <p className="state-resume-text">{dados.resumo || defaultFallback}</p>

          {dados.linkCompleto && (
            <a
              href={dados.linkCompleto}
              target="_blank"
              rel="noopener noreferrer"
              className="state-resume-wiki-link"
            >
              Ler artigo completo na Wikipedia ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}