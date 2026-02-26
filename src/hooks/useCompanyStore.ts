import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Company {
    id: string;
    nome: string;
    cnpj: string;
    cidade: string;
    uf: string;
    createdAt: string;
}

export interface CompanyResponse {
    id: string;
    empresaId: string;
    empresa_nome: string;
    funcao: string;
    setor: string;
    answers: Record<string, number>;
    submittedAt: string;
}

export const useCompanyStore = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [responses, setResponses] = useState<CompanyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Carrega empresas do Supabase ao montar
    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("companies")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Erro ao carregar empresas:", error);
            } else {
                setCompanies(
                    (data ?? []).map((c) => ({
                        id: c.id,
                        nome: c.nome,
                        cnpj: c.cnpj,
                        cidade: c.cidade,
                        uf: c.uf,
                        createdAt: c.created_at,
                    }))
                );
            }
            setIsLoading(false);
        };

        fetchCompanies();
    }, []);

    // Carrega respostas do Supabase ao montar
    useEffect(() => {
        const fetchResponses = async () => {
            const { data, error } = await supabase
                .from("survey_responses")
                .select("*")
                .order("submitted_at", { ascending: false });

            if (!error && data) {
                setResponses(
                    data.map((r) => ({
                        id: r.id,
                        empresaId: r.company_id ?? "",
                        empresa_nome: r.empresa_nome,
                        funcao: r.funcao,
                        setor: r.setor,
                        answers: r.answers_json ?? {},
                        submittedAt: r.submitted_at,
                    }))
                );
            }
        };

        fetchResponses();
    }, []);

    const addCompany = useCallback(async (data: Omit<Company, "id" | "createdAt">): Promise<Company | null> => {
        const { data: inserted, error } = await supabase
            .from("companies")
            .insert({
                nome: data.nome,
                cnpj: data.cnpj,
                cidade: data.cidade,
                uf: data.uf,
            })
            .select()
            .single();

        if (error) {
            console.error("Erro ao salvar empresa:", error);
            toast({
                variant: "destructive",
                title: "Erro ao salvar empresa",
                description: error.message,
            });
            return null;
        }

        const newCompany: Company = {
            id: inserted.id,
            nome: inserted.nome,
            cnpj: inserted.cnpj,
            cidade: inserted.cidade,
            uf: inserted.uf,
            createdAt: inserted.created_at,
        };

        setCompanies((prev) => {
            const exists = prev.find((c) => c.cnpj === data.cnpj);
            if (exists) return prev;
            return [newCompany, ...prev];
        });

        return newCompany;
    }, [toast]);

    const getCompanyById = useCallback(
        (id: string): Company | undefined => companies.find((c) => c.id === id),
        [companies]
    );

    const deleteCompany = useCallback(async (id: string) => {
        const { error } = await supabase.from("companies").delete().eq("id", id);
        if (!error) {
            setCompanies((prev) => prev.filter((c) => c.id !== id));
            setResponses((prev) => prev.filter((r) => r.empresaId !== id));
        }
    }, []);

    const getResponsesByCompany = useCallback(
        (empresaId: string): CompanyResponse[] =>
            responses.filter((r) => r.empresaId === empresaId),
        [responses]
    );

    // Força recarregar respostas (útil após novos formulários enviados)
    const refreshResponses = useCallback(async () => {
        const { data, error } = await supabase
            .from("survey_responses")
            .select("*")
            .order("submitted_at", { ascending: false });

        if (!error && data) {
            setResponses(
                data.map((r) => ({
                    id: r.id,
                    empresaId: r.company_id ?? "",
                    empresa_nome: r.empresa_nome,
                    funcao: r.funcao,
                    setor: r.setor,
                    answers: r.answers_json ?? {},
                    submittedAt: r.submitted_at,
                }))
            );
        }
    }, []);

    const addResponse = useCallback(async (data: {
        empresaId: string;
        funcao: string;
        setor: string;
        answers: Record<string, number>;
    }) => {
        const company = companies.find(c => c.id === data.empresaId);
        const empresaNome = company ? company.nome : "Empresa não identificada";

        const { data: inserted, error } = await supabase
            .from("survey_responses")
            .insert({
                company_id: data.empresaId,
                empresa_nome: empresaNome,
                funcao: data.funcao,
                setor: data.setor,
                answers_json: data.answers,
            })
            .select()
            .single();

        if (error) {
            console.error("Erro ao salvar resposta no Supabase:", error);
            throw error;
        }

        const newResponse: CompanyResponse = {
            id: inserted.id,
            empresaId: inserted.company_id,
            empresa_nome: inserted.empresa_nome,
            funcao: inserted.funcao,
            setor: inserted.setor,
            answers: inserted.answers_json,
            submittedAt: inserted.submitted_at,
        };

        setResponses((prev) => [newResponse, ...prev]);
        return newResponse;
    }, [companies]);

    return {
        companies,
        responses,
        isLoading,
        addCompany,
        addResponse,
        getCompanyById,
        deleteCompany,
        getResponsesByCompany,
        refreshResponses,
    };
};
