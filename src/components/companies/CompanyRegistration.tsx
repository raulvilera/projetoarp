import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import { Loader2, CheckCircle } from "lucide-react";

interface CompanyRegistrationProps {
    onCancel: () => void;
    onSave?: () => void;
}

const CompanyRegistration = ({ onCancel, onSave }: CompanyRegistrationProps) => {
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const { toast } = useToast();
    const { addCompany } = useCompanyStore();

    const formatCnpj = (value: string) => {
        const digits = value.replace(/\D/g, "");
        return digits
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18);
    };

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (raw.length <= 14) {
            setCnpj(formatCnpj(raw));
        }
    };

    useEffect(() => {
        const rawCnpj = cnpj.replace(/\D/g, "");
        if (rawCnpj.length === 14) {
            const fetchCnpjData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`);
                    if (response.ok) {
                        const data = await response.json();
                        setNome(data.razao_social || "");
                        setCidade(data.municipio || "");
                        setUf(data.uf || "");
                        toast({
                            title: "✅ CNPJ encontrado!",
                            description: "Dados preenchidos automaticamente.",
                        });
                    } else {
                        toast({
                            variant: "destructive",
                            title: "CNPJ não encontrado",
                            description: "Preencha os dados manualmente.",
                        });
                    }
                } catch {
                    toast({
                        variant: "destructive",
                        title: "Erro de conexão",
                        description: "Não foi possível consultar o CNPJ.",
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchCnpjData();
        }
    }, [cnpj, toast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cnpj || !cidade || !uf) {
            toast({
                variant: "destructive",
                title: "⚠️ Campos obrigatórios",
                description: "Por favor, preencha todos os campos.",
            });
            return;
        }

        const rawCnpj = cnpj.replace(/\D/g, "");
        addCompany({ nome, cnpj: rawCnpj, cidade, uf });

        setSaved(true);
        toast({
            title: "🏢 Empresa cadastrada!",
            description: `${nome} foi salva com sucesso.`,
        });

        setTimeout(() => {
            onSave?.();
        }, 1500);
    };

    return (
        <div className="bg-[#0B1221] p-8 rounded-[32px] w-full max-w-lg border border-slate-800 shadow-2xl overflow-hidden relative">
            <h2 className="text-white text-3xl font-bold mb-8">Nova Empresa</h2>

            {saved ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <CheckCircle className="h-16 w-16 text-green-400" />
                    <p className="text-white text-xl font-bold">{nome}</p>
                    <p className="text-slate-400">Empresa cadastrada com sucesso!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-[#64748B] text-xs font-bold uppercase tracking-wider">NOME DA EMPRESA</Label>
                            <Input
                                placeholder="Ex: Indústria ABC Ltda"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                            />
                        </div>
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
                    </div>

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
