import { states } from "../data/states.js";

// Coordenadas das capitais brasileiras + Rio Grande (RS) para consulta instantânea
const PRESET_COORDINATES = {
  // Rio Grande do Sul
  "rio grande": { lat: -32.035, lon: -52.0986 },
  "porto alegre": { lat: -30.0346, lon: -51.2177 },
  "pelotas": { lat: -31.7699, lon: -52.341 },
  "caxias do sul": { lat: -29.1678, lon: -51.1794 },
  "santa maria": { lat: -29.6842, lon: -53.8069 },

  // Capitais
  "rio branco": { lat: -9.9753, lon: -67.8249 },
  "maceió": { lat: -9.6658, lon: -35.7351 },
  "maceio": { lat: -9.6658, lon: -35.7351 },
  "macapá": { lat: 0.0356, lon: -51.0705 },
  "macapa": { lat: 0.0356, lon: -51.0705 },
  "manaus": { lat: -3.119, lon: -60.0217 },
  "salvador": { lat: -12.9777, lon: -38.5016 },
  "fortaleza": { lat: -3.7319, lon: -38.5267 },
  "brasília": { lat: -15.7975, lon: -47.8919 },
  "brasilia": { lat: -15.7975, lon: -47.8919 },
  "vitória": { lat: -20.3155, lon: -40.3128 },
  "vitoria": { lat: -20.3155, lon: -40.3128 },
  "goiânia": { lat: -16.6869, lon: -49.2648 },
  "goiania": { lat: -16.6869, lon: -49.2648 },
  "são luís": { lat: -2.5307, lon: -44.3068 },
  "sao luis": { lat: -2.5307, lon: -44.3068 },
  "cuiabá": { lat: -15.601, lon: -56.0974 },
  "cuiaba": { lat: -15.601, lon: -56.0974 },
  "campo grande": { lat: -20.4697, lon: -54.6201 },
  "belo horizonte": { lat: -19.9167, lon: -43.9345 },
  "belém": { lat: -1.4558, lon: -48.4902 },
  "belem": { lat: -1.4558, lon: -48.4902 },
  "joão pessoa": { lat: -7.1195, lon: -34.845 },
  "joao pessoa": { lat: -7.1195, lon: -34.845 },
  "curitiba": { lat: -25.429, lon: -49.2671 },
  "recife": { lat: -8.0476, lon: -34.877 },
  "teresina": { lat: -5.092, lon: -42.8038 },
  "rio de janeiro": { lat: -22.9068, lon: -43.1729 },
  "natal": { lat: -5.7945, lon: -35.211 },
  "porto velho": { lat: -8.7612, lon: -63.9039 },
  "boa vista": { lat: 2.8235, lon: -60.6758 },
  "florianópolis": { lat: -27.5954, lon: -48.548 },
  "florianopolis": { lat: -27.5954, lon: -48.548 },
  "são paulo": { lat: -23.5505, lon: -46.6333 },
  "sao paulo": { lat: -23.5505, lon: -46.6333 },
  "aracaju": { lat: -10.9472, lon: -37.0731 },
  "palmas": { lat: -10.2491, lon: -48.3243 },
};

/**
 * Tradução dos códigos meteorológicos WMO
 */
const WMO_CODES = {
  0: { label: "Céu limpo", icon: "sun" },
  1: { label: "Predominantemente limpo", icon: "sun-cloud" },
  2: { label: "Parcialmente nublado", icon: "cloud-sun" },
  3: { label: "Encoberto", icon: "cloud" },
  45: { label: "Nevoeiro", icon: "fog" },
  48: { label: "Nevoeiro com geada", icon: "fog" },
  51: { label: "Garoa leve", icon: "rain-light" },
  53: { label: "Garoa moderada", icon: "rain" },
  55: { label: "Garoa intensa", icon: "rain-heavy" },
  61: { label: "Chuva fraca", icon: "rain-light" },
  63: { label: "Chuva moderada", icon: "rain" },
  65: { label: "Chuva forte", icon: "rain-heavy" },
  71: { label: "Neve fraca", icon: "snow" },
  73: { label: "Neve moderada", icon: "snow" },
  75: { label: "Neve forte", icon: "snow" },
  80: { label: "Pancadas de chuva leves", icon: "rain-shower" },
  81: { label: "Pancadas de chuva", icon: "rain-shower" },
  82: { label: "Pancadas de chuva violentas", icon: "rain-heavy" },
  95: { label: "Tempestade com trovoadas", icon: "thunderstorm" },
  96: { label: "Tempestade com granizo leve", icon: "thunderstorm" },
  99: { label: "Tempestade com granizo forte", icon: "thunderstorm" },
};

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Classifica o índice UV de acordo com a OMS
 */
