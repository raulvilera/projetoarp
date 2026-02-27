import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, Search, Building2 } from "lucide-react";

interface CompanyRegistrationProps {
    onCancel: () => void;
    onSave?: () => void;
}

interface BrasilApiEmpresa {
    cnpj: string;
    razao_social: string;
    municipio: string;
    uf: string;
}

const formatCnpj = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};

const CompanyRegistration = ({ onCancel, onSave }: CompanyRegistrationProps) => {
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [sugestoes, setSugestoes] = useState<BrasilApiEmpresa[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const { addCompany } = useCompanyStore();

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setMostrarSugestoes(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Busca empresas pelo nome com debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const termo = nome.trim();
        if (termo.length < 3) {
            setSugestoes([]);
            setMostrarSugestoes(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setBuscando(true);
            try {
                const encoded = encodeURIComponent(termo);
                const response = await fetch(
                    `https://brasilapi.com.br/api/cnpj/v1/search?company_name=${encoded}&limit=8`
                );
                if (response.ok) {
                    const data: BrasilApiEmpresa[] = await response.json();
                    setSugestoes(data);
                    setMostrarSugestoes(data.length > 0);

                    // Lógica de Preenchimento Automático (Se houver apenas um ou match exato)
                    if (data.length > 0) {
                        const matchExato = data.find(emp =>
                            emp.razao_social.toLowerCase() === termo.toLowerCase() ||
                            emp.cnpj === termo.replace(/\D/g, "")
                        );

                        // Se encontrou um match exato, preenche os outros campos sem esperar clique
                        if (matchExato && !cnpj) {
                            selecionarEmpresa(matchExato);
                        }
                    }
                } else {
                    setSugestoes([]);
                    setMostrarSugestoes(false);
                }
            } catch {
                setSugestoes([]);
                setMostrarSugestoes(false);
            } finally {
                setBuscando(false);
            }
        }, 800); // Aumentado um pouco o debounce para evitar chamadas excessivas
    }, [nome]);

    const selecionarEmpresa = async (empresa: BrasilApiEmpresa) => {
        setMostrarSugestoes(false);
        const razao = empresa.razao_social || "";
        setNome(razao);
        setCnpj(formatCnpj(empresa.cnpj));

        if (empresa.municipio) setCidade(empresa.municipio);
        if (empresa.uf) setUf(empresa.uf);

        // Busca detalhada obrigatória para garantir todos os campos
        setLoading(true);
        try {
            const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${empresa.cnpj}`);
            if (res.ok) {
                const data = await res.json();
                // Prioriza os campos da busca detalhada que são mais precisos
                if (data.razao_social) setNome(data.razao_social);
                setCidade(data.municipio || empresa.municipio || "");
                setUf(data.uf || empresa.uf || "");

                toast({
                    title: "✅ Dados sincronizados!",
                    description: "Informações da empresa carregadas da Receita Federal.",
                });
            }
        } catch (error) {
            console.error("Erro na busca detalhada:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fallback: ao digitar CNPJ manualmente no campo CNPJ
    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (raw.length <= 14) setCnpj(formatCnpj(raw));
    };

    useEffect(() => {
        const rawCnpj = cnpj.replace(/\D/g, "");
        // Só busca se tiver 14 dígitos e o nome ainda não estiver preenchido (ou se o usuário estiver digitando especificamente aqui)
        if (rawCnpj.length === 14) {
            const fetchByCnpj = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`);
                    if (response.ok) {
                        const data = await response.json();
                        setNome(data.razao_social || data.nome_fantasia || nome);
                        setCidade(data.municipio || "");
                        setUf(data.uf || "");
                        toast({ title: "✅ CNPJ encontrado!", description: "Dados preenchidos automaticamente." });
                    } else if (response.status === 404) {
                        toast({ variant: "destructive", title: "CNPJ não encontrado", description: "Verifique os números ou preencha manualmente." });
                    }
                } catch (err) {
                    toast({ variant: "destructive", title: "Erro de consulta", description: "O serviço de busca está temporariamente indisponível." });
                } finally {
                    setLoading(false);
                }
            };
            fetchByCnpj();
        }
    }, [cnpj]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cnpj || !cidade || !uf) {
            toast({ variant: "destructive", title: "⚠️ Campos obrigatórios", description: "Por favor, preencha todos os campos." });
            return;
        }

        setLoading(true);
        const rawCnpj = cnpj.replace(/\D/g, "");

        // Obter user_id da sessão
        const { data: { session } } = await supabase.auth.getSession();
        const user_id = session?.user?.id;

        const result = await addCompany({
            nome,
            cnpj: rawCnpj,
            cidade,
            uf,
            user_id
        });
        setLoading(false);

        if (result) {
            setSaved(true);
            toast({ title: "🏢 Empresa cadastrada!", description: `${nome} foi salva com sucesso.` });
            setTimeout(() => { onSave?.(); }, 1500);
        }
    };

    return (
        <div className="bg-[#0B1221] p-8 rounded-[32px] w-full max-w-lg border border-slate-800 shadow-2xl overflow-visible relative">
            <h2 className="text-white text-3xl font-bold mb-8">Nova Empresa</h2>

            {saved ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <CheckCircle className="h-16 w-16 text-green-400" />
                    <p className="text-white text-xl font-bold">{nome}</p>
                    <p className="text-slate-400">Empresa cadastrada com sucesso!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Campo Nome da Empresa com autocomplete */}
                    <div ref={dropdownRef} className="relative space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">
                            NOME DA EMPRESA
                        </Label>
                        <div className="relative">
                            <Input
                                placeholder="Digite o nome da empresa..."
                                value={nome}
                                onChange={(e) => {
                                    setNome(e.target.value);
                                    // Limpa os campos se o usuário editar o nome
                                    setCnpj("");
                                    setCidade("");
                                    setUf("");
                                }}
                                onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155] pr-12"
                                autoComplete="off"
                            />
                            <div className="absolute right-3 top-4 h-6 w-6 flex items-center justify-center">
                                {buscando ? (
                                    <Loader2 className="text-blue-500 animate-spin h-5 w-5" />
                                ) : (
                                    <Search className="text-[#334155] h-5 w-5" />
                                )}
                            </div>
                        </div>

                        {/* Dropdown de sugestões */}
                        {mostrarSugestoes && sugestoes.length > 0 && (
                            <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#161F30] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                                {sugestoes.map((emp, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => selecionarEmpresa(emp)}
                                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#1E293B] transition-colors text-left border-b border-slate-800 last:border-none"
                                    >
                                        <Building2 className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white text-sm font-semibold leading-tight">{emp.razao_social}</p>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                CNPJ: {formatCnpj(emp.cnpj)}
                                                {emp.municipio && ` • ${emp.municipio}/${emp.uf}`}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Mensagem quando não há sugestões mas está buscando */}
                        {nome.trim().length >= 3 && !buscando && sugestoes.length === 0 && mostrarSugestoes === false && (
                            <p className="text-xs text-slate-500 px-1">
                                Nenhuma empresa encontrada. Preencha os campos manualmente.
                            </p>
                        )}
                    </div>

                    {/* Linha CNPJ */}
                    <div className="space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">CNPJ</Label>
                        <div className="relative">
                            <Input
                                placeholder="00.000.000/0001-00"
                                value={cnpj}
                                onChange={handleCnpjChange}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                            />
                            {loading && (
                                <Loader2 className="absolute right-3 top-4 h-6 w-6 text-blue-500 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Linha Cidade + UF */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-2">
                            <Label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">CIDADE</Label>
                            <Input
                                placeholder="Ex: São Paulo"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">UF</Label>
                            <Input
                                placeholder="SP"
                                value={uf}
                                maxLength={2}
                                onChange={(e) => setUf(e.target.value.toUpperCase())}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl text-center font-bold placeholder:text-[#334155]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold h-14 rounded-full"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#00A3FF] to-[#0066FF] hover:opacity-90 text-white font-bold h-14 rounded-full shadow-lg shadow-blue-500/20"
                        >
                            Salvar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompanyRegistration;
