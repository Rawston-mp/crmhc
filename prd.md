# PRD — CRM

> Documento de produto. Junto com o `design.md`, é a fonte da verdade do projeto.
> Se o código discordar deste arquivo, o arquivo está certo — ou precisa ser atualizado de propósito.

---

## 1. O que é e pra quem

Um CRM simples e pessoal para organizar contatos e oportunidades de negócio em um só lugar, sem planilha solta e sem anotação perdida no celular.

É feito para um profissional ou dono de negócio pequeno que vende para poucos clientes por vez e precisa saber, a qualquer momento, quem está em que estágio da negociação e o que foi combinado com cada um.

O sucesso deste produto é medido por uma coisa só: nenhuma oportunidade esfriar por esquecimento.

---

## 2. O que já está construído

Esta era a lista da primeira versão (v1). **Está toda concluída.** Cada item só foi marcado como pronto depois de testado no navegador.

Dois itens não estavam no plano original e entraram no caminho — estão marcados com **(fora do plano original)**.

- [x] **Cadastro e listagem de contatos** — criar e listar contatos (nome, email, telefone), dos mais recentes para os mais antigos. O cadastro fica na área **Contatos**; a lista, na área **Funil**. Contato novo entra na etapa `novo`. Editar um contato já salvo ainda não existe.
- [x] **Funil com etapas** — cada contato fica em uma etapa: `novo`, `em contato`, `proposta`, `cliente`. Na área **Funil**, a etiqueta de etapa é também a escolha: trocar ali grava no banco na hora, e o Dashboard recalcula os números. Se a gravação falhar, a etiqueta volta ao que era.
- [x] **Anotações por contato** — histórico de anotações datadas dentro de cada contato, na página do contato. Dá para escrever, editar e excluir cada anotação.
- [x] **Multiusuário: cadastro com aprovação e dois papéis** *(fora do plano original)* — o sistema não é público e não é de uma pessoa só: qualquer um pode pedir acesso em `/register`, o cadastro nasce **pendente**, e só passa a funcionar depois que um administrador aprova na área **Usuários**. Dois papéis: `admin` (aprova e remove acessos, e é o único que enxerga a área Usuários) e `usuario` (usa o CRM). Senhas guardadas embaralhadas (scrypt) na tabela `usuarios`. Sem sessão válida, toda requisição cai no login; e o acesso é conferido de novo a cada requisição, então remover alguém tem efeito imediato, sem esperar a sessão vencer.

  > **Mudança de rumo:** a v1 começou com um administrador só e sem cadastro público. Virou cadastro aberto com aprovação manual do administrador, para dar acesso a mais de uma pessoa sem abrir o sistema para qualquer um.

- [x] **Follow-up gerado por IA** — dentro de cada contato, o botão "Gerar follow-up" escreve uma mensagem curta a partir do nome, da etapa e das anotações, para o usuário revisar e copiar com um clique. Cada mensagem fica guardada no banco com a data, na tabela `follow_ups`, para ser relida depois na página do contato. Quem escreve é o Claude (`claude-sonnet-4-6`), chamado só no servidor, para a chave da IA nunca chegar ao navegador. O envio continua sendo por fora, pelo próprio usuário.
- [x] **Painel com os números do funil** — a área **Dashboard** (a tela inicial do sistema): o total de contatos e a contagem por etapa, cada uma com a etiqueta na cor da sua etapa. Os números são contados no servidor a cada abertura da tela, então acompanham cadastro e mudança de etapa.
- [x] **De página única para sistema com áreas** *(fora do plano original)* — o CRM deixou de ser uma página com uma barra em cima. Agora tem navegação lateral fixa com quatro áreas — **Dashboard**, **Funil**, **Contatos** e **Usuários** (esta só para admin) —, cada uma com o seu próprio endereço, e a identidade visual escura da v2. Nenhuma funcionalidade entrou ou saiu nessa mudança: ver `design.md`.
- [x] **Publicação na internet** — o sistema está no ar em **crm.rawston.tech**, acessível por endereço, não só na máquina local.

  > A **v2 está publicada**: identidade escura, navegação lateral, Kanban, página do contato e Dashboard novo estão no ar. A tabela `follow_ups` foi criada no Supabase de produção junto com ela.

---

## 3. Versão 2

**Concluída.** Cada item só foi marcado como pronto depois de todas as checagens do seu **PRONTO QUANDO** passarem no navegador.

> A identidade visual da v2 (tema escuro, navegação lateral, áreas) está na seção 2. Com as três funcionalidades abaixo concluídas, **a v2 está completa** — falta publicá-la (ver a seção 2, item da publicação).

### 3.1 Kanban do funil

- [x] O Funil deixa de ser uma lista e vira um quadro de colunas — uma coluna por etapa —, onde o contato é um cartão que se move de coluna arrastando.

**PRONTO QUANDO**

1. Abro **Funil** e vejo quatro colunas na ordem `novo`, `em contato`, `proposta`, `cliente`, cada uma com o seu nome na cor da etapa e a quantidade de contatos daquela coluna.
2. Cada contato aparece como um cartão, na coluna da etapa em que está, mostrando pelo menos o nome.
3. Arrasto um cartão de uma coluna para outra e, ao soltar, ele fica na coluna nova; os contadores das duas colunas se acertam na hora.
4. Aperto F5 e o cartão continua na coluna nova — a mudança foi para o banco, não ficou só na tela.
5. Vou ao **Dashboard** e os números batem com o que o quadro mostra.

