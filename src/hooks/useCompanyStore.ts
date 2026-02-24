import { useState, useEffect, useCallback } from "react";

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
    funcao: string;
    setor: string;
    answers: Record<string, number>;
    submittedAt: string;
}

const COMPANIES_KEY = "drps_companies";
const RESPONSES_KEY = "drps_responses";

const loadFromStorage = <T>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

const saveToStorage = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const useCompanyStore = () => {
    const [companies, setCompanies] = useState<Company[]>(() =>
        loadFromStorage<Company[]>(COMPANIES_KEY, [])
    );

    const [responses, setResponses] = useState<CompanyResponse[]>(() =>
        loadFromStorage<CompanyResponse[]>(RESPONSES_KEY, [])
    );

    // Persist whenever data changes
    useEffect(() => {
        saveToStorage(COMPANIES_KEY, companies);
    }, [companies]);

    useEffect(() => {
        saveToStorage(RESPONSES_KEY, responses);
    }, [responses]);

    const addCompany = useCallback((data: Omit<Company, "id" | "createdAt">): Company => {
        const newCompany: Company = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setCompanies((prev) => {
            // Avoid duplicates by CNPJ
            const exists = prev.find((c) => c.cnpj === data.cnpj);
            if (exists) return prev;
            return [...prev, newCompany];
        });
        return newCompany;
    }, []);

    const getCompanyById = useCallback(
        (id: string): Company | undefined => companies.find((c) => c.id === id),
        [companies]
    );

    const deleteCompany = useCallback((id: string) => {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        setResponses((prev) => prev.filter((r) => r.empresaId !== id));
    }, []);

    const addResponse = useCallback(
        (data: Omit<CompanyResponse, "id" | "submittedAt">): CompanyResponse => {
            const newResponse: CompanyResponse = {
                ...data,
                id: crypto.randomUUID(),
                submittedAt: new Date().toISOString(),
            };
            setResponses((prev) => [...prev, newResponse]);
            return newResponse;
        },
        []
    );

    const getResponsesByCompany = useCallback(
        (empresaId: string): CompanyResponse[] =>
            responses.filter((r) => r.empresaId === empresaId),
        [responses]
    );

    return {
        companies,
        responses,
        addCompany,
        getCompanyById,
        deleteCompany,
        addResponse,
        getResponsesByCompany,
    };
};
