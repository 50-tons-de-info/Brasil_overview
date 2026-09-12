import { states_resume } from "../services/wikipediaAPI";

export async function getFlagFromWiki(title) {
  try {
    const raw = await states_resume(title);
    return raw.originalimage?.source || raw.thumbnail?.source || null;
  } catch (error) {
    console.error(`Erro ao buscar bandeira para ${title}:`, error);
    return null;
  }
}
