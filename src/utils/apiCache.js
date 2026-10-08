/**
 * Sistema de Cache Inteligente e Persistente com Time-To-Live (TTL)
 * Utiliza Memória + LocalStorage com expiração automática
 */

const memoryCache = new Map();
const CACHE_PREFIX = "br_overview_cache_";

/**
 * Recupera dados em cache se ainda estiverem válidos dentro do tempo de vida (TTL)
 * @param {string} key - Chave única do recurso (ex: "ibge_stats_rs")
 * @param {number} ttlMs - Tempo de vida útil em milissegundos
 * @returns {any|null} Dados em cache ou null se expirado/inexistente
 */
export function getCachedData(key, ttlMs) {
  const fullKey = CACHE_PREFIX + key;
  const now = Date.now();

  // 1. Checa memória primeiro (mais rápido)
  if (memoryCache.has(fullKey)) {
    const item = memoryCache.get(fullKey);
    if (now - item.timestamp < ttlMs) {
      return item.data;
    }
    memoryCache.delete(fullKey);
  }

  // 2. Checa localStorage (persiste entre F5 e sessões)
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(fullKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (now - parsed.timestamp < ttlMs) {
          // Atualiza na memória para acessos subsequentes rápidos
          memoryCache.set(fullKey, parsed);
          return parsed.data;
        }
        window.localStorage.removeItem(fullKey);
      }
    }
  } catch (error) {
    console.warn(`Erro ao ler cache do localStorage para ${key}:`, error);
  }

  return null;
}

/**
 * Armazena dados no cache em memória e no localStorage com timestamp atual
 * @param {string} key - Chave única
 * @param {any} data - Dados a serem armazenados
 */
export function setCachedData(key, data) {
  const fullKey = CACHE_PREFIX + key;
  const item = {
    data,
    timestamp: Date.now(),
  };

  // Salva na memória
  memoryCache.set(fullKey, item);

  // Salva no localStorage
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(fullKey, JSON.stringify(item));
    }
  } catch (error) {
    console.warn(`Erro ao gravar cache no localStorage para ${key}:`, error);
  }
}

/**
 * Limpa chaves de cache antigas ou expiradas
 */
export function clearAllCache() {
  memoryCache.clear();
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          window.localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn("Erro ao limpar cache:", error);
  }
}
