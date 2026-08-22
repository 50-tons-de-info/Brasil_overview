/**
 * Identidade Visual e Temas Distintos para todos os 27 Estados do Brasil
 * Cada estado possui sua paleta própria inspirada em suas bandeiras, biomas e cultura
 */

export const STATE_THEMES = {
  // SUL
  rs: {
    primaryColor: "#057A38", // Verde Farroupilha
    secondaryColor: "#D62728", // Vermelho
    accentColor: "#F59E0B", // Amarelo Dourado
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 122, 56, 0.18), transparent)",
    badgeBg: "rgba(5, 122, 56, 0.1)",
    badgeBorder: "rgba(5, 122, 56, 0.25)",
    badgeText: "#057A38",
    tagline: "Terra dos Pampas, Tradições Gaúchas e Fronteiras Meridionais",
    icon: "🧉",
  },
  sc: {
    primaryColor: "#0284C7", // Azul Oceano
    secondaryColor: "#10B981", // Verde Esmeralda
    accentColor: "#DC2626", // Vermelho Bandeira
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.18), transparent)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeBorder: "rgba(2, 132, 199, 0.25)",
    badgeText: "#0284C7",
    tagline: "Costa Esmeralda, Serra Catarinense e Tradição Europeia",
    icon: "🌊",
  },
  pr: {
    primaryColor: "#15803D", // Verde Pinheiro
    secondaryColor: "#0284C7", // Azul Iguaçu
    accentColor: "#EAB308", // Dourado
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(21, 128, 61, 0.18), transparent)",
    badgeBg: "rgba(21, 128, 61, 0.1)",
    badgeBorder: "rgba(21, 128, 61, 0.25)",
    badgeText: "#15803D",
    tagline: "Terra das Araucárias, Cataratas do Iguaçu e Polo Agroindustrial",
    icon: "🌲",
  },

  // SUDESTE
  sp: {
    primaryColor: "#DC2626", // Vermelho Paulista
    secondaryColor: "#1E293B", // Grafite Urbano
    accentColor: "#CA8A04", // Ouro
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220, 38, 38, 0.15), transparent)",
    badgeBg: "rgba(220, 38, 38, 0.08)",
    badgeBorder: "rgba(220, 38, 38, 0.25)",
    badgeText: "#DC2626",
    tagline: "Coração Econômico, Metropolitano e Cultural do Brasil",
    icon: "🏙️",
  },
  rj: {
    primaryColor: "#0284C7", // Azul Guanabara
    secondaryColor: "#F59E0B", // Sol Dourado
    accentColor: "#10B981", // Mata Atlântica
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.18), transparent)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeBorder: "rgba(2, 132, 199, 0.25)",
    badgeText: "#0284C7",
    tagline: "Cidade Maravilhosa, Costa do Sol e Patrimônio Histórico Nacional",
    icon: "🏖️",
  },
  mg: {
    primaryColor: "#B91C1C", // Vermelho Inconfidência
    secondaryColor: "#D97706", // Ouro Barroco
    accentColor: "#475569", // Serras de Minério
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(185, 28, 28, 0.15), transparent)",
    badgeBg: "rgba(185, 28, 28, 0.08)",
    badgeBorder: "rgba(185, 28, 28, 0.25)",
    badgeText: "#B91C1C",
    tagline: "Tradição Barroca, Cafezais, Serras Históricas e Hospitalidade Mineira",
    icon: "☕",
  },
  es: {
    primaryColor: "#0D9488", // Turquesa Capixaba
    secondaryColor: "#EC4899", // Rosa Convento
    accentColor: "#0284C7", // Azul Mar
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 148, 136, 0.18), transparent)",
    badgeBg: "rgba(13, 148, 136, 0.1)",
    badgeBorder: "rgba(13, 148, 136, 0.25)",
    badgeText: "#0D9488",
    tagline: "Terra da Moqueca Capixaba, Portos Estratégicos e Praias Paradisíacas",
    icon: "⚓",
  },

  // NORDESTE
  ba: {
    primaryColor: "#BE123C", // Vermelho Axé
    secondaryColor: "#D97706", // Dendê Solar
    accentColor: "#0284C7", // Baía de Todos-os-Santos
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(190, 18, 60, 0.16), transparent)",
    badgeBg: "rgba(190, 18, 60, 0.08)",
    badgeBorder: "rgba(190, 18, 60, 0.25)",
    badgeText: "#BE123C",
    tagline: "Berço Histórico do Brasil, Cultura Afro-Brasileira e Litoral Dourado",
    icon: "🥁",
  },
  pe: {
    primaryColor: "#2563EB", // Azul Frevo
    secondaryColor: "#DC2626", // Vermelho Bandeira
    accentColor: "#F59E0B", // Sol de Olinda
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.18), transparent)",
    badgeBg: "rgba(37, 99, 235, 0.1)",
    badgeBorder: "rgba(37, 99, 235, 0.25)",
    badgeText: "#2563EB",
    tagline: "Terra do Frevo, Maracatu, Rios dos Mangues e Ilha de Fernando de Noronha",
    icon: "🎭",
  },
  ce: {
    primaryColor: "#EA580C", // Laranja Sertão & Sol
    secondaryColor: "#0D9488", // Verde Jericoacoara
    accentColor: "#EAB308", // Dunas
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234, 88, 12, 0.18), transparent)",
    badgeBg: "rgba(234, 88, 12, 0.08)",
    badgeBorder: "rgba(234, 88, 12, 0.25)",
    badgeText: "#EA580C",
    tagline: "Terra da Luz, Falésias Coloridas, Ventos Alísios e Polo Tecnológico",
    icon: "🪁",
  },
  ma: {
    primaryColor: "#0284C7", // Azul Lençóis
    secondaryColor: "#DC2626", // Vermelho Bumba Meu Boi
    accentColor: "#EAB308", // Areia Dourada
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.18), transparent)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeBorder: "rgba(2, 132, 199, 0.25)",
    badgeText: "#0284C7",
    tagline: "Parque dos Lençóis Maranhenses, Azulejos Coloniais e Reggae Brasileiro",
    icon: "🏜️",
  },
  pb: {
    primaryColor: "#DC2626", // Vermelho Nego
    secondaryColor: "#000000", // Preto Histórico
    accentColor: "#F59E0B", // Ponta do Seixas
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220, 38, 38, 0.15), transparent)",
    badgeBg: "rgba(220, 38, 38, 0.08)",
    badgeBorder: "rgba(220, 38, 38, 0.25)",
    badgeText: "#DC2626",
    tagline: "Ponto Mais Oriental das Américas e Maior São João do Mundo",
    icon: "🌅",
  },
  rn: {
    primaryColor: "#15803D", // Verde Potiguar
    secondaryColor: "#EAB308", // Sol & Sal
    accentColor: "#0284C7", // Azul Ponta Negra
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(21, 128, 61, 0.18), transparent)",
    badgeBg: "rgba(21, 128, 61, 0.1)",
    badgeBorder: "rgba(21, 128, 61, 0.25)",
    badgeText: "#15803D",
    tagline: "Esquina do Continente, Dunas de Genipabu e Capital Espacial do Brasil",
    icon: "🚀",
  },
  al: {
    primaryColor: "#0284C7", // Azul Maragogi
    secondaryColor: "#DC2626", // Vermelho Guerreiro
    accentColor: "#10B981", // Coqueirais
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.18), transparent)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeBorder: "rgba(2, 132, 199, 0.25)",
    badgeText: "#0284C7",
    tagline: "Caribe Brasileiro, Piscinas Naturais de Maragogi e Lagoas Cristalinas",
    icon: "🪸",
  },
  se: {
    primaryColor: "#059669", // Verde Sergipano
    secondaryColor: "#2563EB", // Azul Estrelas
    accentColor: "#F59E0B", // Cânions do São Francisco
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 150, 105, 0.18), transparent)",
    badgeBg: "rgba(5, 150, 105, 0.1)",
    badgeBorder: "rgba(5, 150, 105, 0.25)",
    badgeText: "#059669",
    tagline: "Cânions do Xingó, Rio São Francisco e Capital da Qualidade de Vida",
    icon: "🛶",
  },
  pi: {
    primaryColor: "#059669", // Verde Carnaúba
    secondaryColor: "#D97706", // Sol & Fósseis
    accentColor: "#0284C7", // Delta do Parnaíba
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 150, 105, 0.18), transparent)",
    badgeBg: "rgba(5, 150, 105, 0.1)",
    badgeBorder: "rgba(5, 150, 105, 0.25)",
    badgeText: "#059669",
    tagline: "Berço do Homem Americano na Serra da Capivara e Único Delta em Mar Aberto",
    icon: "🦴",
  },

  // NORTE
  am: {
    primaryColor: "#047857", // Verde Floresta Amazônica
    secondaryColor: "#0369A1", // Encontro das Águas (Rio Negro e Solimões)
    accentColor: "#D97706", // Fauna & Frutos
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(4, 120, 87, 0.22), transparent)",
    badgeBg: "rgba(4, 120, 87, 0.1)",
    badgeBorder: "rgba(4, 120, 87, 0.25)",
    badgeText: "#047857",
    tagline: "Coração da Maior Floresta Tropical do Mundo e Encontro das Águas",
    icon: "🐆",
  },
  pa: {
    primaryColor: "#B91C1C", // Vermelho Bandeira
    secondaryColor: "#15803D", // Verde Floresta
    accentColor: "#D97706", // Açaí & Castanha
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(185, 28, 28, 0.16), transparent)",
    badgeBg: "rgba(185, 28, 28, 0.08)",
    badgeBorder: "rgba(185, 28, 28, 0.25)",
    badgeText: "#B91C1C",
    tagline: "Círio de Nazaré, Ilha do Marajó, Gastronomia Paraense e Riquezas Minerais",
    icon: "🥣",
  },
  ro: {
    primaryColor: "#047857", // Verde Madeira-Mamoré
    secondaryColor: "#0284C7", // Azul Rios
    accentColor: "#EAB308", // Estrela Dourada
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(4, 120, 87, 0.18), transparent)",
    badgeBg: "rgba(4, 120, 87, 0.1)",
    badgeBorder: "rgba(4, 120, 87, 0.25)",
    badgeText: "#047857",
    tagline: "Histórica Ferrovia do Diabo, Hidrelétricas do Rio Madeira e Agro Forte",
    icon: "🚂",
  },
  ac: {
    primaryColor: "#15803D", // Verde Seringueira
    secondaryColor: "#EAB308", // Amarelo Estrela
    accentColor: "#DC2626", // Vermelho Revolução
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(21, 128, 61, 0.18), transparent)",
    badgeBg: "rgba(21, 128, 61, 0.1)",
    badgeBorder: "rgba(21, 128, 61, 0.25)",
    badgeText: "#15803D",
    tagline: "Terra de Chico Mendes, Revolução Acreana e Geoglifos Pré-Colombianos",
    icon: "🌳",
  },
  ap: {
    primaryColor: "#0284C7", // Azul Equador
    secondaryColor: "#15803D", // Verde Florestal
    accentColor: "#EAB308", // Linha do Equador
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.18), transparent)",
    badgeBg: "rgba(2, 132, 199, 0.1)",
    badgeBorder: "rgba(2, 132, 199, 0.25)",
    badgeText: "#0284C7",
    tagline: "Meio do Mundo na Linha do Equador e Maior Fortaleza Colonial do Brasil",
    icon: "🌐",
  },
  rr: {
    primaryColor: "#0369A1", // Azul Monte Roraima
    secondaryColor: "#047857", // Verde Savana & Floresta
    accentColor: "#EAB308", // Estrela do Norte
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(3, 105, 161, 0.18), transparent)",
    badgeBg: "rgba(3, 105, 161, 0.1)",
    badgeBorder: "rgba(3, 105, 161, 0.25)",
    badgeText: "#0369A1",
    tagline: "Místico Monte Roraima, Terras Indígenas e Extremo Setentrional do Brasil",
    icon: "⛰️",
  },
  to: {
    primaryColor: "#D97706", // Amarelo Jalapão
    secondaryColor: "#0284C7", // Azul Ilha do Bananal
    accentColor: "#047857", // Cerrado Verde
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217, 119, 6, 0.18), transparent)",
    badgeBg: "rgba(217, 119, 6, 0.08)",
    badgeBorder: "rgba(217, 119, 6, 0.25)",
    badgeText: "#D97706",
    tagline: "O Mais Jovem Estado Brasileiro, Fervedouros do Jalapão e Maior Ilha Fluvial",
    icon: "💦",
  },

  // CENTRO-OESTE
  go: {
    primaryColor: "#059669", // Verde Agro
    secondaryColor: "#D97706", // Ouro das Minas de Goiás
    accentColor: "#2563EB", // Águas Termais
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 150, 105, 0.18), transparent)",
    badgeBg: "rgba(5, 150, 105, 0.1)",
    badgeBorder: "rgba(5, 150, 105, 0.25)",
    badgeText: "#059669",
    tagline: "Coração do Planalto Central, Chapada dos Veadeiros e Gigante do Agronegócio",
    icon: "🌾",
  },
  mt: {
    primaryColor: "#047857", // Verde Soja & Floresta
    secondaryColor: "#2563EB", // Pantanal Azul
    accentColor: "#EAB308", // Riquezas da Terra
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(4, 120, 87, 0.18), transparent)",
    badgeBg: "rgba(4, 120, 87, 0.1)",
    badgeBorder: "rgba(4, 120, 87, 0.25)",
    badgeText: "#047857",
    tagline: "Líder Nacional da Produção Agrícola, Portal do Pantanal e Chapada dos Guimarães",
    icon: "🚜",
  },
  ms: {
    primaryColor: "#0369A1", // Azul Rios Transparentes
    secondaryColor: "#047857", // Pantanal Verde
    accentColor: "#D97706", // Tradição Pantaneira
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(3, 105, 161, 0.18), transparent)",
    badgeBg: "rgba(3, 105, 161, 0.1)",
    badgeBorder: "rgba(3, 105, 161, 0.25)",
    badgeText: "#0369A1",
    tagline: "Santuário Ecológico de Bonito, Pantanal Sul-Mato-Grossense e Rota Bioceânica",
    icon: "🐟",
  },
  df: {
    primaryColor: "#2563EB", // Azul Céu de Brasília
    secondaryColor: "#EAB308", // Modernismo & Sol
    accentColor: "#10B981", // Verde Eixo Monumental
    heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.18), transparent)",
    badgeBg: "rgba(37, 99, 235, 0.1)",
    badgeBorder: "rgba(37, 99, 235, 0.25)",
    badgeText: "#2563EB",
    tagline: "Capital Federal do Brasil, Arquitetura de Niemeyer e Patrimônio da Humanidade",
    icon: "🏛️",
  },
};

/**
 * Retorna o tema configurado para o estado ou um tema neutro padrão
 */
export function getStateTheme(stateCode) {
  const code = (stateCode || "").toLowerCase();
  return (
    STATE_THEMES[code] || {
      primaryColor: "#2563eb",
      secondaryColor: "#10b981",
      accentColor: "#f59e0b",
      heroGlow: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.15), transparent)",
      badgeBg: "rgba(37, 99, 235, 0.08)",
      badgeBorder: "rgba(37, 99, 235, 0.2)",
      badgeText: "#2563eb",
      tagline: "Unidade Federativa da República Federativa do Brasil",
      icon: "🇧🇷",
    }
  );
}
