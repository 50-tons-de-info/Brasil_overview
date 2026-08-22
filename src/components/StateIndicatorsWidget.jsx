import { useState, useEffect } from "react";
import { fetchStateIndicators } from "../services/ibgeApi";
import "./StateIndicatorsWidget.css";

export default function StateIndicatorsWidget({ stateCode, stateName }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("general"); // "general" | "agro" | "social"
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchStateIndicators(stateCode)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar indicadores do IBGE:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stateCode]);

  if (isLoading) {
    return (
      <div className="indicators-widget-skeleton">
        <span>Carregando dados estatísticos de {stateName}...</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    popFormatted,
    regionalShareFormatted,
    areaFormatted,
    densityFormatted,
    municipios,
    capital,
    pibTotalFormatted,
    pibShareBrasilFormatted,
    pibPerCapitaFormatted,
    idhFormatted,
    setores,
    destaquesMunicipais,
    rankings,
    regionName,
    agroExport,
    socialDemografia,
    saldoMigratorio,
  } = data;

  const getMigratorioBadgeClass = (perfil) => {
    if (perfil.includes("Atração") || perfil.includes("Receptor")) return "badge-atracao";
    if (perfil.includes("Emissor")) return "badge-emissor";
    return "badge-equilibrado";
  };

  return (
    <section className="indicators-widget-minimal">
      <div className="indicators-widget-header">
        <div className="indicators-header-left">
          <span className="indicators-title">Estado em Números</span>
          <span className="indicators-badge">IBGE & ComexStat</span>
        </div>

        {/* Abas de Navegação */}
        <div className="indicators-tabs">
          <button
            type="button"
            className={`indicators-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Geral & Economia
          </button>
          <button
            type="button"
            className={`indicators-tab-btn ${activeTab === "agro" ? "active" : ""}`}
            onClick={() => setActiveTab("agro")}
          >
            Agro & Exportações
          </button>
          <button
            type="button"
            className={`indicators-tab-btn ${activeTab === "social" ? "active" : ""}`}
            onClick={() => setActiveTab("social")}
          >
            Social & Migração
          </button>
        </div>
      </div>

      {/* ABA 1: GERAL & ECONOMIA */}
      {activeTab === "general" && (
        <div className="indicators-tab-pane">
          {/* Grid de 6 Cards Quantitativos com Rankings */}
          <div className="indicators-grid-numeric">
            {/* População */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">População</span>
                <span className="indicator-rank-badge">#{rankings.rankPop} no BR</span>
              </div>
              <span className="indicator-value">{popFormatted}</span>
              <span className="indicator-sub">{regionalShareFormatted} da Região {regionName}</span>
            </div>

            {/* Área Territorial */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">Área Territorial</span>
                <span className="indicator-rank-badge">#{rankings.rankArea} no BR</span>
              </div>
              <span className="indicator-value">{areaFormatted}</span>
              <span className="indicator-sub">Densidade: {densityFormatted}</span>
            </div>

            {/* PIB Total */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">PIB Total</span>
                <span className="indicator-rank-badge">#{rankings.rankPibTotal} no BR</span>
              </div>
              <span className="indicator-value">{pibTotalFormatted}</span>
              <span className="indicator-sub">{pibShareBrasilFormatted} do PIB nacional</span>
            </div>

            {/* PIB per capita */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">PIB per capita</span>
                <span className="indicator-rank-badge">#{rankings.rankPibPerCapita} no BR</span>
              </div>
              <span className="indicator-value">{pibPerCapitaFormatted}</span>
              <span className="indicator-sub">Contas Regionais</span>
            </div>

            {/* IDH */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">IDH Estadual</span>
                <span className="indicator-rank-badge">#{rankings.rankIdh} no BR</span>
              </div>
              <span className="indicator-value">{idhFormatted}</span>
              <span className="indicator-sub">Muito Alto desenvolvimento</span>
            </div>

            {/* Municípios */}
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">Municípios</span>
                <span className="indicator-rank-badge">#{rankings.rankMunicipios} no BR</span>
              </div>
              <span className="indicator-value">{municipios} cidades</span>
              <span className="indicator-sub">Capital: {capital}</span>
            </div>
          </div>

          {/* Destaques Municipais / Extremos do Estado */}
          {destaquesMunicipais && (
            <div className="indicators-extremes-box">
              <span className="extremes-title">Extremos & Destaques Municipais</span>
              <div className="extremes-grid">
                <div className="extreme-item">
                  <span className="extreme-icon">🏙️</span>
                  <div className="extreme-details">
                    <span className="extreme-type">Mais Populosa</span>
                    <span className="extreme-name">{destaquesMunicipais.maisPopulosa}</span>
                  </div>
                </div>

                <div className="extreme-item">
                  <span className="extreme-icon">📐</span>
                  <div className="extreme-details">
                    <span className="extreme-type">Maior em Extensão</span>
                    <span className="extreme-name">{destaquesMunicipais.maiorArea}</span>
                  </div>
                </div>

                <div className="extreme-item">
                  <span className="extreme-icon">🏡</span>
                  <div className="extreme-details">
                    <span className="extreme-type">Menor População</span>
                    <span className="extreme-name">{destaquesMunicipais.menorPopulacao}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estrutura Econômica Setorial */}
          {setores && (
            <div className="indicators-sectors-box">
              <div className="sectors-header">
                <span className="sectors-title">Estrutura Econômica (PIB Setorial)</span>
                <div className="sectors-legend">
                  <span className="legend-item servicos">
                    <span className="legend-dot" /> Serviços {setores.servicos}%
                  </span>
                  <span className="legend-item industria">
                    <span className="legend-dot" /> Indústria {setores.industria}%
                  </span>
                  <span className="legend-item agro">
                    <span className="legend-dot" /> Agropecuária {setores.agro}%
                  </span>
                </div>
              </div>

              <div className="sectors-bar">
                <div
                  className="sector-fill servicos"
                  style={{ width: `${setores.servicos}%` }}
                  title={`Serviços: ${setores.servicos}%`}
                />
                <div
                  className="sector-fill industria"
                  style={{ width: `${setores.industria}%` }}
                  title={`Indústria: ${setores.industria}%`}
                />
                <div
                  className="sector-fill agro"
                  style={{ width: `${setores.agro}%` }}
                  title={`Agropecuária: ${setores.agro}%`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: AGRO & EXPORTAÇÕES */}
      {activeTab === "agro" && agroExport && (
        <div className="indicators-tab-pane">
          {/* Card de Lideranças Produtivas */}
          <div className="indicators-feature-card agro-feature">
            <span className="feature-tag">🌾 Vocação Agropecuária & Liderança Nacional</span>
            <p className="feature-text">{agroExport.liderancas}</p>
          </div>

          {/* Grid de Comércio Exterior e Energia */}
          <div className="indicators-grid-numeric">
            <div className="indicator-card">
              <span className="indicator-label">Volume Exportado (Ano)</span>
              <span className="indicator-value">{agroExport.exportacoesUsdFormatted}</span>
              <span className="indicator-sub">ComexStat / MDIC</span>
            </div>

            <div className="indicator-card">
              <span className="indicator-label">Principais Parceiros</span>
              <span className="indicator-value">{agroExport.principalDestino.split(",")[0]}</span>
              <span className="indicator-sub">{agroExport.principalDestino}</span>
            </div>

            <div className="indicator-card">
              <span className="indicator-label">Matriz Energética</span>
              <span className="indicator-value">{agroExport.matrizEnergetica.split("(")[0]}</span>
              <span className="indicator-sub">{agroExport.matrizEnergetica}</span>
            </div>
          </div>

          {/* Top Produtos Exportados */}
          <div className="indicators-products-box">
            <span className="products-title">Pauta de Exportações (Principais Produtos)</span>
            <p className="products-text">{agroExport.topExportacoes}</p>
          </div>
        </div>
      )}

      {/* ABA 3: SOCIAL & MIGRAÇÃO */}
      {activeTab === "social" && socialDemografia && saldoMigratorio && (
        <div className="indicators-tab-pane">
          {/* Card de Saldo Migratório Interestadual */}
          <div className="indicators-migration-card">
            <div className="migration-card-header">
              <span className="migration-title">Saldo & Dinâmica Migratória Interestadual</span>
              <span className={`migration-badge ${getMigratorioBadgeClass(saldoMigratorio.perfil)}`}>
                {saldoMigratorio.perfil}
              </span>
            </div>
            <p className="migration-desc">{saldoMigratorio.descricao}</p>

            <div className="migration-routes-grid">
              <div className="migration-route-item">
                <span className="route-label">🛫 Principais Destinos dos Emigrantes</span>
                <span className="route-val">{saldoMigratorio.principaisDestinos}</span>
              </div>
              <div className="migration-route-item">
                <span className="route-label">🛬 Principais Origens dos Imigrantes</span>
                <span className="route-val">{saldoMigratorio.principaisOrigens}</span>
              </div>
            </div>
          </div>

          {/* Grid de Demografia e Longevidade */}
          <div className="indicators-grid-numeric four-cols">
            <div className="indicator-card">
              <span className="indicator-label">Idade Mediana</span>
              <span className="indicator-value">{socialDemografia.idadeMedianaFormatted}</span>
              <span className="indicator-sub">Censo Demográfico</span>
            </div>

            <div className="indicator-card">
              <span className="indicator-label">Expectativa de Vida</span>
              <span className="indicator-value">{socialDemografia.expectativaVidaFormatted}</span>
              <span className="indicator-sub">Tábua de Mortalidade</span>
            </div>

            <div className="indicator-card">
              <span className="indicator-label">Alfabetização</span>
              <span className="indicator-value">{socialDemografia.alfabetizacaoFormatted}</span>
              <span className="indicator-sub">População de 15+ anos</span>
            </div>

            <div className="indicator-card">
              <span className="indicator-label">Taxa de Urbanização</span>
              <span className="indicator-value">{socialDemografia.urbanizacaoFormatted}</span>
              <span className="indicator-sub">População Urbana</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
