import { createClient } from "@supabase/supabase-js";

// Conexão com o banco do Supabase.
// Os valores vêm do .env.local — nunca ficam escritos aqui (regra 5 do CLAUDE.md).
const url = process.env.SUPABASE_URL;
const chaveSecreta = process.env.SUPABASE_SECRET_KEY;

if (!url || !chaveSecreta) {
  throw new Error(
    "Faltam SUPABASE_URL e/ou SUPABASE_SECRET_KEY no arquivo .env.local"
  );
}

// Esta chave é secreta: este arquivo só pode ser usado no servidor,
// nunca em código que roda no navegador.
export const supabase = createClient(url, chaveSecreta, {
  auth: { persistSession: false },
});
