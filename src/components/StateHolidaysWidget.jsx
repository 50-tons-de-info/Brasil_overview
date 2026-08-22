import { useState, useEffect } from "react";
import { fetchStateHolidays } from "../services/holidaysApi";
import "./StateHolidaysWidget.css";

export default function StateHolidaysWidget({ stateCode, stateName }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "national" | "state" | "municipal" | "upcoming"
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchStateHolidays(stateCode)
      .then((res) => {
        if (isMounted) {
          setData(res);
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

  const { holidays, nextHoliday, year } = data;

  const filteredHolidays = holidays.filter((h) => {
    if (filter === "upcoming") return !h.isPast;
    if (filter === "national") return h.type === "national";
    if (filter === "state") return h.type === "state";
    if (filter === "municipal") return h.type === "municipal";
    return true;
  });

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
        <span className="holidays-source-badge">BrasilAPI + Legislação Estadual</span>
      </div>

      {/* Destaque do Próximo Feriado */}
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

      {/* Filtros em Cápsula */}
      <div className="holidays-filters">
        <button
          type="button"
          className={`holidays-filter-pill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todos ({holidays.length})
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

      {/* Lista Minimalista de Feriados */}
      <div className="holidays-list">
        {filteredHolidays.length === 0 ? (
          <div className="holidays-empty">Nenhum feriado encontrado neste filtro.</div>
        ) : (
          filteredHolidays.map((item) => (
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
