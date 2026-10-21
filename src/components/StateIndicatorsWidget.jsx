import { useState, useEffect } from "react";
import { fetchStateIndicators } from "../services/ibgeApi";
import "./StateIndicatorsWidget.css";

const ETNIA_COLORS = {
  Branca: "#3b82f6",
  Parda: "#f59e0b",
  Preta: "#8b5cf6",
  Amarela: "#eab308",
  Indígena: "#10b981",
};

export default function StateIndicatorsWidget({ stateCode, stateName }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
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
        <span>Carregando dados estatísticos oficiais do IBGE de {stateName}...</span>
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
    composicaoEtnica,
    distribuicaoSexo,
    indiceGini,
  } = data;

  const getMigratorioBadgeClass = (perfil) => {
    if (perfil.includes("Atração") || perfil.includes("Receptor")) return "badge-atracao";
    if (perfil.includes("Emissor")) return "badge-emissor";
    return "badge-equilibrado";
  };

  const getGiniClassification = (gini) => {
    if (gini < 0.48) return "Desigualdade Menor (Relativa)";
    if (gini < 0.53) return "Desigualdade Média";
    return "Desigualdade Alta";
  };

  const exportProductsList = (agroExport?.topExportacoes || "")
    .split(",")
    .map((p) => p.replace(" e ", ",").split(","))
    .flat()
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <section className="indicators-widget-minimal">
      <div className="indicators-widget-header">
        <div className="indicators-header-left">
          <span className="indicators-title">Estado em Números</span>
          <span className="indicators-badge">APIs Oficiais IBGE & SIDRA</span>
        </div>

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
            Demografia & Sociedade
          </button>
        </div>
      </div>

      {activeTab === "general" && (
        <div className="indicators-tab-pane">
          <div className="indicators-grid-numeric">
            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">População</span>
                <span className="indicator-rank-badge">#{rankings.rankPop} no BR</span>
              </div>
              <span className="indicator-value">{popFormatted}</span>
              <span className="indicator-sub">{regionalShareFormatted} da Região {regionName}</span>
            </div>

            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">Área Territorial</span>
                <span className="indicator-rank-badge">#{rankings.rankArea} no BR</span>
              </div>
              <span className="indicator-value">{areaFormatted}</span>
              <span className="indicator-sub">Densidade: {densityFormatted}</span>
            </div>

            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">PIB Total</span>
                <span className="indicator-rank-badge">#{rankings.rankPibTotal} no BR</span>
              </div>
              <span className="indicator-value">{pibTotalFormatted}</span>
              <span className="indicator-sub">{pibShareBrasilFormatted} do PIB nacional</span>
            </div>

            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">PIB per capita</span>
                <span className="indicator-rank-badge">#{rankings.rankPibPerCapita} no BR</span>
              </div>
              <span className="indicator-value">{pibPerCapitaFormatted}</span>
              <span className="indicator-sub">Contas Regionais</span>
            </div>

            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">IDH Estadual</span>
                <span className="indicator-rank-badge">#{rankings.rankIdh} no BR</span>
              </div>
              <span className="indicator-value">{idhFormatted}</span>
              <span className="indicator-sub">Muito Alto desenvolvimento</span>
            </div>

            <div className="indicator-card">
              <div className="indicator-card-top">
                <span className="indicator-label">Municípios</span>
                <span className="indicator-rank-badge">#{rankings.rankMunicipios} no BR</span>
              </div>
              <span className="indicator-value">{municipios} cidades</span>
              <span className="indicator-sub">Capital: {capital}</span>
            </div>
          </div>

          <div className="indicators-dual-col-layout">
            {destaquesMunicipais && (
              <div className="indicators-subpanel">
                <div className="subpanel-header">
                  <span className="subpanel-title">Extremos & Destaques Municipais</span>
                  <span className="subpanel-tag">Censo IBGE</span>
                </div>
                <div className="extremes-list-compact">
                  <div className="extreme-row">
                    <span className="extreme-row-icon extreme-row-icon-primary" aria-hidden="true" />
                    <div className="extreme-row-info">
                      <span className="extreme-row-label">Mais Populosa</span>
                      <span className="extreme-row-val">{destaquesMunicipais.maisPopulosa}</span>
                    </div>
                  </div>

                  <div className="extreme-row">
                    <span className="extreme-row-icon extreme-row-icon-secondary" aria-hidden="true" />
                    <div className="extreme-row-info">
                      <span className="extreme-row-label">Maior em Extensão</span>
                      <span className="extreme-row-val">{destaquesMunicipais.maiorArea}</span>
                    </div>
                  </div>

                  <div className="extreme-row">
                    <span className="extreme-row-icon extreme-row-icon-accent" aria-hidden="true" />
                    <div className="extreme-row-info">
                      <span className="extreme-row-label">Menor População</span>
                      <span className="extreme-row-val">{destaquesMunicipais.menorPopulacao}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {setores && (
              <div className="indicators-subpanel">
                <div className="subpanel-header">
                  <span className="subpanel-title">Estrutura Econômica (PIB Setorial)</span>
                  <span className="subpanel-tag">Contas Regionais</span>
                </div>

                <div className="sectors-content-wrap">
                  <div className="sectors-legend-grid">
                    <div className="sector-legend-box servicos">
                      <span className="sector-legend-name">Serviços</span>
                      <span className="sector-legend-pct">{setores.servicos}%</span>
                    </div>
                    <div className="sector-legend-box industria">
                      <span className="sector-legend-name">Indústria</span>
                      <span className="sector-legend-pct">{setores.industria}%</span>
                    </div>
                    <div className="sector-legend-box agro">
                      <span className="sector-legend-name">Agropecuária</span>
                      <span className="sector-legend-pct">{setores.agro}%</span>
                    </div>
                  </div>

                  <div className="sectors-bar-large">
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
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "agro" && agroExport && (
        <div className="indicators-tab-pane">
          <div className="indicators-feature-card agro-feature">
            <div className="feature-header">
              <span className="feature-tag">Vocação Agropecuária &amp; Liderança Nacional</span>
              <span className="feature-source">PAM / IBGE</span>
            </div>
            <p className="feature-text">{agroExport.liderancas}</p>
          </div>

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

          <div className="indicators-subpanel">
            <div className="subpanel-header">
              <span className="subpanel-title">Pauta Exportadora (Principais Produtos)</span>
              <span className="subpanel-tag">Balança Comercial</span>
            </div>
            <div className="products-chips-wrap">
              {exportProductsList.map((prod, idx) => (
                <span key={idx} className="product-chip">
                  {prod}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "social" && socialDemografia && (
        <div className="indicators-tab-pane">
          <div className="indicators-dual-col-layout">
            {composicaoEtnica && (
              <div className="indicators-subpanel">
                <div className="subpanel-header">
                  <span className="subpanel-title">Composição Étnica</span>
                  <span className="subpanel-tag">Censo 2022</span>
                </div>

                <div className="etnia-content-wrap">
                  <div className="etnia-bar-large">
                    {composicaoEtnica.map((item) => (
                      <div
                        key={item.grupo}
                        className="etnia-fill"
                        style={{
                          width: `${item.pct}%`,
                          background: ETNIA_COLORS[item.grupo] || "#888",
                        }}
                        title={`${item.grupo}: ${item.pct}% (${item.qtdFormatted} hab)`}
                      />
                    ))}
                  </div>

                  <div className="etnia-legend-grid">
                    {composicaoEtnica.map((item) => (
                      <div key={item.grupo} className="etnia-legend-item">
                        <span
                          className="legend-dot"
                          style={{ background: ETNIA_COLORS[item.grupo] || "#888" }}
                        />
                        <span className="etnia-item-name">{item.grupo}</span>
                        <strong className="etnia-item-pct">{item.pct}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {distribuicaoSexo && (
              <div className="indicators-subpanel">
                <div className="subpanel-header">
                  <span className="subpanel-title">Distribuição por Sexo</span>
                  <span className="subpanel-tag">Censo 2022</span>
                </div>

                <div className="sex-content-wrap">
                  <div className="sex-bar-large">
                    <div
                      className="sex-fill mulheres"
                      style={{ width: `${distribuicaoSexo.mulheresPct}%` }}
                    >
                      Mulheres {distribuicaoSexo.mulheresPct}%
                    </div>
                    <div
                      className="sex-fill homens"
                      style={{ width: `${distribuicaoSexo.homensPct}%` }}
                    >
                      Homens {distribuicaoSexo.homensPct}%
                    </div>
                  </div>

                  <div className="sex-details-row">
                    <div className="sex-stat-box">
                      <span className="sex-stat-label">Mulheres</span>
                      <span className="sex-stat-num">{distribuicaoSexo.mulheresFormatted}</span>
                    </div>
                    <div className="sex-stat-box">
                      <span className="sex-stat-label">Homens</span>
                      <span className="sex-stat-num">{distribuicaoSexo.homensFormatted}</span>
                    </div>
                    <div className="sex-stat-box highlight">
                      <span className="sex-stat-label">Razão de Sexo</span>
                      <span className="sex-stat-num">{distribuicaoSexo.razaoSexo} <small>H/100M</small></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
              <div className="indicator-card-top">
                <span className="indicator-label">Índice de Gini</span>
                <span className="indicator-rank-badge">{indiceGini.ano}</span>
              </div>
              <span className="indicator-value">{indiceGini.valor.toFixed(3)}</span>
              <span className="indicator-sub">{getGiniClassification(indiceGini.valor)}</span>
            </div>
          </div>

          {saldoMigratorio && (
            <div className="indicators-subpanel migration-subpanel">
              <div className="subpanel-header">
                <span className="subpanel-title">Dinâmica & Saldo Migratório Interestadual</span>
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
          )}
        </div>
      )}
    </section>
  );
}