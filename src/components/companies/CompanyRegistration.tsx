import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CompanyRegistrationProps {
    onCancel: () => void;
    onSave: (company: any) => void;
}

const CompanyRegistration = ({ onCancel, onSave }: CompanyRegistrationProps) => {
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 14) {
            setCnpj(value);
        }
    };

    useEffect(() => {
        const fetchCnpjData = async () => {
            if (cnpj.length === 14) {
                setLoading(true);
                try {
                    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
                    if (response.ok) {
                        const data = await response.json();
                        setNome(data.razao_social || "");
                        setCidade(data.municipio || "");
                        setUf(data.uf || "");
                        toast({
                            title: "✅ Dados carregados",
                            description: "Informações da empresa preenchidas automaticamente.",
                        });
                    }
                } catch (error) {
                    console.error("Erro ao buscar CNPJ:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCnpjData();
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
        onSave({ nome, cnpj, cidade, uf });
    };

    return (
        <div className="bg-[#0B1221] p-8 rounded-[32px] w-full max-w-lg border border-slate-800 shadow-2xl overflow-hidden relative">
            <h2 className="text-white text-3xl font-bold mb-8">Nova Empresa</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase trekking-wider">NOME DA EMPRESA</Label>
                        <Input
                            placeholder="Ex: Indústria ABC Ltda"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase trekking-wider">CNPJ</Label>
                        <div className="relative">
                            <Input
                                placeholder="00.000.000/0001-00"
                                value={cnpj}
                                onChange={handleCnpjChange}
                                className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                            />
                            {loading && <Loader2 className="absolute right-3 top-4 h-6 w-6 text-blue-500 animate-spin" />}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase trekking-wider">CIDADE</Label>
                        <Input
                            placeholder="Ex: São Paulo"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="bg-[#161F30] border-none text-white h-14 rounded-2xl placeholder:text-[#334155]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#64748B] text-xs font-bold uppercase trekking-wider">UF</Label>
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
        </div>
    );
};

export default CompanyRegistration;
