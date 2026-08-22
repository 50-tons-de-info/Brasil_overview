import { useState, useEffect } from "react";
import { fetchStateWeather } from "../services/weatherApi";
import { fetchStateMunicipalities } from "../services/holidaysApi";
import { states } from "../data/states";
import "./StateWeatherWidget.css";

function WeatherIcon({ name, isDay = true, size = 24 }) {
  switch (name) {
    case "sun":
      return isDay ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <circle cx="12" cy="12" r="5" fill="#fef3c7" />
          <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
          <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
          <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#f1f5f9" />
        </svg>
      );

    case "sun-cloud":
    case "cloud-sun":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41" stroke="#f59e0b" strokeLinecap="round" />
          <circle cx="12" cy="8" r="3" fill="#fef3c7" stroke="#f59e0b" />
          <path
            d="M19 17.5a4.5 4.5 0 0 0-3.5-4.4 6 6 0 0 0-11 2.4A4.5 4.5 0 0 0 5 20h13.5a3.5 3.5 0 0 0 .5-7z"
            fill="var(--code-bg, #e2e8f0)"
            stroke="var(--text-h, #334155)"
          />
        </svg>
      );

    case "cloud":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-h, #334155)" strokeWidth="2">
          <path
            d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"
            fill="var(--code-bg, #e2e8f0)"
          />
        </svg>
      );

    case "rain-light":
    case "rain":
    case "rain-shower":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M17.5 14H9a5 5 0 1 1 4.79-6.42A3.5 3.5 0 1 1 17.5 14z"
            fill="var(--code-bg, #e2e8f0)"
            stroke="var(--text-h, #334155)"
          />
          <line x1="8" y1="17" x2="6" y2="21" stroke="#3b82f6" strokeLinecap="round" />
          <line x1="12" y1="17" x2="10" y2="21" stroke="#3b82f6" strokeLinecap="round" />
          <line x1="16" y1="17" x2="14" y2="21" stroke="#3b82f6" strokeLinecap="round" />
        </svg>
      );

    case "rain-heavy":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M17.5 13H9a5 5 0 1 1 4.79-6.42A3.5 3.5 0 1 1 17.5 13z"
            fill="var(--text, #94a3b8)"
            stroke="var(--text-h, #1e293b)"
          />
          <line x1="7" y1="16" x2="5" y2="22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="11" y1="16" x2="9" y2="22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="16" x2="13" y2="22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "thunderstorm":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M17.5 13H9a5 5 0 1 1 4.79-6.42A3.5 3.5 0 1 1 17.5 13z"
            fill="var(--text, #94a3b8)"
            stroke="var(--text-h, #1e293b)"
          />
          <polygon points="13 13 9 19 13 19 11 23 16 16 12 16" fill="#f59e0b" stroke="#f59e0b" strokeLinejoin="round" />
        </svg>
      );

    case "fog":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text, #64748b)" strokeWidth="2">
          <path d="M4 14h16M4 18h16M4 10h16" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
        </svg>
      );
  }
}

