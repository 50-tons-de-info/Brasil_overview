import { getCachedData, setCachedData } from "../utils/apiCache.js";

const RADIO_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas

const API_HOSTS = [
  "https://de1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
];

// Logos oficiais e verificados para as maiores redes e emissoras brasileiras
const KNOWN_RADIO_LOGOS = [
  { match: /oceano/i, logo: "https://cdn.instant.audio/images/logos/radiosaovivo-net/oceano-fm.png" },
  { match: /gaucha|gzh/i, logo: "https://gauchazh.clicrbs.com.br/static/icons/mstile-70x70.png" },
  { match: /atl[aâ]ntida/i, logo: "https://atl.clicrbs.com.br/favicon.ico" },
  { match: /pampa/i, logo: "http://www.radiopampa.com.br/favicon.ico" },
  { match: /antena\s*1/i, logo: "https://www.antena1.com.br/apple-touch-icon.png" },
  { match: /jovem\s*pan/i, logo: "https://jovempan.com.br/favicon.ico" },
  { match: /bandnews|bandeirantes|rede\s*band/i, logo: "https://www.band.uol.com.br/favicon.ico" },
  { match: /\bcbn\b/i, logo: "https://cbn.globo.com/favicon.ico" },
  { match: /mix\s*fm/i, logo: "https://radiomixfm.com.br/favicon.ico" },
  { match: /alpha\s*fm/i, logo: "https://alphafm.com.br/favicon.ico" },
  { match: /transam[eé]rica/i, logo: "https://radiotransamerica.com.br/favicon.ico" },
  { match: /massa\s*fm/i, logo: "https://massafm.com.br/favicon.ico" },
  { match: /itatiaia/i, logo: "https://www.itatiaia.com.br/favicon.ico" },
  { match: /bahia\s*fm/i, logo: "https://www.ibahia.com/favicon.ico" },
  { match: /marumby/i, logo: "https://radiomarumbifm.com.br/favicon.ico" },
  { match: /cai[cç]ara/i, logo: "https://radiocaiçara.com.br/favicon.ico" },
  { match: /92\s*fm/i, logo: "https://92radio.clicrbs.com.br/wp-content/uploads/2019/09/92_2-150x150.png" },
  { match: /cultura/i, logo: "https://cultura.uol.com.br/favicon.ico" },
  { match: /89|radio\s*rock/i, logo: "https://www.radiorock.com.br/favicon.ico" },
  { match: /piat[aã]/i, logo: "https://piatafm.com.br/favicon.ico" },
  { match: /itapoan/i, logo: "https://itapoanfm.com.br/favicon.ico" },
];

// Emissoras curadas de destaque regional por estado
const CURATED_STATE_RADIOS = {
  rs: [
    {
      id: "oceano-fm-971-rg",
      name: "Oceano FM 97.1 (Rio Grande)",
      streamUrl: "https://superaudio.radio.br/radio/8380/stream",
      homepage: "https://www.grupooceano.com.br",
      favicon: "https://cdn.instant.audio/images/logos/radiosaovivo-net/oceano-fm.png",
      tags: ["Pop", "Eclética", "Rio Grande"],
      votes: 4500,
      codec: "AAC",
      bitrate: "160 kbps",
      isOnline: true,
      state: "Rio Grande do Sul",
    },
  ],
};

