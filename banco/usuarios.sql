-- Tabela de usuários do sistema.
-- Executar no painel do Supabase: SQL Editor > New query > colar > Run.

create table usuarios (
  id uuid primary key default gen_random_uuid(),

  -- Nome de acesso. "unique" impede dois cadastros com o mesmo nome.
  usuario text not null unique,

  -- A senha embaralhada (scrypt). Nunca a senha em si.
  senha_hash text not null,

  -- O que a pessoa pode fazer.
  papel text not null default 'usuario' check (papel in ('admin', 'usuario')),

  -- Todo cadastro novo nasce pendente; só o admin aprova.
  situacao text not null default 'pendente'
    check (situacao in ('pendente', 'aprovado')),

  criado_em timestamptz not null default now()
);
