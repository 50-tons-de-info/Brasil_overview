import { useState, useEffect, useMemo } from "react";
import { fetchStateHolidays } from "../services/holidaysApi";
import "./StateHolidaysWidget.css";

export default function StateHolidaysWidget({ stateCode, stateName }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "upcoming" | "national" | "state" | "municipal"
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchStateHolidays(stateCode)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setSelectedCity(res.defaultCity || "");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar feriados:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stateCode]);

  // Feriados aplicáveis à cidade selecionada
  const cityHolidays = useMemo(() => {
    if (!data) return [];
    const { holidays } = data;
    const currentCity = selectedCity.trim().toLowerCase();

    return holidays.filter((h) => {
      if (h.type === "national" || h.type === "state") {
        return true;
      }
      if (h.type === "municipal") {
        if (!currentCity) return true;
        const holidayCities = (h.city || "")
          .toLowerCase()
          .split("/")
          .map((c) => c.trim());
        return holidayCities.some((c) => currentCity.includes(c) || c.includes(currentCity));
      }
      return true;
    });
  }, [data, selectedCity]);

  // Próximo feriado da cidade selecionada
  const nextHoliday = useMemo(() => {
    const upcoming = cityHolidays.filter((h) => h.daysRemaining >= 0);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [cityHolidays]);

  // Feriados filtrados pela categoria selecionada
  const displayedHolidays = useMemo(() => {
    return cityHolidays.filter((h) => {
      if (filter === "upcoming") return !h.isPast;
      if (filter === "national") return h.type === "national";
      if (filter === "state") return h.type === "state";
      if (filter === "municipal") return h.type === "municipal";
      return true;
    });
  }, [cityHolidays, filter]);

  if (isLoading) {
    return (
      <div className="holidays-widget-skeleton">
        <span>Carregando calendário de feriados de {stateName}...</span>
      </div>
    );
  }

  if (!data || data.holidays.length === 0) {
    return null;
  }

  const { allCities, year } = data;

  const getCountdownLabel = (h) => {
    if (h.isToday) return "É hoje!";
    if (h.daysRemaining === 1) return "Amanhã";
    if (h.daysRemaining > 1) return `Em ${h.daysRemaining} dias`;
    return "Já ocorreu";
  };

  return (
    <section className="holidays-widget-minimal">
      <div className="holidays-widget-header">
        <div className="holidays-header-left">
          <span className="holidays-title">Feriados e Datas Comemorativas</span>
          <span className="holidays-year-tag">{year}</span>
        </div>

        {/* Seletor / Busca de Cidade */}
        <div className="holidays-city-search-wrap">
          <label htmlFor="city-input" className="holidays-city-label">
            Município:
          </label>
          <input
            id="city-input"
            list="cities-datalist"
            className="holidays-city-input"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder="Pesquisar cidade..."
            aria-label="Selecionar município"
          />
          <datalist id="cities-datalist">
            {allCities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Destaque do Próximo Feriado para a Cidade */}
      {nextHoliday && (
        <div className="next-holiday-banner">
          <div className="next-holiday-date-col">
            <span className="next-holiday-day">{nextHoliday.displayDate}</span>
            <span className="next-holiday-weekday">{nextHoliday.weekday}</span>
          </div>

          <div className="next-holiday-info">
            <div className="next-holiday-top-row">
              <span className="next-holiday-badge-type">{nextHoliday.typeLabel}</span>
              <span className="next-holiday-countdown">
                {nextHoliday.isToday
                  ? "🎉 É HOJE!"
                  : nextHoliday.daysRemaining === 1
                  ? "Amanhã"
                  : `Faltam ${nextHoliday.daysRemaining} dias`}
              </span>
            </div>
            <h4 className="next-holiday-name">{nextHoliday.name}</h4>
          </div>
        </div>
      )}

      {/* Barra de Filtros em Cápsula */}
      <div className="holidays-controls-row">
        <div className="holidays-filters">
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({cityHolidays.length})
          </button>
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Próximos
          </button>
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "national" ? "active" : ""}`}
            onClick={() => setFilter("national")}
          >
            Nacionais
          </button>
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "state" ? "active" : ""}`}
            onClick={() => setFilter("state")}
          >
            Estaduais
          </button>
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "municipal" ? "active" : ""}`}
            onClick={() => setFilter("municipal")}
          >
            Municipais
          </button>
        </div>

        <span className="holidays-active-city-indicator">
          Exibindo para: <strong>{selectedCity || stateName}</strong>
        </span>
      </div>

      {/* Lista Minimalista de Feriados */}
      <div className="holidays-list">
        {displayedHolidays.length === 0 ? (
          <div className="holidays-empty">
            {filter === "municipal"
              ? `Nenhum feriado municipal específico cadastrado para "${selectedCity}".`
              : "Nenhum feriado encontrado para este filtro."}
          </div>
        ) : (
          displayedHolidays.map((item) => (
            <div
              key={item.id}
              className={`holiday-item-row ${item.isToday ? "today" : ""} ${
                item.isPast ? "past" : ""
              }`}
            >
              <div className="holiday-item-date-box">
                <span className="holiday-item-day">{item.displayDate}</span>
                <span className="holiday-item-weekday">{item.weekday.split("-")[0]}</span>
              </div>

              <div className="holiday-item-details">
                <span className="holiday-item-name">{item.name}</span>
                <div className="holiday-item-sub">
                  <span className={`holiday-type-tag ${item.type}`}>
                    {item.typeLabel}
                  </span>
                </div>
              </div>

              <div className="holiday-item-countdown-col">
                <span className={`holiday-status-label ${item.isPast ? "past" : item.isToday ? "today" : "future"}`}>
                  {getCountdownLabel(item)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