// Mapeamento de normalização de termos de busca por estado
const STATE_SEARCH_VARIANTS = {
  ac: ["Acre", "AC"],
  al: ["Alagoas", "AL"],
  ap: ["Amapá", "Amapa", "AP"],
  am: ["Amazonas", "AM"],
  ba: ["Bahia", "BA"],
  ce: ["Ceará", "Ceara", "CE"],
  df: ["Distrito Federal", "Brasília", "DF"],
  es: ["Espírito Santo", "Espirito Santo", "ES"],
  go: ["Goiás", "Goias", "GO"],
  ma: ["Maranhão", "Maranhao", "MA"],
  mt: ["Mato Grosso", "MT"],
  ms: ["Mato Grosso do Sul", "MS"],
  mg: ["Minas Gerais", "MG"],
  pa: ["Pará", "Para", "PA"],
  pb: ["Paraíba", "Paraiba", "PB"],
  pr: ["Paraná", "Parana", "PR"],
  pe: ["Pernambuco", "PE"],
  pi: ["Piauí", "Piaui", "PI"],
  rj: ["Rio de Janeiro", "RJ"],
  rn: ["Rio Grande do Norte", "RN"],
  rs: ["Rio Grande do Sul", "RS"],
  ro: ["Rondônia", "Rondonia", "RO"],
  rr: ["Roraima", "RR"],
  sc: ["Santa Catarina", "SC"],
  sp: ["São Paulo", "Sao Paulo", "SP"],
  se: ["Sergipe", "SE"],
  to: ["Tocantins", "TO"],
};

/**
 * Normaliza o nome da rádio para chave raiz a fim de evitar duplicatas
 */
function getRadioRootKey(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(radio|fm|am|web|aovivo|live|oficial|digital|rede|station|brasil|brazil|streaming)\b/gi, "")
    .replace(/\b(porto alegre|salvador|sao paulo|rio de janeiro|belo horizonte|curitiba|recife|fortaleza|manaus|florianopolis|goiania|belem|vitoria|natal|campo grande|cuiaba|joao pessoa|maceio|teresina|aracaju|rio grande)\b/gi, "")
    .replace(/[\d,.]+\s*(fm|am|mhz|khz)?/gi, "")
    .replace(/[-–—/|()_]/g, " ")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Checa se duas chaves normalizadas representam a mesma emissora
 */
function isDuplicateStation(key1, key2) {
  if (!key1 || !key2) return false;
  if (key1 === key2) return true;
  const minLen = Math.min(key1.length, key2.length);
  if (minLen >= 4 && (key1.startsWith(key2) || key2.startsWith(key1))) {
    return true;
  }
  return false;
}

/**
 * Obtém o melhor logo para uma rádio (verificado ou favicon da API)
 */
function resolveStationLogo(name, apiFavicon) {
  for (const known of KNOWN_RADIO_LOGOS) {
    if (known.match.test(name)) {
      return known.logo;
    }
  }

  if (
    apiFavicon &&
    apiFavicon.startsWith("http") &&
    !apiFavicon.includes("facebook.com") &&
    !apiFavicon.includes("imgur.com")
  ) {
    return apiFavicon;
  }

  return null;
}

/**
 * Realiza a requisição com rotação automática entre servidores de fallback
 */
