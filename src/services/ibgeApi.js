import {
  IBGE_STATE_DATA,
  REGIONS_POPULATION,
  BRAZIL_TOTAL_POPULATION,
  BRAZIL_TOTAL_PIB_BILHOES,
} from "../data/ibgeData.js";
import { states } from "../data/states.js";

// Mapeamento de Códigos IBGE das 27 UFs
const UF_IBGE_CODES = {
  ro: 11,
  ac: 12,
  am: 13,
  rr: 14,
  pa: 15,
  ap: 16,
  to: 17,
  ma: 21,
  pi: 22,
  ce: 23,
  rn: 24,
  pb: 25,
  pe: 26,
  al: 27,
  se: 28,
  ba: 29,
  mg: 31,
  es: 32,
  rj: 33,
  sp: 35,
  pr: 41,
  sc: 42,
  rs: 43,
  ms: 50,
  mt: 51,
  go: 52,
  df: 53,
};

// Cache em memória para evitar chamadas redundantes durante a navegação
const indicatorsCache = {};

/**
 * Formata números no padrão brasileiro
 */
const fmtNumber = (val) => new Intl.NumberFormat("pt-BR").format(val);
const fmtCurrency = (val) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val);
const fmtPercent = (val) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val) + "%";

/**
 * Formata PIB em Bilhões ou Trilhões
 */
function formatPibTotal(bilhoes) {
  if (bilhoes >= 1000) {
    const tri = bilhoes / 1000;
    return `R$ ${tri.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} trilhões`;
  }
  return `R$ ${bilhoes.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} bilhões`;
}

/**
 * Formata Exportações em US$
 */
function formatUsdExport(bilhoes) {
  if (bilhoes < 1) {
    const milhoes = bilhoes * 1000;
    return `US$ ${milhoes.toFixed(0)} milhões`;
  }
  return `US$ ${bilhoes.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} bilhões`;
}

/**
 * Calcula os rankings nacionais (1º a 27º) entre todas as UFs
 */
function calculateNationalRankings(targetCode) {
  const allStates = Object.keys(IBGE_STATE_DATA).map((k) => ({
    code: k,
    pop: IBGE_STATE_DATA[k].populacaoCenso,
    area: IBGE_STATE_DATA[k].areaKm2,
    pibTotal: IBGE_STATE_DATA[k].pibTotalBilhoes || 0,
    pibPerCapita: IBGE_STATE_DATA[k].pibPerCapita,
    idh: IBGE_STATE_DATA[k].idh,
    municipios: IBGE_STATE_DATA[k].municipios,
  }));

  const getRank = (key) => {
    const sorted = [...allStates].sort((a, b) => b[key] - a[key]);
    return sorted.findIndex((item) => item.code === targetCode) + 1;
  };

  return {
    rankPop: getRank("pop"),
    rankArea: getRank("area"),
    rankPibTotal: getRank("pibTotal"),
    rankPibPerCapita: getRank("pibPerCapita"),
    rankIdh: getRank("idh"),
    rankMunicipios: getRank("municipios"),
  };
}

/**
 * Busca dados estatísticos oficiais ao vivo diretamente das APIs do IBGE
 */
