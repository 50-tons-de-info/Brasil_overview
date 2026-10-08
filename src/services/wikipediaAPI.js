import { getCachedData, setCachedData } from "../utils/apiCache.js";

const WIKI_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias
const wikipedia_api = "https://pt.wikipedia.org/api/rest_v1/page/summary/";

export async function states_resume(title) {
  if (!title) return null;

  const cacheKey = `wiki_summary_${encodeURIComponent(title)}`;
  const cached = getCachedData(cacheKey, WIKI_CACHE_TTL);
  if (cached) {
    return cached;
  }

  const url = `${wikipedia_api}${encodeURIComponent(title)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados da Wikipedia para "${title}"`);
  }

  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}