function getUVClassification(uv) {
  if (uv < 3) return { label: "Baixo", level: "low" };
  if (uv < 6) return { label: "Moderado", level: "moderate" };
  if (uv < 8) return { label: "Alto", level: "high" };
  if (uv < 11) return { label: "Muito Alto", level: "very-high" };
  return { label: "Extremo", level: "extreme" };
}

/**
 * Obtém as coordenadas de uma cidade (pré-mapeada ou via Geocoding API)
 */
export async function getCityCoordinates(cityName, uf) {
  const normalized = (cityName || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (PRESET_COORDINATES[normalized]) {
    return PRESET_COORDINATES[normalized];
  }

  // Geocodificação dinâmica para qualquer outra cidade do Brasil
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=5&language=pt&country_code=BR`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Tenta achar na mesma UF se fornecida
        let match = data.results[0];
        if (uf) {
          const ufUpper = uf.toUpperCase();
          const found = data.results.find(
            (r) =>
              r.admin1?.toUpperCase().includes(ufUpper) ||
              r.admin2?.toUpperCase().includes(ufUpper)
          );
          if (found) match = found;
        }
        return { lat: match.latitude, lon: match.longitude };
      }
    }
  } catch (err) {
    console.warn(`Erro na geocodificação de ${cityName}:`, err);
  }

  // Fallback para coordenadas padrão de Rio Grande ou São Paulo
  return { lat: -32.035, lon: -52.0986 };
}

/**
 * Busca dados climáticos atuais e previsão de 7 dias via Open-Meteo API
 */
export async function fetchStateWeather(stateCode, cityName) {
  const code = (stateCode || "").toLowerCase();
  const stateMeta = states[code];
  const targetCity =
    cityName || (code === "rs" ? "Rio Grande" : stateMeta?.capital || "Porto Alegre");

  const coords = await getCityCoordinates(targetCity, stateMeta?.uf);

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=America%2FSao_Paulo&forecast_days=7`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Não foi possível obter os dados meteorológicos.");
  }

  const raw = await response.json();

  // 1. Tratamento dos dados Atuais
  const current = raw.current;
  const weatherInfo = WMO_CODES[current.weather_code] || {
    label: "Parcialmente nublado",
    icon: "cloud-sun",
  };
  const todayUv = raw.daily?.uv_index_max?.[0] || 0;
  const uvClass = getUVClassification(todayUv);

  const sunrise = raw.daily?.sunrise?.[0] ? raw.daily.sunrise[0].split("T")[1] : "--:--";
  const sunset = raw.daily?.sunset?.[0] ? raw.daily.sunset[0].split("T")[1] : "--:--";

  const currentTreated = {
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    precipitation: current.precipitation,
    isDay: current.is_day === 1,
    weatherCode: current.weather_code,
    condition: weatherInfo.label,
    icon: weatherInfo.icon,
    uvIndex: todayUv,
    uvLabel: uvClass.label,
    uvLevel: uvClass.level,
    sunrise,
    sunset,
    cityName: targetCity,
    stateUf: stateMeta?.uf || code.toUpperCase(),
  };

  // 2. Tratamento da previsão diária de 7 dias
  const daily = raw.daily;
  const forecastTreated = daily.time.map((dateStr, idx) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const isToday = idx === 0;
    const weekdayLabel = isToday ? "Hoje" : WEEKDAYS_SHORT[date.getDay()];
    const dayWeather = WMO_CODES[daily.weather_code[idx]] || {
      label: "Parcialmente nublado",
      icon: "cloud-sun",
    };

    return {
      date: `${day}/${month}`,
      weekday: weekdayLabel,
      isToday,
      condition: dayWeather.label,
      icon: dayWeather.icon,
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      rainProb: daily.precipitation_probability_max[idx] ?? 0,
      uvMax: daily.uv_index_max[idx] ?? 0,
    };
  });

  return {
    cityName: targetCity,
    current: currentTreated,
    forecast: forecastTreated,
  };
}
