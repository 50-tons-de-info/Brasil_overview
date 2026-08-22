import { useState, useEffect } from "react";
import { states_resume } from "../services/wikipediaAPI";
import { wiki_response } from "../mappers/processWiki";

export function useWikipedia(titulo) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!titulo) return;

    setCarregando(true);
    states_resume(titulo)
      .then((raw) => setDados(wiki_response(raw)))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [titulo]);

  return { dados, carregando, erro };
}