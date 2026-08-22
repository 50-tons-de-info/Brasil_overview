import { STATE_HOLIDAYS } from "../data/regionalHolidays.js";
import { states } from "../data/states.js";
import { getCachedData, setCachedData } from "../utils/apiCache.js";

const MUNICIPALITIES_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias
const HOLIDAYS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Busca todos os municípios de uma UF via API oficial do IBGE
 */
export async function fetchStateMunicipalities(uf) {
  const ufUpper = (uf || "").toUpperCase();
  const cacheKey = `ibge_municipalities_${ufUpper}`;
  const cached = getCachedData(cacheKey, MUNICIPALITIES_CACHE_TTL);
  if (cached) {
    return cached;
  }

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufUpper}/municipios`,
      { headers: { "User-Agent": "BrasilOverviewApp/1.0" } }
    );
    if (res.ok) {
      const data = await res.json();
      const names = data.map((m) => m.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
      setCachedData(cacheKey, names);
      return names;
    }
  } catch (error) {
    console.warn(`Falha ao buscar municípios do IBGE para ${ufUpper}:`, error);
  }

  return [];
}

/**
 * Retorna o dia da semana para uma data no formato YYYY-MM-DD
 */
function getWeekdayName(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return WEEKDAYS[date.getDay()];
}

/**
 * Calcula a diferença em dias entre hoje e a data do feriado
 */
function calculateDaysRemaining(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const holidayDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = holidayDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formata data para exibição (ex: "20/09")
 */
function formatDisplayDate(dateString) {
  const [, month, day] = dateString.split("-");
  return `${day}/${month}`;
}

/**
 * Busca os feriados nacionais via BrasilAPI e agrega com feriados estaduais e municipais
 */
export async function fetchStateHolidays(stateCode, customYear) {
  const year = customYear || new Date().getFullYear();
  const code = (stateCode || "").toLowerCase();
  const stateMeta = states[code];
  const uf = stateMeta?.uf || code.toUpperCase();

  // Define a cidade padrão: Rio Grande para RS, capital para os demais
  const defaultCity = code === "rs" ? "Rio Grande" : stateMeta?.capital || "Capital";

  const nationalCacheKey = `brasilapi_holidays_${year}`;
  let nationalHolidays = getCachedData(nationalCacheKey, HOLIDAYS_CACHE_TTL);

  if (!nationalHolidays) {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      });

      if (response.ok) {
        nationalHolidays = await response.json();
        setCachedData(nationalCacheKey, nationalHolidays);
      }
    } catch (error) {
      console.warn("Falha ao buscar feriados nacionais na BrasilAPI, usando fallback...", error);
    }
  }

  if (!nationalHolidays || nationalHolidays.length === 0) {
    nationalHolidays = [
      { date: `${year}-01-01`, name: "Confraternização Universal", type: "national" },
      { date: `${year}-04-21`, name: "Tiradentes", type: "national" },
      { date: `${year}-05-01`, name: "Dia do Trabalho", type: "national" },
      { date: `${year}-09-07`, name: "Independência do Brasil", type: "national" },
      { date: `${year}-10-12`, name: "Nossa Senhora Aparecida", type: "national" },
      { date: `${year}-11-02`, name: "Finados", type: "national" },
      { date: `${year}-11-15`, name: "Proclamação da República", type: "national" },
      { date: `${year}-11-20`, name: "Dia da Consciência Negra", type: "national" },
      { date: `${year}-12-25`, name: "Natal", type: "national" },
    ];
  }

  // 1. Trata os feriados nacionais
  const treatedNationals = nationalHolidays.map((h) => {
    const daysRemaining = calculateDaysRemaining(h.date);
    return {
      id: `nat-${h.date}-${h.name}`,
      date: h.date,
      displayDate: formatDisplayDate(h.date),
      month: parseInt(h.date.split("-")[1], 10),
      monthName: MONTHS[parseInt(h.date.split("-")[1], 10) - 1],
      name: h.name,
      type: "national",
      typeLabel: "Nacional",
      city: null,
      weekday: h.weekday || getWeekdayName(h.date),
      daysRemaining,
      isToday: daysRemaining === 0,
      isPast: daysRemaining < 0,
    };
  });

  // 2. Trata os feriados estaduais e municipais
  const regionalList = STATE_HOLIDAYS[code] || [];
  const treatedRegionals = regionalList.map((r) => {
    const fullDate = `${year}-${r.monthDay}`;
    const daysRemaining = calculateDaysRemaining(fullDate);
    const typeLabel = r.type === "state" ? "Estadual" : `Municipal • ${r.city || ""}`;

    return {
      id: `reg-${fullDate}-${r.name}`,
      date: fullDate,
      displayDate: formatDisplayDate(fullDate),
      month: parseInt(r.monthDay.split("-")[0], 10),
      monthName: MONTHS[parseInt(r.monthDay.split("-")[0], 10) - 1],
      name: r.name,
      type: r.type,
      typeLabel,
      city: r.city || null,
      weekday: getWeekdayName(fullDate),
      daysRemaining,
      isToday: daysRemaining === 0,
      isPast: daysRemaining < 0,
    };
  });

  // 3. Mescla e ordena cronologicamente
  const allHolidays = [...treatedNationals, ...treatedRegionals];
  allHolidays.sort((a, b) => a.date.localeCompare(b.date));

  // 4. Busca todos os municípios do estado via IBGE
  const ibgeMunicipalities = await fetchStateMunicipalities(uf);

  // 5. Cidades com feriados específicos cadastrados
  const registeredCitiesSet = new Set();
  regionalList.forEach((r) => {
    if (r.type === "municipal" && r.city) {
      r.city.split("/").forEach((c) => {
        const trimmed = c.trim();
        if (trimmed) registeredCitiesSet.add(trimmed);
      });
    }
  });

  // Garante que a defaultCity e a capital estejam na lista se não vier do IBGE
  if (defaultCity) registeredCitiesSet.add(defaultCity);
  if (stateMeta?.capital) registeredCitiesSet.add(stateMeta.capital);

  // Lista combinada de cidades (todas as do IBGE + registradas)
  const allCities = Array.from(
    new Set([...Array.from(registeredCitiesSet), ...ibgeMunicipalities])
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  return {
    year,
    holidays: allHolidays,
    defaultCity,
    allCities,
    totalCount: allHolidays.length,
    nationalCount: treatedNationals.length,
    regionalCount: treatedRegionals.length,
  };
}
