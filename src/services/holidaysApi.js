import { STATE_HOLIDAYS } from "../data/regionalHolidays.js";

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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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

  let nationalHolidays = [];

  try {
    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`, {
      headers: { "User-Agent": "BrasilOverviewApp/1.0" },
    });

    if (response.ok) {
      nationalHolidays = await response.json();
    }
  } catch (error) {
    console.warn("Falha ao buscar feriados nacionais na BrasilAPI, usando fallback...", error);
    // Fallback de feriados fixos nacionais
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

  // 4. Identifica o próximo feriado iminente
  const upcomingHolidays = allHolidays.filter((h) => h.daysRemaining >= 0);
  const nextHoliday = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

  return {
    year,
    holidays: allHolidays,
    nextHoliday,
    totalCount: allHolidays.length,
    nationalCount: treatedNationals.length,
    regionalCount: treatedRegionals.length,
  };
}
