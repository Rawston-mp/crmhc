# Identidade visual do CRM — v2 · Dark Tech

> Fonte da verdade do visual. Vale para **todas** as telas do projeto,
> incluindo login, cadastro e usuários.
> Se uma tela não segue este arquivo, a tela está errada.
>
> Esta é a v2. Ela **substitui por inteiro** a identidade clara da v1.

---

## 1. Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite.
**Um produto profissional, não um template.**

Na dúvida entre "bonito" e "claro", escolher claro. Na dúvida entre "moderno"
e "sóbrio", escolher sóbrio. O escuro aqui não é enfeite: é o ambiente de
trabalho de quem passa horas na tela.

---

## 2. Cores

### Base

| Uso | Cor | Variável CSS |
|---|---|---|
| Fundo da página (quase-preto azulado) | `#0D1117` | `--fundo` |
| Superfícies (cartões, barras, campos) | `#151B24` | `--superficie` |
| Superfícies elevadas (modais, menus) | `#1B222E` | `--superficie-alta` |
| Borda visível | `#262F3D` | `--borda` |
| Texto principal | `#E6EAF2` | `--texto` |
| Texto de apoio | `#94A0B8` | `--texto-apoio` |

### Destaque — uma cor só

| Uso | Cor | Variável CSS |
|---|---|---|
| Ações e elementos ativos (azul elétrico) | `#4D8DFF` | `--destaque` |
| Estado hover / pressionado (mais claro) | `#6BA1FF` | `--destaque-hover` |

**Nenhuma outra cor de marca.** Botão, link, item de navegação ativo, campo
com foco: tudo usa esta cor.

Atenção ao contrário da v1: no escuro, o hover **clareia**, não escurece.

### Etapas do funil — só nas etiquetas de etapa

Versões luminosas, legíveis sobre o fundo escuro.

| Etapa | Cor | Variável CSS |
|---|---|---|
| novo | `#8B99AD` | `--etapa-novo` |
| em contato | `#F5A524` | `--etapa-em-contato` |
| proposta | `#A78BFA` | `--etapa-proposta` |
| cliente | `#34D399` | `--etapa-cliente` |

Estas cores **não** aparecem em botões, títulos, fundos de seção ou qualquer
outro lugar. Só onde a coisa desenhada **é** a etapa:

- a etiqueta que indica a etapa de um contato;
- a coluna do Kanban, no seu cabeçalho;
- a barra de cada etapa no gráfico do Dashboard.

Fora dessas três, nenhuma.

Como são cores claras, a etiqueta é a cor **no texto e na borda**, sobre fundo
escuro — texto escuro sobre bloco colorido brilharia demais.

No Funil, a etiqueta é também a escolha da etapa: mesma forma e mesma cor, com
uma seta desenhada à direita. A seta é feita de borda CSS e segue a cor da
etapa — nada de imagem nem de emoji. A lista aberta usa `--superficie-alta`.

### Erro

| Uso | Cor | Variável CSS |
|---|---|---|
| Mensagens de erro | `#F87171` | `--erro` |

Contraste sempre confortável de ler. Nada de cinza sobre cinza.

---

## 3. Tipografia

Duas fontes, com papéis separados e sem exceção:

- **Manrope** (Google Fonts) — todo o texto: títulos, parágrafos, botões,
  campos, navegação.
- **JetBrains Mono** (Google Fonts) — **números, contadores e etiquetas
  técnicas**: os números do painel, as etiquetas de etapa, o selo `admin`,
  datas e qualquer rótulo curto que funciona como código. É o toque tech.

Regras de peso:

- **Títulos:** peso forte (700/800).
- **Textos:** peso normal (400), apoio pode usar 500.
- **Etiquetas técnicas (mono):** peso 500/700, corpo menor, letra levemente
  espaçada e em minúsculas.
- Tamanhos generosos e hierarquia clara: o título tem que ser obviamente maior
  que o texto, sem precisar comparar.

---

## 4. Formas e espaço

- **Cantos:** levemente arredondados, **10px** (`--raio`).
- **Separação:** borda visível (`--borda`) em vez de sombra. Sombra pesada não
  existe aqui — no escuro, quem separa as coisas é a borda.
- **Respiro:** bastante espaço entre os elementos. Se estiver apertado,
  aumentar o espaço antes de diminuir a fonte.

---

## 5. Estrutura: de página para sistema

A v1 era uma página com uma barra em cima. A v2 é um **sistema**: um shell
(a moldura fixa que envolve toda tela de dentro) com navegação lateral.

### Shell de aplicação

```
┌──────────────────────────────────────────────┐
│  Meu CRM              usuário · admin · Sair │  cabeçalho
├────────────┬─────────────────────────────────┤
│ Dashboard  │                                 │
│ Funil      │      área de conteúdo           │
│ Contatos   │      (uma tela cheia)           │
│ Usuários   │                                 │
└────────────┴─────────────────────────────────┘
   navegação
```

- **Cabeçalho** (largura toda, no topo): o nome do CRM à esquerda; à direita
  quem está logado (com o selo `admin`, quando for o caso) e o botão **Sair**.
- **Navegação lateral fixa à esquerda**: as áreas do sistema, uma abaixo da
  outra. Hoje: **Dashboard**, **Funil**, **Contatos** e **Usuários** — este
  último visível **somente para admin**. A lista é feita para crescer: área
  nova é uma linha a mais, nada muda de lugar.
- **Área de conteúdo à direita**: cada área é uma tela cheia, com o seu próprio
  endereço. Nada de empilhar tudo numa página só.

### Item ativo

O item da área em que você está usa a **cor de destaque** — no texto, com uma
faixa vertical de 2px na borda esquerda e um fundo levemente elevado
(`--superficie-alta`). Só um item ativo por vez, e ele é óbvio.

### Telas estreitas

Abaixo de 860px a navegação **se recolhe de um jeito simples e usável**: sai da
lateral e vira uma faixa horizontal logo abaixo do cabeçalho, com os mesmos
itens lado a lado, rolando na horizontal se não couberem. Sem botão de menu,
sem gaveta que abre e fecha: os itens continuam todos visíveis e a um toque.

### Telas de fora do sistema

Login e cadastro **não** têm shell — são um cartão centrado na tela escura,
com o nome do CRM. Mesmas cores, mesmas fontes, mesmas formas.

---

## 6. Proibido

- Gradientes.
- Efeito de vidro / desfoque (glassmorphism).
- Emojis na interface.
- Sombras exageradas.
- Animações chamativas.

**Se parecer template de IA, está errado.**
