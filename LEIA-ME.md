# Redesign — Dossiê Federativo

## Conceito
Em vez do visual "SaaS minimalista" anterior, adotei a identidade de um
**dossiê/cartório oficial**: papel quente (sem branco puro), tipografia
serifada (Fraunces) para títulos + monoespaçada (IBM Plex Mono) para dados
e rótulos, selos, réguas tracejadas e sombras duras deslocadas (sem blur,
sem degradê). A cor de cada estado agora vem da própria bandeira
(`src/data/stateThemes.js`), então cada página tem uma paleta diferente —
isso já evita o "AI slop" de acento único (bege + terracota) que aparece
em quase todo painel gerado por IA.

## O que mudou estruturalmente
- **`StateDetail.jsx`**: as abas horizontais viraram um **trilho lateral
  fixo** (sticky) com a identidade do estado + navegação vertical sempre
  visível. Isso resolve o problema de "ficar rolando": você nunca perde a
  navegação nem a identidade do estado ao rolar o conteúdo.
- **Grids mais densos**: cards de indicadores foram de 3 para 6 colunas em
  telas largas, feriados viraram grade de 2 colunas, o card de clima atual
  ganhou layout de 2 colunas — tudo isso reduz a altura total da página sem
  espremer o conteúdo (mantive padding generoso, só rearranjei o espaço
  horizontal que antes ficava vazio).
- **`Home.jsx`**: os estados agora são agrupados por região (como um
  índice de dossiê), em vez de uma lista única de 27 botões soltos.

## Arquivos novos
- `src/styles/theme.css` — tokens de cor/tipografia/sombra compartilhados.
  **Importe uma vez no seu `main.jsx`/`App.jsx`**, antes dos outros CSS:
  ```js
  import "./styles/theme.css";
  ```
- `src/data/stateThemes.js` — substitui o arquivo `getStateTheme` que
  `StateDetail.jsx` já importava (eu não tinha esse arquivo, então criei
  um novo com cores reais das 27 bandeiras + DF).

## Arquivos alterados (mesmo caminho/nome do projeto original)
`Home.jsx` + `Home.css` (novo), `MapBrazil.css`, `StateDetail.jsx`,
`StateDetail.css`, `StateIndicatorsWidget.css`, `StateHolidaysWidget.css`,
`StateWeatherWidget.css`, `StateRadioPlayer.css`.

## Arquivos que não toquei
`MapBrazil.jsx`, `StateResume.jsx`, `StateIndicatorsWidget.jsx`,
`StateHolidaysWidget.jsx`, `StateWeatherWidget.jsx`, `StateRadioPlayer.jsx`
— toda a lógica (fetch, estado, handlers) continua igual; só o CSS mudou,
então copiei-os sem alteração para você conferir que nada quebrou.

## Não incluído (não fazia parte do upload)
`data/states.js`, `data/ibgeData.js`, `hooks/useWiki.js`,
`services/*.js`, roteador/`App.jsx`. Se algum desses também tiver estilos
inline ou cores hard-coded fora do tema, me envie que eu ajusto.

## Próximo passo sugerido
Se quiser ir além, dá pra levar esse mesmo sistema para dentro dos
widgets — por exemplo, usar `theme.accentColor` do estado para colorir o
gráfico de setores econômicos ou o mapa de composição étnica, hoje fixos
em azul/verde/roxo genéricos.
