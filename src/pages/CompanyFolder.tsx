import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import { sections } from "@/data/questionnaire";
import {
    ArrowLeft, Building2, MapPin, Hash, Users, BarChart2, ClipboardList, Share2, Link
} from "lucide-react";

const COLORS = ["#f87171", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa", "#f59e0b", "#f43f5e", "#6366f1", "#14b8a6"];

const CompanyFolder = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCompanyById, getResponsesByCompany } = useCompanyStore();

    const company = id ? getCompanyById(id) : undefined;
    const companyResponses = id ? getResponsesByCompany(id) : [];

    const chartData = useMemo(() => {
        if (!companyResponses.length) return [];

        const statsMap: Record<string, { sum: number; count: number }> = {};
        companyResponses.forEach((resp) => {
            Object.entries(resp.answers || {}).forEach(([questionId, value]) => {
                const sectionId = questionId.split(".")[0];
                if (!statsMap[sectionId]) statsMap[sectionId] = { sum: 0, count: 0 };
                statsMap[sectionId].sum += value;
                statsMap[sectionId].count += 1;
            });
        });

        return sections.map((section) => {
            const stat = statsMap[section.id.toString()];
            return {
                name: section.title,
                media: stat ? Number((stat.sum / stat.count).toFixed(2)) : 0,
                icon: section.icon,
            };
        });
    }, [companyResponses]);

    // Group responses by sector
    const bySector = useMemo(() => {
        const map: Record<string, number> = {};
        companyResponses.forEach((r) => {
            map[r.setor] = (map[r.setor] || 0) + 1;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [companyResponses]);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/coleta/${id}`;
        navigator.clipboard.writeText(link);
        toast({
            title: "Link Copiado!",
            description: "O link de coleta para funcionários foi copiado para a área de transferência.",
        });
    };

    if (!company) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Building2 className="h-16 w-16 text-slate-300 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-600">Empresa não encontrada</h2>
                    <Button onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mt-1">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                {company.nome.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{company.nome}</h1>
                                <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {company.cidade} — {company.uf}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Hash className="h-3.5 w-3.5" />
                                        {company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 w-fit ml-auto">
                            Ativa
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyLink}
                            className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50 gap-2 rounded-xl"
                        >
                            <Link className="h-4 w-4" />
                            Copiar link para funcionários
                        </Button>
                    </div>
                </div>

                {/* Stats summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total de Avaliações</p>
                                    <p className="text-4xl font-bold">{companyResponses.length}</p>
                                </div>
                                <ClipboardList className="h-10 w-10 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-none text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-300 text-sm">Setores Avaliados</p>
                                    <p className="text-4xl font-bold">{bySector.length}</p>
                                </div>
                                <Users className="h-10 w-10 text-slate-400" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none text-white col-span-2 md:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Categorias Avaliadas</p>
                                    <p className="text-4xl font-bold">{sections.length}</p>
                                </div>
                                <BarChart2 className="h-10 w-10 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {companyResponses.length === 0 ? (
                    <Card className="border-dashed border-2">
                        <CardContent className="py-16 text-center">
                            <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-500 mb-2">Nenhuma avaliação registrada</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                Quando colaboradores desta empresa responderem o questionário, os dados aparecerão aqui.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart2 className="h-5 w-5 text-blue-600" />
                                    Médias de Risco por Categoria
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[380px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 4]} tickCount={5} />
                                        <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(value) => [`${value}`, "Média"]} />
                                        <Bar dataKey="media" radius={[0, 6, 6, 0]}>
                                            {chartData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Sector breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Participação por Setor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {bySector.map(([setor, count]) => (
                                        <div key={setor} className="flex items-center gap-3">
                                            <span className="text-sm font-medium w-40 truncate">{setor}</span>
                                            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all"
                                                    style={{ width: `${(count / companyResponses.length) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-10 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Individual responses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-blue-600" />
                                    Histórico de Avaliações
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {[...companyResponses].reverse().map((resp, i) => (
                                        <div
                                            key={resp.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">
                                                    {companyResponses.length - i}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{resp.funcao}</p>
                                                    <p className="text-xs text-muted-foreground">{resp.setor}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(resp.submittedAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompanyFolder;
