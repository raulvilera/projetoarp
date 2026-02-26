import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "https://vzszzdeqbrjrepbzeiqq.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const ALLOWED_ORIGINS = [
    "https://digital-survey-craft.lovable.app",
    "https://drps-manager.vercel.app",
    "http://localhost:8080",
    "http://localhost:5173",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS manual para Serverless Function
    const origin = req.headers.origin as string;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { empresa_nome, funcao, setor, answers } = req.body || {};

    if (!empresa_nome || !funcao || !setor || !answers) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    try {
        // Busca o company_id pelo nome da empresa (case-insensitive)
        const { data: company } = await supabase
            .from("companies")
            .select("id")
            .ilike("nome", empresa_nome.trim())
            .maybeSingle();

        const { error } = await supabase.from("survey_responses").insert({
            company_id: company?.id ?? null,
            empresa_nome: empresa_nome.trim(),
            funcao: funcao.trim(),
            setor: setor.trim(),
            answers_json: answers,
        });

        if (error) {
            console.error("Erro Supabase:", error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ success: true, storage: "supabase" });
    } catch (err: any) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({ error: err.message });
    }
}
