// Paleta oficial extraída das bandeiras dos estados, preservando as cores reais
// em vez de uma versão envelhecida que deslocava a identidade visual do estado.
const RAW_THEMES = {
  ac: { primaryColor: "#06994F", secondaryColor: "#F1E61D", accentColor: "#AF4605", tagline: "Onde a floresta guia o relógio do estado" },
  al: { primaryColor: "#D62922", secondaryColor: "#0377B8", accentColor: "#F8FBF9", tagline: "Litoral de águas claras e cana-de-açúcar" },
  ap: { primaryColor: "#0F9450", secondaryColor: "#062576", accentColor: "#F1E623", tagline: "Fronteira verde entre o Brasil e o Equador" },
  am: { primaryColor: "#FCFAFB", secondaryColor: "#CF0404", accentColor: "#171F64", tagline: "O gigante de rios que sustenta a Amazônia" },
  ba: { primaryColor: "#FCF8F7", secondaryColor: "#C4170E", accentColor: "#1315A9", tagline: "Berço do Brasil, coração do Recôncavo" },
  ce: { primaryColor: "#0A973B", secondaryColor: "#EEE119", accentColor: "#F0F7BF", tagline: "Terra da luz e das dunas do Nordeste" },
  df: { primaryColor: "#FCFEFD", secondaryColor: "#118D3C", accentColor: "#88C747", tagline: "O planalto que projeta a República" },
  es: { primaryColor: "#EA5D8D", secondaryColor: "#07A1CC", accentColor: "#F8F7FA", tagline: "Entre o mar e os picos capixabas" },
  go: { primaryColor: "#17923C", secondaryColor: "#E2EA34", accentColor: "#182F64", tagline: "Cerrado produtivo no centro do país" },
  ma: { primaryColor: "#F9F3F1", secondaryColor: "#CB161A", accentColor: "#220A82", tagline: "Onde os Lençóis reescrevem o litoral" },
  mt: { primaryColor: "#281669", secondaryColor: "#308834", accentColor: "#DCCC1B", tagline: "Onde o Pantanal encontra o cerrado" },
  ms: { primaryColor: "#6799FA", secondaryColor: "#098D45", accentColor: "#F0F9FA", tagline: "Portal sul do Pantanal brasileiro" },
  mg: { primaryColor: "#FDFEFD", secondaryColor: "#F30605", accentColor: "#FDFEFD", tagline: "Serras, minas e a liberdade tardia" },
  pa: { primaryColor: "#F80405", secondaryColor: "#FAF8F6", accentColor: "#3574A5", tagline: "Portal amazônico do rio-mar" },
  pb: { primaryColor: "#EB0505", secondaryColor: "#050302", accentColor: "#EB0505", tagline: "Ponta mais oriental das Américas" },
  pr: { primaryColor: "#F9FDFB", secondaryColor: "#068C46", accentColor: "#314F92", tagline: "Araucárias e cataratas no sul do país" },
  pe: { primaryColor: "#FBFBFC", secondaryColor: "#141064", accentColor: "#D9C568", tagline: "Cruzeiro do Sul sobre o Recife" },
  pi: { primaryColor: "#D4D933", secondaryColor: "#779A0F", accentColor: "#15157B", tagline: "Delta e sertão nas terras dos dinossauros" },
  rj: { primaryColor: "#FBFDFB", secondaryColor: "#07AFED", accentColor: "#FBFDFB", tagline: "Baía de Guanabara sob o Cristo Redentor" },
  rn: { primaryColor: "#FBFDF8", secondaryColor: "#09973A", accentColor: "#DADD39", tagline: "Dunas douradas na esquina do continente" },
  rs: { primaryColor: "#CF2D20", secondaryColor: "#0D8C41", accentColor: "#FDF209", tagline: "Pampa, fronteira e tradição gaúcha" },
  ro: { primaryColor: "#042681", secondaryColor: "#0C964B", accentColor: "#ECE724", tagline: "Fronteira agrícola da Amazônia ocidental" },
  rr: { primaryColor: "#F5FBF2", secondaryColor: "#09A4F5", accentColor: "#15790B", tagline: "O extremo norte sob o Monte Roraima" },
  sc: { primaryColor: "#EB3535", secondaryColor: "#FBF2EC", accentColor: "#A7C54F", tagline: "Ilha e serra na costa mais ao sul" },
  sp: { primaryColor: "#171717", secondaryColor: "#F7F3F4", accentColor: "#921F15", tagline: "Motor industrial e cultural do país" },
  se: { primaryColor: "#0D8F3F", secondaryColor: "#F5C509", accentColor: "#24205C", tagline: "O menor estado, litoral do Vale do São Francisco" },
  to: { primaryColor: "#FBFCF9", secondaryColor: "#1D44AB", accentColor: "#F89609", tagline: "Cerrado jovem entre a Amazônia e o sertão" },
};

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const num = Number.parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function withDerivedTones(theme) {
  return {
    ...theme,
    badgeBg: hexToRgba(theme.primaryColor, 0.12),
    badgeBorder: hexToRgba(theme.primaryColor, 0.38),
    badgeText: theme.primaryColor,
    secondaryBg: hexToRgba(theme.secondaryColor, 0.12),
    secondaryBorder: hexToRgba(theme.secondaryColor, 0.35),
    accentBg: hexToRgba(theme.accentColor, 0.12),
    accentBorder: hexToRgba(theme.accentColor, 0.35),
  };
}

export const STATE_THEMES = Object.fromEntries(
  Object.entries(RAW_THEMES).map(([uf, theme]) => [uf, withDerivedTones(theme)])
);

const FALLBACK_THEME = withDerivedTones({
  primaryColor: "#4a5f4a",
  secondaryColor: "#c9a227",
  accentColor: "#8c3230",
  tagline: "Unidade federativa do Brasil",
});

export function getStateTheme(stateCode) {
  const code = (stateCode || "").toLowerCase();
  return STATE_THEMES[code] || FALLBACK_THEME;
}