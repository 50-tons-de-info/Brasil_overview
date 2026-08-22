import { useWikipedia } from "../hooks/useWiki";

function EstadoDetalhe() {
  const { dados, carregando, erro } = useWikipedia("Bahia");

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div>
      <h1>{dados.titulo}</h1>
      {dados.imagem && <img src={dados.imagem} alt={dados.titulo} />}
      <p>{dados.resumo}</p>
      <a href={dados.linkCompleto} target="_blank" rel="noreferrer">
        Ler mais na Wikipedia
      </a>
    </div>
  );
}