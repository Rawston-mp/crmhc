-- Tabela de follow-ups: as mensagens que a IA escreveu para um contato.
-- Antes elas eram só um rascunho na tela e se perdiam ao fechar a página;
-- agora ficam guardadas para reler depois.
-- Executar no painel do Supabase: SQL Editor > New query > colar > Run.

create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  -- Ligação com o contato para quem a mensagem foi escrita.
  -- "on delete cascade": se o contato for apagado, os follow-ups dele vão junto.
  contato_id uuid not null references contatos(id) on delete cascade,
  texto text not null,
  criado_em timestamptz not null default now()
);

-- Deixa rápido buscar os follow-ups de um contato, do mais novo para o mais antigo.
create index follow_ups_por_contato on follow_ups (contato_id, criado_em desc);