export async function fetchStateIndicators(stateCode) {
  const code = (stateCode || "").toLowerCase();
  const stateMeta = states[code];
  const uf = stateMeta?.uf || code.toUpperCase();
  const ibgeCode = UF_IBGE_CODES[code] || 43;

  if (indicatorsCache[code]) {
    return indicatorsCache[code];
  }

  const baseData = IBGE_STATE_DATA[code] || {
    gentilico: "Não informado",
    areaKm2: 100000,
    populacaoCenso: 5000000,
    municipios: 100,
    pibTotalBilhoes: 100,
    pibPerCapita: 35000,
    idh: 0.75,
    setores: { servicos: 65, industria: 25, agro: 10 },
    biomaPrincipal: "Diversos",
    destaquesMunicipais: {
      maisPopulosa: "Capital",
      maiorArea: "Capital",
      menorPopulacao: "Interior",
    },
    agroExport: {
      liderancas: "Diversos",
      exportacoesUsdBi: 1.0,
      topExportacoes: "Produtos primários",
      principalDestino: "China",
      matrizEnergetica: "Diversificada",
    },
    socialDemografia: {
      idadeMediana: 33,
      expectativaVida: 75.0,
      alfabetizacao: 90.0,
      urbanizacao: 80.0,
    },
    saldoMigratorio: {
      perfil: "Fluxo Equilibrado",
      descricao: "Movimentos migratórios regulares.",
      principaisDestinos: "Estados vizinhos",
      principaisOrigens: "Estados vizinhos",
    },
  };

  // Requisições paralelas e em tempo real a todas as APIs oficiais do IBGE
  let apiMeta = null;
  let apiMunicipiosCount = baseData.municipios;
  let apiPop = baseData.populacaoCenso;
  let apiIdh = baseData.idh;
  let apiPibTotalBilhoes = baseData.pibTotalBilhoes;

  try {
    const [metaRes, munRes, popRes, idhRes, pibRes] = await Promise.allSettled([
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29171/resultados/${ibgeCode}`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://servicodados.ibge.gov.br/api/v1/pesquisas/37/indicadores/30255/resultados/${ibgeCode}`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-1/variaveis/37?localidades=N3%5B${ibgeCode}%5D`, {
        headers: { "User-Agent": "BrasilOverviewApp/1.0" },
      }).then((r) => (r.ok ? r.json() : null)),
    ]);

    if (metaRes.status === "fulfilled" && metaRes.value) {
      apiMeta = metaRes.value;
    }

    if (munRes.status === "fulfilled" && Array.isArray(munRes.value) && munRes.value.length > 0) {
      apiMunicipiosCount = munRes.value.length;
    }

    // Trata série populacional do IBGE (pega o valor mais recente projetado/censo)
    if (popRes.status === "fulfilled" && Array.isArray(popRes.value) && popRes.value[0]?.res?.[0]?.res) {
      const popSeries = popRes.value[0].res[0].res;
      const latestYear = Object.keys(popSeries).sort().pop();
      const parsedPop = parseInt(popSeries[latestYear], 10);
      if (!isNaN(parsedPop) && parsedPop > 0) {
        apiPop = parsedPop;
      }
    }

    // Trata IDH oficial da API de pesquisas
    if (idhRes.status === "fulfilled" && Array.isArray(idhRes.value) && idhRes.value[0]?.res?.[0]?.res) {
      const idhSeries = idhRes.value[0].res[0].res;
      const latestIdhYear = Object.keys(idhSeries).sort().pop();
      const parsedIdh = parseFloat(idhSeries[latestIdhYear]);
      if (!isNaN(parsedIdh) && parsedIdh > 0) {
        apiIdh = parsedIdh;
      }
    }

    // Trata PIB oficial em Mil Reais da API do SIDRA
    if (pibRes.status === "fulfilled" && Array.isArray(pibRes.value) && pibRes.value[0]?.resultados?.[0]?.series?.[0]?.serie) {
      const pibSeries = pibRes.value[0].resultados[0].series[0].serie;
      const latestPibYear = Object.keys(pibSeries).sort().pop();
      const pibMilReais = parseFloat(pibSeries[latestPibYear]);
      if (!isNaN(pibMilReais) && pibMilReais > 0) {
        // Converte de Mil Reais para Bilhões de Reais
        apiPibTotalBilhoes = pibMilReais / 1000000;
      }
    }
  } catch (err) {
    console.warn(`Falha na consulta ao vivo das APIs do IBGE para ${uf}, utilizando base consolidada:`, err);
  }

  const regionName = apiMeta?.regiao?.nome || "Brasil";
  const regionPop = REGIONS_POPULATION[regionName] || BRAZIL_TOTAL_POPULATION;

  const pop = apiPop;
  const area = baseData.areaKm2;
  const density = pop / area;
  const regionalShare = (pop / regionPop) * 100;
  const nationalShare = (pop / BRAZIL_TOTAL_POPULATION) * 100;

  const pibTotalBilhoes = apiPibTotalBilhoes;
  const pibShareBrasil = (pibTotalBilhoes / BRAZIL_TOTAL_PIB_BILHOES) * 100;
  // Calcula PIB per capita dinamicamente a partir do PIB Total e População ao vivo
  const pibPerCapita = (pibTotalBilhoes * 1000000000) / pop;

  const rankings = calculateNationalRankings(code);

  const result = {
    stateName: apiMeta?.nome || stateMeta?.name || "Estado",
    stateUf: uf,
    regionName,
    capital: stateMeta?.capital || "Capital",
    gentilico: baseData.gentilico,
    biomaPrincipal: baseData.biomaPrincipal,
    pop,
    popFormatted: fmtNumber(pop),
    area,
    areaFormatted: `${fmtNumber(Math.round(area))} km²`,
    municipios: apiMunicipiosCount,
    pibTotalBilhoes,
    pibTotalFormatted: formatPibTotal(pibTotalBilhoes),
    pibShareBrasilFormatted: fmtPercent(pibShareBrasil),
    pibPerCapita,
    pibPerCapitaFormatted: fmtCurrency(pibPerCapita),
    idh: apiIdh,
    idhFormatted: apiIdh.toFixed(3),
    density,
    densityFormatted: `${density.toFixed(1)} hab/km²`,
    regionalShare,
    regionalShareFormatted: fmtPercent(regionalShare),
    nationalShare,
    nationalShareFormatted: fmtPercent(nationalShare),
    setores: baseData.setores,
    destaquesMunicipais: baseData.destaquesMunicipais,
    rankings,
    agroExport: {
      ...baseData.agroExport,
      exportacoesUsdFormatted: formatUsdExport(baseData.agroExport.exportacoesUsdBi),
    },
    socialDemografia: {
      ...baseData.socialDemografia,
      idadeMedianaFormatted: `${baseData.socialDemografia.idadeMediana} anos`,
      expectativaVidaFormatted: `${baseData.socialDemografia.expectativaVida.toFixed(1)} anos`,
      alfabetizacaoFormatted: `${baseData.socialDemografia.alfabetizacao.toFixed(1)}%`,
      urbanizacaoFormatted: `${baseData.socialDemografia.urbanizacao.toFixed(1)}%`,
    },
    saldoMigratorio: baseData.saldoMigratorio,
  };

  indicatorsCache[code] = result;
  return result;
}
