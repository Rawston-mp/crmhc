# PRD — CRM

> Documento de produto. Junto com o `design.md`, é a fonte da verdade do projeto.
> Se o código discordar deste arquivo, o arquivo está certo — ou precisa ser atualizado de propósito.

---

## 1. O que é e pra quem

Um CRM simples e pessoal para organizar contatos e oportunidades de negócio em um só lugar, sem planilha solta e sem anotação perdida no celular.

É feito para um profissional ou dono de negócio pequeno que vende para poucos clientes por vez e precisa saber, a qualquer momento, quem está em que estágio da negociação e o que foi combinado com cada um.

O sucesso deste produto é medido por uma coisa só: nenhuma oportunidade esfriar por esquecimento.

---

## 2. Funcionalidades da primeira versão (v1)

Lista de itens a concluir. Cada item só é marcado como pronto depois de testado no navegador.

- [x] **Cadastro e listagem de contatos** — criar e listar contatos (nome, email, telefone), dos mais recentes para os mais antigos. Contato novo entra na etapa `novo`. Editar contato fica para uma etapa seguinte.
- [ ] **Funil com etapas** — cada contato fica em uma etapa: `novo`, `em contato`, `proposta`, `cliente`. Dá para mover entre etapas.
- [x] **Anotações por contato** — histórico de anotações datadas dentro de cada contato, abertas na própria lista. Dá para escrever, editar e excluir cada anotação.
- [x] **Login e usuários com aprovação** — o sistema não é público. Qualquer pessoa pode se cadastrar em `/register`, mas o cadastro nasce **pendente** e só entra depois que um administrador aprova em `/usuarios`. Dois papéis: `admin` (aprova e remove acessos) e `usuario` (usa o CRM). Senhas guardadas embaralhadas (scrypt) na tabela `usuarios`. Sem sessão válida, toda requisição cai no login.
- [x] **Follow-up gerado por IA** — dentro de cada contato, o botão "Gerar follow-up" escreve uma mensagem curta a partir do nome, da etapa e das anotações, para o usuário revisar e copiar com um clique. A mensagem não é guardada: é um rascunho. Quem escreve é o Claude (`claude-sonnet-4-6`), chamado só no servidor.
- [x] **Painel com os números do funil** — no topo da home: o total de contatos e a contagem por etapa, cada uma com a etiqueta na cor da sua etapa. Os números saem da mesma lista que a tela já tem, então acompanham cadastro e mudança de etapa na hora.
- [ ] **Publicação na internet** — o sistema no ar, acessível por um endereço, não só na máquina local.

---

## 3. O que NÃO entra na primeira versão

Isto não é "nunca" — é "agora não". Serve para a gente não se perder no meio do caminho.

**Usuários e acesso**
- Times, ou permissões mais finas que os dois papéis existentes (`admin` e `usuario`).
- Recuperação de senha por e-mail, troca de senha pela própria pessoa.
- Registro de quem fez o quê (cada contato e anotação é de todo mundo, não tem dono).

> Mudança de rumo: a v1 começou com um administrador só e sem cadastro público. Virou cadastro aberto com aprovação manual do administrador, para dar acesso a mais de uma pessoa sem abrir o sistema para qualquer um.

**Comunicação**
- Envio automático do follow-up. A IA escreve o texto; quem envia é o usuário, por fora.
- Integração com e-mail, WhatsApp, SMS ou telefone.
- Caixa de entrada ou histórico de mensagens dentro do sistema.

**Automação e produtividade**
- Lembretes, tarefas com prazo, notificações e alertas.
- Agenda e calendário.
- Regras automáticas do tipo "se ficar 7 dias parado, faça X".

**Dados**
- Importar ou exportar planilhas (CSV/Excel).
- Campos personalizados criados pelo usuário.
- Valor da oportunidade, moeda, previsão de faturamento e relatórios financeiros.
- Anexos e arquivos por contato.
- Lixeira, histórico de alterações ou auditoria.

**Interface**
- Aplicativo mobile nativo.
- Arrastar e soltar cartões entre as etapas (mover por botão/seleção já resolve na v1).
- Tema escuro e personalização visual.
- Busca avançada, filtros combinados e ordenação customizada.

**Integrações**
- Conexão com outros CRMs, ERPs, Google Contacts ou qualquer serviço externo.
- Cobrança, assinatura ou pagamento dentro do produto.
