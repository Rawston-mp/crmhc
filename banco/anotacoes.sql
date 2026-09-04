-- Tabela de anotações: um histórico datado por contato.
-- Executar no painel do Supabase: SQL Editor > New query > colar > Run.

create table anotacoes (
  id uuid primary key default gen_random_uuid(),
  -- Ligação com o contato dono da anotação.
  -- "on delete cascade": se o contato for apagado, as anotações dele vão junto.
  contato_id uuid not null references contatos(id) on delete cascade,
  texto text not null,
  criado_em timestamptz not null default now()
);

-- Deixa rápido buscar as anotações de um contato, da mais nova para a mais antiga.
create index anotacoes_por_contato on anotacoes (contato_id, criado_em desc);