> **Entregue.** O cartão traz nome, email e há quanto tempo o contato foi cadastrado; um botão **Novo contato** abre o cadastro por cima do quadro, sem sair da tela; coluna vazia mostra "Nenhum contato aqui."; e enquanto o banco responde, as colunas aparecem já desenhadas com "Carregando...".
>
> Clicar no cartão abre a página do contato (item 3.2).

### 3.2 Página do contato

- [x] Cada contato passa a ter uma página só dele, com tudo em um lugar: dados, etapa, anotações e os follow-ups já gerados. Uma busca leva até ela sem precisar procurar na lista.

**PRONTO QUANDO**

1. Clico em um contato e chego numa página só dele, com endereço próprio — copio o link, abro em outra aba e caio no mesmo contato.
2. A página mostra, sem eu precisar clicar em mais nada: nome, email, telefone, a etapa atual, e o histórico de anotações com data.
3. Troco a etapa nessa página; volto ao **Dashboard** e o número da etapa nova subiu.
4. Escrevo parte do nome de um contato na busca, os contatos que batem aparecem enquanto digito, e clicar em um me leva para a página dele.
5. Gero um follow-up nessa página, saio dela e volto: o follow-up continua lá, com a data em que foi gerado.

> **Entregue.** Chega-se à página clicando num cartão do Kanban ou pela busca por nome/email na área **Contatos**. No topo: nome, email, telefone, a etapa (trocável ali mesmo, com a cor dela) e há quanto tempo é contato. Abaixo, duas seções: anotações e follow-ups. Contato que não existe avisa e oferece a volta para o Funil.
>
> **Mudança de comportamento:** o follow-up deixou de ser rascunho descartável e passou a ser guardado. Exigiu a tabela `follow_ups` no banco — o SQL está em `banco/follow_ups.sql`. A seção 2 foi corrigida para não continuar dizendo o contrário.

### 3.3 Dashboard v2

- [x] Os números do funil deixam de ser cinco quadros soltos e viram um painel de sistema, com um gráfico simples mostrando como os contatos se distribuem pelas etapas.

**PRONTO QUANDO**

1. Abro o **Dashboard** e vejo o total e a contagem por etapa; conto os cartões no Funil e os números batem.
2. Vejo um gráfico simples da distribuição por etapa, com cada etapa na cor que o `design.md` manda.
3. Movo um contato de etapa no Funil, volto ao Dashboard e o número **e** o gráfico mudaram juntos.
4. Com o sistema sem nenhum contato, o Dashboard não quebra nem mostra um gráfico vazio sem explicação: aparece uma frase dizendo que ainda não há contatos.
5. Estreito a janela até a largura de um celular e o painel e o gráfico continuam legíveis, sem barra de rolagem horizontal.

> **Entregue.** Cartões grandes com o total e a contagem por etapa; um gráfico de barras horizontais com a distribuição do funil, cada barra na cor da sua etapa; e a lista dos **5 contatos mais recentes**, cada um levando para a página dele. Sem contatos, o gráfico e a lista mostram "Nenhum contato cadastrado ainda." em vez de aparecerem quebrados.
>
> As barras são medidas contra a **maior** etapa, não contra o total: com poucos contatos, comparar com o total deixaria todas num fiapo e o gráfico não diria nada. O número exato fica ao lado de cada barra.
>
> O `design.md` foi ajustado junto: as cores de etapa passaram a valer também no cabeçalho da coluna do Kanban e na barra do gráfico — os dois lugares onde a coisa desenhada **é** a etapa.

---

## 4. Fora da v2 (fica pra v3)

- **Permissões avançadas** — dono por contato, metas por usuário, times, e qualquer permissão mais fina que os dois papéis que já existem (`admin` e `usuario`).
- **Automações e lembretes agendados** — lembrete de follow-up, tarefas com prazo, alertas, agenda, e regras do tipo "se ficar 7 dias parado, faça X".
- **Integrações com outros sistemas** — e-mail, WhatsApp, SMS, envio automático do follow-up, outros CRMs, ERPs, Google Contacts, e importar ou exportar planilha (CSV/Excel).
- **Aplicativo de celular** — aplicativo nativo. O sistema continua sendo um site que funciona bem no navegador do celular.

---

## 5. Continua fora, sem versão marcada

Isto não é "nunca" — é "não agora e não na próxima". Serve para a gente não se perder no meio do caminho.

**Usuários e acesso**
- Recuperação de senha por e-mail, troca de senha pela própria pessoa.
- Registro de quem fez o quê (cada contato e anotação é de todo mundo, não tem dono).

**Contatos**
- Editar ou excluir um contato já salvo.
- Excluir um follow-up guardado.

**Comunicação**
- Caixa de entrada ou histórico de mensagens recebidas dentro do sistema.

**Dados**
- Campos personalizados criados pelo usuário.
- Valor da oportunidade, moeda, previsão de faturamento e relatórios financeiros.
- Anexos e arquivos por contato.
- Lixeira, histórico de alterações ou auditoria.

**Interface**
- Personalização visual pelo usuário (escolher cores, trocar de tema). O tema escuro é a identidade do produto e a única aparência que existe — ver `design.md`.
- Filtros combinados e ordenação customizada. A busca da v2 (item 3.2) procura por nome; filtro por etapa, por data ou vários critérios ao mesmo tempo não entra.
