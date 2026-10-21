import { useState, useEffect } from "react";
import { fetchStateWeather } from "../services/weatherApi";
import { fetchStateMunicipalities } from "../services/holidaysApi";
import { states } from "../data/states";
import cloudLightning from "../assets/icons/weather/cloud_lightning.png";
import cloudPlain from "../assets/icons/weather/cloud_plain.png";
import cloudRainHeavyLines from "../assets/icons/weather/cloud_rain_heavy_lines.png";
import cloudRainLight from "../assets/icons/weather/cloud_rain_light.png";
import cloudRainMedium from "../assets/icons/weather/cloud_rain_medium.png";
import cloudSnowDotsBottom from "../assets/icons/weather/cloud_snow_dots_bottom.png";
import cloudMoon from "../assets/icons/weather/cloud_moon.png";
import cloudSunBig from "../assets/icons/weather/cloud_sun_big.png";
import cloudSunRain from "../assets/icons/weather/cloud_sun_rain.png";
import moonWithStars from "../assets/icons/weather/moon_with_stars.png";
import sunFace from "../assets/icons/weather/sun_face.png";
import magnifyingGlass from "../assets/icons/magnifying_glass.png";
import "./StateWeatherWidget.css";

const WEATHER_ICON_FILES = {
  sun: sunFace,
  "sun-cloud": cloudSunBig,
  "cloud-sun": cloudSunBig,
  cloud: cloudPlain,
  fog: cloudPlain,
  "cloud-moon": cloudMoon,
  moon: moonWithStars,
  "rain-light": cloudRainLight,
  rain: cloudRainMedium,
  "rain-heavy": cloudRainHeavyLines,
  snow: cloudSnowDotsBottom,
  "rain-shower": cloudSunRain,
  thunderstorm: cloudLightning,
};

function WeatherIcon({ name, size = 28 }) {
  const fileName = WEATHER_ICON_FILES[name] || WEATHER_ICON_FILES.cloud;

  return (
    <img
      src={fileName}
      alt=""
      width={size}
      height={size}
      className="weather-icon"
      aria-hidden="true"
    />
  );
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
      <div className="weather-widget-header">
        <div className="weather-header-left">
          <span className="panel-title">MUNICÍPIO:</span>
          <span className="weather-current-city">{cityName}</span>
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
            <img src={magnifyingGlass} alt="" aria-hidden="true" />
          </button>
        </form>
      </div>

      <div className="dial-row">
        <WeatherIcon name={current.icon} size={60} />
        <div>
          <div className="dial-temp">{current.temp}°C</div>
          <div className="dial-cond">
            {current.condition} · sensação de {current.feelsLike}°C ({cityName})
          </div>
        </div>
      </div>

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
