# 🎨 Quick Start — Estilo Carimbo Antigo

## O Que Você Tem

Três arquivos que transformam seu projeto em **estilo de atlas antigo com carimbos envelhecidos**:

1. **StateDetail.css** — Substitui o arquivo original (barra lateral + painéis)
2. **oldstamp-widgets.css** — Novo arquivo (estilos dos widgets)
3. **Documentação** — Guias completos de mudanças

---

## Como Usar (3 passos)

### ✅ Passo 1: Copiar os arquivos CSS

```bash
# Na raiz do seu projeto React
cp StateDetail.css src/pages/
cp oldstamp-widgets.css src/styles/
```

### ✅ Passo 2: Importar o novo CSS

Abra seu **main.jsx** ou **App.jsx** e adicione:

```javascript
// Sua importação de CSS global
import "./styles/theme.css";
import "./styles/atlas-theme.css"; // se usar

// ← ADICIONAR ESTA LINHA:
import "./styles/oldstamp-widgets.css";
```

**Importante**: A ordem importa! `oldstamp-widgets.css` deve vir **por último**.

### ✅ Passo 3: Salvar e recarregar

```bash
# Se estiver rodando o dev server:
npm run dev
# ou
yarn dev

# Depois acesse: http://localhost:5173/state/rs
```

---

## O Que Mudou Visualmente

| Antes | Depois |
|-------|--------|
| Barra lateral **verde sólido** | Barra lateral **creme envelhecido com textura** |
| Painéis em cores da bandeira | Painéis em **papel antigo branco** |
| Bordas cinza moderno | Bordas **sépia/terra** |
| Sem rotação | Cards com **rotação leve** (-0.5deg a +0.2deg) |
| Sem textura | **Textura de papel velho** (grão + manchas) |
| Fonts brancas em fundo escuro | Fonts **sépia escura** em fundo claro |

---

## Como Fica

```
┌─────────────────────────────────────┐
│                                     │
│  [← Voltar] ┌─ BARRA LATERAL ──┐   │
│             │ Textura Papel    │   │
│  Painel ID  │ Creme Envelhecido│   │
│  Branco/    │                  │   │
│  Bordas     │  [Nome Estado]   │   │
│  Sépia      │  UF  Tagline     │   │
│  Carimbo    │  [Chips]         │   │
│  com        │  ────────────    │   │
│  Rotação    │  [Menu Abas]     │   │
│             └──────────────────┘   │
│                      │              │
│    CONTEÚDO PRINCIPAL│              │
│    Widgets com       │              │
│    Carimbos Antigos  │              │
│    (Textura Paper)   │              │
│                      │              │
└─────────────────────────────────────┘
```

---

## Cores Principais

- **Papel**: `#fdfbf7` (creme muito claro)
- **Barra Lateral**: `#f5f2ed` (creme médio)
- **Bordas**: `#9b8b6b` (sépia terra)
- **Textos**: `#5a4a30` (sépia escura)
- **Detalhes**: `#8a8271` (sépia média)

---

## Troubleshooting

### ❌ "As mudanças não apareceram"
- Verificar se o arquivo CSS foi importado em **main.jsx**
- Fazer hard-refresh: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Limpar cache: Abrir DevTools (F12) → Settings → Disable cache (enquanto DevTools aberto)

### ❌ "Ficou muito diferente, quero reverter"
- Remover a importação de `oldstamp-widgets.css`
- Restaurar `StateDetail.css` original
- Recarregar a página

### ❌ "Os widgets não têm a textura"
- Certificar que `oldstamp-widgets.css` está sendo importado
- Verificar console (F12) se há erro de CSS
- Verificar se o caminho do import está correto

---

## Próximos Passos (Opcionais)

### Customizar as cores:
Abrir `oldstamp-widgets.css` e procurar por:
- `#9b8b6b` → trocar para sua cor de borda
- `#5a4a30` → trocar para sua cor de texto
- `#fdfbf7` → trocar para sua cor de fundo

### Aumentar/diminuir a textura:
Procurar por `rgba(120, 100, 60, 0.03)` e aumentar o terceiro número para mais textura.

### Ajustar a rotação:
Procurar por `transform: rotate()` e mudar o ângulo (ex: `-0.5deg` → `-1deg`).

---

## Arquivos de Referência

- **OLDSTAMP_GUIDE.md** — Guia completo e detalhado
- **CSS_CHANGES_SUMMARY.md** — Todas as mudanças CSS linha por linha
- **StateDetail.css** — Arquivo CSS modificado
- **oldstamp-widgets.css** — Estilos dos widgets

---

## ✨ Pronto!

Agora seu Dossiê Federativo tem **aspecto de atlas antigo envelhecido** mantendo legibilidade e funcionalidade total.

Qualquer dúvida, verifique os arquivos .md na pasta outputs.
