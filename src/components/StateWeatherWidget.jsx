import { useState, useEffect } from "react";
import { fetchStateWeather } from "../services/weatherApi";
import { fetchStateMunicipalities } from "../services/holidaysApi";
import { states } from "../data/states";
import "./StateWeatherWidget.css";

function WeatherIcon({ name, isDay = true, size = 28 }) {
  switch (name) {
    case "sun":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold, #A8792A)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
          <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
          <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
        </svg>
      );
    case "sun-cloud":
    case "cloud-sun":
    case "cloud":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--ink-faded, #5B4630)" strokeWidth="1.5">
          <path d="M6 15a4 4 0 0 1 .5-8 5 5 0 0 1 9-2 4.5 4.5 0 0 1 1.5 8.7" />
        </svg>
      );
    case "rain-light":
    case "rain":
    case "rain-shower":
    case "rain-heavy":
    case "thunderstorm":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--rubric, #9C2B1F)" strokeWidth="1.5">
          <path d="M6 14a4 4 0 0 1 .5-8 5 5 0 0 1 9-2 4.5 4.5 0 0 1 1.5 8.7" />
          <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--ink-faded, #5B4630)" strokeWidth="1.5">
          <path d="M6 15a4 4 0 0 1 .5-8 5 5 0 0 1 9-2 4.5 4.5 0 0 1 1.5 8.7" />
        </svg>
      );
  }
}

export default function StateWeatherWidget({ stateCode, stateName }) {
  const [weatherData, setWeatherData] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const code = (stateCode || "").toLowerCase();
  const stateMeta = states[code];
  const defaultCityName = code === "rs" ? "Rio Grande" : stateMeta?.capital || "Porto Alegre";

  const [activeCity, setActiveCity] = useState(defaultCityName);
  const [inputCity, setInputCity] = useState(defaultCityName);

  useEffect(() => {
    setActiveCity(defaultCityName);
    setInputCity(defaultCityName);
  }, [stateCode, defaultCityName]);

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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchStateWeather(stateCode, activeCity)
      .then((res) => {
        if (!isMounted) return;
        setWeatherData(res);
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
  }, [stateCode, activeCity]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputCity(val);

    const match = allCities.find((c) => c.toLowerCase() === val.trim().toLowerCase());
    if (match && match.toLowerCase() !== activeCity.toLowerCase()) {
      setActiveCity(match);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputCity.trim();
    if (trimmed && trimmed.toLowerCase() !== activeCity.toLowerCase()) {
      setActiveCity(trimmed);
    }
  };

  if (isLoading && !weatherData) {
    return (
      <div className="weather-widget-skeleton">
        <span>Carregando dados meteorológicos de {activeCity}, {stateName}...</span>
      </div>
    );
  }

  if (error && !weatherData) {
    return null;
  }

  const { current, forecast, cityName } = weatherData;

  return (
    <section className="weather-widget-minimal">
      {/* Busca de Município */}
      <div className="weather-widget-header">
        <div className="weather-header-left">
          <span className="panel-title">MUNICÍPIO:</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="weather-city-form">
          <input
            id="weather-city-input"
            list="weather-cities-datalist"
            className="weather-city-input"
            value={inputCity}
            onChange={handleInputChange}
            placeholder="Pesquisar cidade..."
            aria-label="Pesquisar município para clima"
          />
          <datalist id="weather-cities-datalist">
            {allCities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <button type="submit" className="weather-city-btn" title="Buscar cidade" aria-label="Buscar cidade">
            🔍
          </button>
        </form>
      </div>

      {/* Dial / Temperatura Principal */}
      <div className="dial-row">
        <svg width="52" height="52" viewBox="0 0 40 40" fill="none" stroke="var(--ink)" strokeWidth="1.6">
          <circle cx="14" cy="24" r="8" />
          <path d="M20 26a8 8 0 0 0-13-8" />
          <circle cx="14" cy="24" r="8" fill="none" />
          <path d="M9 12l2 2M16 8v3M23 12l-2 2" strokeLinecap="round" />
        </svg>
        <div>
          <div className="dial-temp">{current.temp}°C</div>
          <div className="dial-cond">
            {current.condition} · sensação de {current.feelsLike}°C ({cityName})
          </div>
        </div>
      </div>

      {/* Instrumentos redondos */}
      <div className="instruments">
        <div className="instrument">
          <div className="lab">Umidade</div>
          <div className="num">{current.humidity}%</div>
        </div>
        <div className="instrument">
          <div className="lab">Vento</div>
          <div className="num">{current.windSpeed} km/h</div>
        </div>
        <div className="instrument">
          <div className="lab">Índice UV</div>
          <div className="num">{current.uvLabel} ({current.uvIndex})</div>
        </div>
        <div className="instrument">
          <div className="lab">Sol</div>
          <div className="num">{current.sunrise}–{current.sunset}</div>
        </div>
      </div>

      {/* Previsão 7 Dias */}
      <p className="panel-title">Previsão para 7 dias — Open-Meteo</p>
      <div className="week">
        {forecast.map((day, idx) => (
          <div key={idx} className={`day ${day.isToday ? "today" : ""}`}>
            <div className="dname">{day.isToday ? "Hoje" : day.weekday}</div>
            <div className="ddate">{day.date}</div>
            <WeatherIcon name={day.icon} size={28} />
            <div className="prob">{day.rainProb > 0 ? `${day.rainProb}%` : "—"}</div>
            <div className="temps">{day.tempMax}° / {day.tempMin}°</div>
          </div>
        ))}
      </div>
    </section>
  );
}
