const memoryCache = new Map();
const CACHE_PREFIX = "br_overview_cache_";

export function getCachedData(key, ttlMs) {
  const fullKey = CACHE_PREFIX + key;
  const now = Date.now();

  if (memoryCache.has(fullKey)) {
    const item = memoryCache.get(fullKey);
    if (now - item.timestamp < ttlMs) {
      return item.data;
    }
    memoryCache.delete(fullKey);
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(fullKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (now - parsed.timestamp < ttlMs) {
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

export function setCachedData(key, data) {
  const fullKey = CACHE_PREFIX + key;
  const item = {
    data,
    timestamp: Date.now(),
  };

  memoryCache.set(fullKey, item);

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(fullKey, JSON.stringify(item));
    }
  } catch (error) {
    console.warn(`Erro ao gravar cache no localStorage para ${key}:`, error);
  }
}

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

