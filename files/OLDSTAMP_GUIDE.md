# Guia de Integração: Estilo Carimbo Antigo

## O que foi alterado

Este update transforma a barra lateral e todos os widgets para parecerem **carimbos antigos em papel envelhecido**, mantendo a legibilidade e a hierarquia visual.

### Mudanças Principais

#### 1. **Barra Lateral (`.state-rail`)**
- Fundo alterado de verde sólido para **papel creme envelhecido** (`#f5f2ed`)
- Textura SVG de papel velho aplicada (grão fino + manchas de idade)
- Sombra interna para profundidade
- Borda mais destacada (3px sólida)

#### 2. **Painel de Identidade (`.state-rail-identity`)**
- Fundo branco envelhecido (`#fdfbf7`) em vez de verde da bandeira
- Textura de papel velho + grão
- Bordas em **sépia envelhecida** (`#8b6d3f`)
- Efeito de carimbo com sombras múltiplas (inset + externa)
- Leve rotação (-0.5deg) para parecer organic
- Texto em cores sépia em vez de branco

#### 3. **Nome do Estado (`.state-name-title`)**
- Cor alterada de branco para **sépia envelhecida** (usa `--state-primary`)
- Text-shadow adicional para efeito envelhecido
- Melhor contraste sobre fundo claro

#### 4. **UF Badge**
- Bordas visíveis em sépia
- Efeito de carimbo com rotação leve (1deg)
- Fundo papel clarinho
- Sombra deslocada

#### 5. **Componentes (widgets)**
- Novo arquivo `oldstamp-widgets.css` fornece estilo consistente
- Todos os cards agora parecem carimbos antigos
- Textura de papel velho em todos os widgets
- Bordas em sépia em vez de cinza moderno
- Rotações leves (-0.3deg a +0.2deg) para efeito orgânico

## Como Integrar

### Passo 1: Copiar arquivos
```bash
# Copiar o CSS modificado
cp StateDetail.css src/pages/

# Copiar o novo CSS de widgets
cp oldstamp-widgets.css src/styles/
```

### Passo 2: Importar o novo CSS
No seu **main.jsx** ou **App.jsx**, após importar o CSS global:

```javascript
// main.jsx ou App.jsx
import "./styles/theme.css";           // CSS global padrão
import "./styles/atlas-theme.css";     // Tema atlas (se usar)
import "./styles/oldstamp-widgets.css"; // ← ADICIONAR ESTA LINHA
```

> **Importante**: A ordem de importação é crucial. `oldstamp-widgets.css` deve vir **DEPOIS** dos estilos padrão para sobrescrever os valores originais.

### Passo 3: Verificar no navegador
- Acesse `/state/rs` (ou qualquer estado)
- A barra lateral deve ter textura creme envelhecida
- Os widgets devem parecer carimbos antigos
- O painel de identidade deve ser branco com bordas sépia

## Cores Usadas

| Elemento | Cor | Código |
|----------|-----|--------|
| Fundo da barra lateral | Creme envelhecido | `#f5f2ed` |
| Fundo dos widgets | Creme clarinho | `#fdfbf7` |
| Bordas / Sépia | Sépia terra | `#9b8b6b` |
| Textos principais | Sépia escura | `#5a4a30` |
| Textos faint | Sépia média | `#8a8271` |
| Sombras | Preto suave | `rgba(0, 0, 0, 0.1-0.15)` |

## Customização Possível

### Ajustar intensidade da textura
No `oldstamp-widgets.css`, aumentar/diminuir a opacidade dos gradientes:
```css
rgba(120, 100, 60, 0.03)  /* Aumentar o terceiro valor para mais textura */
```

### Aumentar/diminuir a rotação
Procurar por `transform: rotate()` e ajustar o ângulo:
```css
transform: rotate(-0.5deg); /* Aumentar para -1deg, -1.5deg etc */
```

### Alterar tom de sépia
Localizar cores como `#9b8b6b` e ajustar:
- Mais quente (alaranjado): `#a89a6b`
- Mais cool (azulado): `#8b7b6b`

## Compatibilidade

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 12+
- ✅ Edge 80+
- ✅ Mobile (iOS Safari, Chrome Android)

### Fallback
Se o navegador não suportar `repeating-linear-gradient`, cairá para cor sólida (legível mas sem textura).

## Notas Importantes

1. **Nenhum change em JavaScript** — puramente CSS
2. **Totalmente responsivo** — desativa rotação em mobile (<800px)
3. **Acessibilidade mantida** — contraste WCAA A preservado
4. **Performance** — gradientes CSS não impactam performance
5. **Suporta temas de estado** — cores primária/secundária/accent dos temas continuam funcionando

## Reversão

Se precisar voltar ao estilo original:
1. Remover a importação de `oldstamp-widgets.css`
2. Reverter `StateDetail.css` para a versão original
3. Reload da página

## Suporte

Para customizações adicionais ou problemas, verificar:
- Console do navegador (F12) para warnings de CSS
- Media queries para responsividade em tamanhos diferentes
- Arquivos de tema individual do estado (`stateThemes.js`)