export default function StateWeatherWidget({ stateCode, stateName }) {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const code = (stateCode || "").toLowerCase();
  const stateMeta = states[code];
  const defaultCityName = code === "rs" ? "Rio Grande" : stateMeta?.capital || "Porto Alegre";

  // Carrega municípios da UF via IBGE
  useEffect(() => {
    const uf = stateMeta?.uf || code.toUpperCase();
    fetchStateMunicipalities(uf).then((cities) => {
      if (cities && cities.length > 0) {
        setAllCities(cities);
      } else {
        setAllCities([defaultCityName]);
      }
    });
  }, [code, defaultCityName, stateMeta]);

  // Carrega o clima ao alterar estado ou cidade
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const cityToFetch = selectedCity || defaultCityName;

    fetchStateWeather(stateCode, cityToFetch)
      .then((res) => {
        if (!isMounted) return;
        setWeatherData(res);
        if (!selectedCity) {
          setSelectedCity(res.cityName);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Erro ao carregar dados climáticos:", err);
        setError("Não foi possível carregar o clima para esta localidade.");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stateCode, selectedCity, defaultCityName]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  if (isLoading && !weatherData) {
    return (
      <div className="weather-widget-skeleton">
        <span>Carregando dados meteorológicos de {selectedCity || defaultCityName}, {stateName}...</span>
      </div>
    );
  }

  if (error && !weatherData) {
    return null;
  }

  const { current, forecast, cityName } = weatherData;

  return (
    <section className="weather-widget-minimal">
      {/* Header com Busca de Cidade */}
      <div className="weather-widget-header">
        <div className="weather-header-left">
          <span className="weather-title">Clima & Previsão</span>
          <span className="weather-source-tag">Open-Meteo</span>
        </div>

        {/* Busca / Seletor de Município */}
        <div className="weather-city-search-wrap">
          <label htmlFor="weather-city-input" className="weather-city-label">
            Município:
          </label>
          <input
            id="weather-city-input"
            list="weather-cities-datalist"
            className="weather-city-input"
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Pesquisar cidade..."
            aria-label="Pesquisar município para clima"
          />
          <datalist id="weather-cities-datalist">
            {allCities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Card Principal: Clima Atual */}
      <div className="weather-current-hero">
        <div className="weather-hero-top">
          <div className="weather-hero-icon-box">
            <WeatherIcon name={current.icon} isDay={current.isDay} size={44} />
          </div>

          <div className="weather-hero-temp-block">
            <div className="weather-temp-main-display">
              <span className="weather-temp-number">{current.temp}°</span>
              <span className="weather-temp-scale">C</span>
            </div>
          </div>

          <div className="weather-hero-desc-block">
            <span className="weather-condition-headline">{current.condition}</span>
            <span className="weather-location-subline">
              Sensação de <strong>{current.feelsLike}°C</strong> • {cityName}, {current.stateUf}
            </span>
          </div>
        </div>

        {/* 4 Métricas Secundárias em Grid Limpo */}
        <div className="weather-metrics-grid">
          <div className="weather-metric-item">
            <span className="metric-label">Umidade</span>
            <span className="metric-val">{current.humidity}%</span>
          </div>
          <div className="weather-metric-item">
            <span className="metric-label">Vento</span>
            <span className="metric-val">{current.windSpeed} <small>km/h</small></span>
          </div>
          <div className="weather-metric-item">
            <span className="metric-label">Índice UV</span>
            <span className={`metric-val uv-${current.uvLevel}`}>
              {current.uvLabel} <small>({current.uvIndex})</small>
            </span>
          </div>
          <div className="weather-metric-item">
            <span className="metric-label">Sol (Nascer / Pôr)</span>
            <span className="metric-val solar-val">
              {current.sunrise} • {current.sunset}
            </span>
          </div>
        </div>
      </div>

      {/* Previsão para os Próximos 7 Dias */}
      <div className="weather-forecast-section">
        <span className="weather-forecast-title">Previsão para 7 Dias</span>
        <div className="weather-forecast-grid">
          {forecast.map((day, idx) => (
            <div key={idx} className={`weather-forecast-card ${day.isToday ? "today" : ""}`}>
              <span className="forecast-weekday">{day.weekday}</span>
              <span className="forecast-date">{day.date}</span>

              <div className="forecast-icon">
                <WeatherIcon name={day.icon} isDay={true} size={24} />
              </div>

              {day.rainProb > 0 ? (
                <span className="forecast-rain" title="Probabilidade de chuva">
                  {day.rainProb}%
                </span>
              ) : (
                <span className="forecast-rain empty">—</span>
              )}

              <div className="forecast-temps">
                <span className="forecast-max">{day.tempMax}°</span>
                <span className="forecast-min">{day.tempMin}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