async function fetchWithFallback(endpoint) {
  for (const host of API_HOSTS) {
    try {
      const response = await fetch(`${host}${endpoint}`, {
        headers: {
          "User-Agent": "BrasilOverviewApp/1.0",
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Falha ao consultar ${host}, tentando próximo servidor...`, error);
    }
  }
  throw new Error("Não foi possível conectar aos servidores da Radio Browser API.");
}

/**
 * Limpa e formata as tags de gêneros musicais da rádio
 */
function processTags(rawTags) {
  if (!rawTags) return ["Variados"];

  const tags = rawTags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 1 && !t.includes("http") && !t.includes("www") && t !== "m3u8");

  if (tags.length === 0) return ["Variados"];

  const tagMap = {
    "mpb": "MPB",
    "pop": "Pop",
    "rock": "Rock",
    "sertanejo": "Sertanejo",
    "sertanejo raiz": "Sertanejo Raiz",
    "forro": "Forró",
    "forró": "Forró",
    "gaucha": "Tradicionalista",
    "gaúcha": "Tradicionalista",
    "nativista": "Nativista",
    "axe": "Axé",
    "axé": "Axé",
    "samba": "Samba",
    "pagode": "Pagode",
    "noticias": "Notícias",
    "notícias": "Notícias",
    "news": "Notícias",
    "futebol": "Futebol",
    "soccer": "Futebol",
    "talk": "Conversa",
    "gospel": "Gospel",
    "ecletic": "Eclética",
    "eclética": "Eclética",
    "adulta": "Adulto Contemporâneo",
  };

  const formatted = tags.map((t) => tagMap[t] || (t.charAt(0).toUpperCase() + t.slice(1)));
  return Array.from(new Set(formatted)).slice(0, 3);
}

/**
 * Trata o objeto de rádio recebido da API
 */
function transformStation(station) {
  const streamUrl = station.url_resolved || station.url;
  const name = (station.name || "Rádio Local").trim();
  const tags = processTags(station.tags);
  const bitrate = station.bitrate > 0 ? `${station.bitrate} kbps` : "Qualidade Padrão";
  
  let codec = station.codec && station.codec !== "UNKNOWN" ? station.codec : "Áudio Web";
  if (streamUrl && (streamUrl.includes(".m3u8") || station.hls === 1)) {
    codec = "HLS Live";
  }

  const favicon = resolveStationLogo(name, station.favicon);

  return {
    id: station.stationuuid || station.changeuuid || Math.random().toString(),
    name,
    streamUrl,
    homepage: station.homepage || null,
    favicon,
    tags,
    bitrate,
    codec,
    votes: station.votes || 0,
    state: station.state || "",
    isOnline: station.lastcheckok === 1,
  };
}

/**
 * Busca e trata as rádios de um estado específico, eliminando duplicatas e adicionando curadoria
 * @param {string} stateCode - Sigla do estado em minúsculo (ex: "rs", "ba", "sp")
 * @param {string} stateName - Nome do estado (ex: "Rio Grande do Sul")
 * @returns {Promise<Array>} Lista de rádios tratadas, únicas e ordenadas
 */
export async function fetchRadiosByState(stateCode, stateName) {
  const code = (stateCode || "").toLowerCase();
  const cacheKey = `radios_${code}`;
  const cachedRadios = getCachedData(cacheKey, RADIO_CACHE_TTL);
  if (cachedRadios) {
    return cachedRadios;
  }

  const searchVariants = STATE_SEARCH_VARIANTS[code] || [stateName];

  let rawStations = [];

  // 1. Inclui estações curadas de destaque para o estado se existirem (ex: Oceano FM no RS)
  const curated = CURATED_STATE_RADIOS[code] || [];

  // 2. Busca na API pelas variantes de termo do estado
  for (const query of searchVariants) {
    const endpoint = `/json/stations/search?countrycode=BR&state=${encodeURIComponent(
      query
    )}&hidebroken=true&order=votes&reverse=true&limit=30`;

    try {
      const data = await fetchWithFallback(endpoint);
      if (Array.isArray(data) && data.length > 0) {
        rawStations = [...rawStations, ...data];
        if (rawStations.length >= 15) break;
      }
    } catch (e) {
      console.error(`Erro ao buscar rádios para '${query}':`, e);
    }
  }

  // 3. Combina curadas com estações da API
  const allCandidateStations = [
    ...curated,
    ...rawStations.map((st) => transformStation(st)),
  ];

  // 4. Deduplicação inteligente por raiz do nome e por URL
  const seenRootKeys = [];
  const seenUrls = new Set();
  const uniqueStations = [];

  for (const st of allCandidateStations) {
    const url = st.streamUrl;
    if (!url || seenUrls.has(url)) continue;

    const rootKey = getRadioRootKey(st.name);
    const isDup = seenRootKeys.some((seenKey) => isDuplicateStation(seenKey, rootKey));

    if (!isDup) {
      seenRootKeys.push(rootKey);
      seenUrls.add(url);
      uniqueStations.push(st);
    }
  }

  const result = uniqueStations.slice(0, 8);
  setCachedData(cacheKey, result);
  return result;
}
