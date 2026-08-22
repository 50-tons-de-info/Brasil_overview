import { useState } from 'react';
import { output_prompt_html } from '../mappers/processGemini';

export function useGemini() {
  const [history, setHistory] = useState({ dataHtml: null, loading: false, error: null });
  const [culture, setCulture] = useState({ dataHtml: null, loading: false, error: null });
  const [tourism, setTourism] = useState({ dataHtml: null, loading: false, error: null });

  // Busca a História (Prompt 1)
  const fetchHistory = async (stateName) => {
    setHistory({ dataHtml: null, loading: true, error: null });
    try {
      const result = await output_prompt_html(1, stateName);
      setHistory({ dataHtml: result, loading: false, error: null });
    } catch (err) {
      setHistory({ dataHtml: null, loading: false, error: err.message });
    }
  };

  // Busca a Cultura (Prompt 2)
  const fetchCulture = async (stateName) => {
    setCulture({ dataHtml: null, loading: true, error: null });
    try {
      const result = await output_prompt_html(2, stateName);
      setCulture({ dataHtml: result, loading: false, error: null });
    } catch (err) {
      setCulture({ dataHtml: null, loading: false, error: err.message });
    }
  };

  // Busca os Pontos Turísticos (Prompt 3)
  const fetchTourism = async (stateName) => {
    setTourism({ dataHtml: null, loading: true, error: null });
    try {
      const result = await output_prompt_html(3, stateName);
      setTourism({ dataHtml: result, loading: false, error: null });
    } catch (err) {
      setTourism({ dataHtml: null, loading: false, error: err.message });
    }
  };

  return {
    history, fetchHistory,
    culture, fetchCulture,
    tourism, fetchTourism
  };
}
