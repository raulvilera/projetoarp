// Arquivo: src/lib/supabase.ts — VERSÃO ATUALIZADA
// COLE ESTE ARQUIVO NO PROJETO LOVABLE em src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vzszzdeqbrjrepbzeiqq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3p6ZGVxYnJqcmVwYnplaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTksImV4cCI6MjA4NzAxOTIxOX0.Tu5mtdmSE1mQJEcEr8TNbUndlAl1SOUfrIcNlG6-4k8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Garante que há uma sessão anônima ativa antes de inserir dados.
 * O Supabase requer que "Enable anonymous sign-ins" esteja ativo nas configurações
 * do projeto (Authentication > Settings > Enable anonymous sign-ins).
 */
export const ensureAnonSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        await supabase.auth.signInAnonymously();
    }
};
