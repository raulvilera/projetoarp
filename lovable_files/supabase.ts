// Arquivo: src/lib/supabase.ts
// COLE ESTE ARQUIVO NO PROJETO LOVABLE em src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vzszzdeqbrjrepbzeiqq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3p6ZGVxYnJqcmVwYnplaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDMyMTksImV4cCI6MjA4NzAxOTIxOX0.Tu5mtdmSE1mQJEcEr8TNbUndlAl1SOUfrIcNlG6-4k8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
