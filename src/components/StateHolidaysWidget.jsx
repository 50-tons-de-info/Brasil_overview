import { useState, useEffect, useMemo } from "react";
import { fetchStateHolidays } from "../services/holidaysApi";
import "./StateHolidaysWidget.css";

export default function StateHolidaysWidget({ stateCode, stateName }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "upcoming" | "national" | "state"
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

  const stateNationalHolidays = useMemo(() => {
    if (!data) return [];
    return data.holidays.filter((h) => h.type === "national" || h.type === "state");
  }, [data]);

  const nextHoliday = useMemo(() => {
    const upcoming = stateNationalHolidays.filter((h) => h.daysRemaining >= 0);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [stateNationalHolidays]);

  const displayedHolidays = useMemo(() => {
    return stateNationalHolidays.filter((h) => {
      if (filter === "upcoming") return !h.isPast;
      if (filter === "national") return h.type === "national";
      if (filter === "state") return h.type === "state";
      return true;
    });
  }, [stateNationalHolidays, filter]);

  if (isLoading) {
    return (
      <div className="holidays-widget-skeleton">
        <span>Carregando calendário de feriados de {stateName}...</span>
      </div>
    );
  }

  if (!data || stateNationalHolidays.length === 0) {
    return null;
  }

  const getTagClass = (type) => {
    if (type === "national") return "htag nac";
    return "htag est";
  };

  const getCountdownLabel = (h) => {
    if (h.isToday) return "É HOJE!";
    if (h.daysRemaining === 1) return "Amanhã";
    if (h.daysRemaining > 1) return `Em ${h.daysRemaining} dias`;
    return "Já ocorreu";
  };

  const mid = Math.ceil(displayedHolidays.length / 2);
  const leftCol = displayedHolidays.slice(0, mid);
  const rightCol = displayedHolidays.slice(mid);

  return (
    <section className="holidays-widget-minimal">
      {/* Carimbo em Destaque do Próximo Feriado */}
      {nextHoliday && (
        <div className="stamp-row">
          <div>
            <div className="hdate" style={{ fontSize: "11px", color: "var(--ink-faded)" }}>
              {nextHoliday.weekday.toUpperCase()}
            </div>
            <div className="stamp-date">{nextHoliday.displayDate}</div>
            <div>
              {nextHoliday.name} <span style={{ fontSize: "13px", color: "var(--ink-faded)" }}>({nextHoliday.typeLabel})</span>
            </div>
          </div>
          <div className="stamp">
            {nextHoliday.isToday
              ? "É HOJE!"
              : nextHoliday.daysRemaining === 1
              ? "AMANHÃ"
              : `FALTAM\n${nextHoliday.daysRemaining} DIAS`}
          </div>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="holidays-controls-row">
        <div className="holidays-filters">
          <button
            type="button"
            className={`holidays-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({stateNationalHolidays.length})
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
        </div>
      </div>

      {/* Grade de 2 Colunas */}
      <div className="holiday-grid">
        <div>
          {leftCol.map((item) => (
            <div key={item.id} className={`hrow ${item.isPast ? "past" : ""}`}>
              <span className="hdate">{item.displayDate}</span>
              <span className="hname">{item.name}</span>
              <span className={getTagClass(item.type)}>{item.typeLabel}</span>
              <span className={`hstatus ${!item.isPast ? "next" : ""}`}>{getCountdownLabel(item)}</span>
            </div>
          ))}
        </div>
        <div>
          {rightCol.map((item) => (
            <div key={item.id} className={`hrow ${item.isPast ? "past" : ""}`}>
              <span className="hdate">{item.displayDate}</span>
              <span className="hname">{item.name}</span>
              <span className={getTagClass(item.type)}>{item.typeLabel}</span>
              <span className={`hstatus ${!item.isPast ? "next" : ""}`}>{getCountdownLabel(item)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
