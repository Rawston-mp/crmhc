# Identidade visual do CRM

> Fonte da verdade do visual. Vale para **todas** as telas do projeto.
> Se uma tela não segue este arquivo, a tela está errada.

---

## 1. Clima

Ferramenta profissional, limpa e confiante. **Um produto, não um template.**

Na dúvida entre "bonito" e "claro", escolher claro. Na dúvida entre "moderno" e "sóbrio", escolher sóbrio.

---

## 2. Cores

### Base

| Uso | Cor | Variável CSS |
|---|---|---|
| Fundo da página (claro levemente quente) | `#FAFAF7` | `--fundo` |
| Superfícies (cartões, barras, campos) | `#FFFFFF` | `--superficie` |
| Borda sutil | `#E6E4DE` | `--borda` |
| Texto principal (grafite) | `#17181C` | `--texto` |
| Texto de apoio | `#6B6E76` | `--texto-apoio` |

### Destaque — uma cor só

| Uso | Cor | Variável CSS |
|---|---|---|
| Ações e elementos ativos (azul-cobalto) | `#1D4ED8` | `--destaque` |
| Estado hover / pressionado | `#1E40AF` | `--destaque-hover` |

**Nenhuma outra cor de marca.** Botão, link, item de menu selecionado, campo com foco: tudo usa esta cor.

### Etapas do funil — só nas etiquetas de etapa

| Etapa | Cor | Variável CSS |
|---|---|---|
| novo | `#64748B` | `--etapa-novo` |
| em contato | `#D97706` | `--etapa-em-contato` |
| proposta | `#7C3AED` | `--etapa-proposta` |
| cliente | `#15803D` | `--etapa-cliente` |

Estas cores **não** aparecem em botões, títulos, fundos de seção ou qualquer outro lugar. Só na etiqueta que indica a etapa de um contato.

---

## 3. Tipografia

**Manrope** (Google Fonts) em tudo. Nenhuma segunda fonte.

- **Títulos:** peso forte (700/800).
- **Textos:** peso normal (400), apoio pode usar 500.
- Tamanhos generosos e hierarquia clara: o título tem que ser obviamente maior que o texto, sem precisar comparar.

---

## 4. Formas e espaço

- **Cantos:** levemente arredondados, **10px** (`--raio`).
- **Separação:** borda visível (`--borda`) em vez de sombra. Sombra pesada não existe aqui.
- **Respiro:** bastante espaço entre os elementos. Se estiver apertado, aumentar o espaço antes de diminuir a fonte.

---

## 5. Proibido

- Gradientes.
- Efeito de vidro / desfoque (glassmorphism).
- Emojis na interface.
- Sombras exageradas.
- Animações chamativas.

**Se parecer template de IA, está errado.**
