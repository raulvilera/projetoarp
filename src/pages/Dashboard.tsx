import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sections } from "@/data/questionnaire";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
    InfoIcon, ShieldAlert, Zap, TrendingUp, Users, Target, Lock,
    MessageSquare, Scale, Building2, ChevronRight, PlusCircle, MapPin, ClipboardList,
    RefreshCw,
} from "lucide-react";
import CompanyRegistration from "@/components/companies/CompanyRegistration";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import { supabase } from "@/lib/supabase";

const getIcon = (title: string) => {
    switch (title) {
        case "Assédio": return <ShieldAlert className="h-5 w-5 text-red-500" />;
        case "Carga Excessiva de Trabalho": return <Zap className="h-5 w-5 text-yellow-500" />;
        case "Reconhecimento e Recompensas": return <TrendingUp className="h-5 w-5 text-blue-500" />;
        case "Clima Organizacional": return <Users className="h-5 w-5 text-green-500" />;
        case "Autonomia e Controle sobre o Trabalho": return <Target className="h-5 w-5 text-purple-500" />;
        case "Pressão e Metas": return <TrendingUp className="h-5 w-5 text-orange-500" />;
        case "Insegurança e Ameaças": return <Lock className="h-5 w-5 text-red-400" />;
        case "Conflitos Interpessoais e Falta de Comunicação": return <MessageSquare className="h-5 w-5 text-indigo-500" />;
        case "Alinhamento entre Vida Pessoal e Profissional": return <Scale className="h-5 w-5 text-teal-500" />;
        default: return <InfoIcon className="h-5 w-5 text-gray-500" />;
    }
};

const getRecommendation = (title: string, average: number) => {
    if (average < 1.5) return null;
    const recommendations: Record<string, string[]> = {
        "Assédio": ["Implementar treinamentos obrigatórios sobre ética e respeito.", "Fortalecer o canal de denúncias anônimo.", "Realizar palestras de conscientização trimestrais."],
        "Carga Excessiva de Trabalho": ["Revisar o dimensionamento das equipes.", "Implementar políticas de 'direito à desconexão'.", "Promover cursos de gestão de tempo e priorização."],
        "Reconhecimento e Recompensas": ["Estruturar um plano de cargos e salários transparente.", "Treinar lideranças para fornecer feedbacks construtivos.", "Criar programas de reconhecimento semanal/mensal."],
        "Clima Organizacional": ["Promover eventos de integração (team building).", "Realizar pesquisas de clima com maior frequência.", "Criar espaços de convivência confortáveis."],
        "Autonomia e Controle sobre o Trabalho": ["Implementar modelos de gestão por resultados (OKRs).", "Reduzir microgestão através de treinamentos para líderes.", "Permitir maior flexibilidade de horários."],
        "Pressão e Metas": ["Revisar as metas para garantir que sejam realistas (SMART).", "Oferecer suporte psicológico ou programas de bem-estar.", "Garantir períodos de descanso adequados após picos de demanda."],
        "Insegurança e Ameaças": ["Melhorar a transparência sobre a saúde financeira da empresa.", "Estabelecer critérios claros e justos para demissões.", "Comunicar abertamente mudanças organizacionais com antecedência."],
        "Conflitos Interpessoais e Falta de Comunicação": ["Implementar treinamentos de comunicação não-violenta (CNV).", "Criar fóruns abertos para discussão de problemas internos.", "Fortalecer o papel do RH como mediador de conflitos."],
        "Alinhamento entre Vida Pessoal e Profissional": ["Oferecer benefícios como auxílio-creche ou convênios de lazer.", "Implementar regime de trabalho híbrido ou flexível.", "Evitar reuniões fora do horário comercial."],
    };
    const scoreLabel = average > 3 ? "Crítico" : "Moderado";
    const items = recommendations[title] || ["Avaliar as causas raiz deste descontentamento."];
    return { title, scoreLabel, items };
};

const COLORS = ["#f87171", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa", "#f59e0b", "#f43f5e", "#6366f1", "#14b8a6"];

const DashboardData = () => {
    const { data: stats, isLoading, error, refetch } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const { data: rows, error: sbError } = await supabase
                .from("survey_responses")
                .select("answers_json");

            if (sbError) throw new Error(sbError.message);

            const allAnswers = (rows ?? []).map((r) => {
                try {
                    return typeof r.answers_json === "string"
                        ? JSON.parse(r.answers_json)
                        : r.answers_json;
                } catch {
                    return {};
                }
            });

            const statsMap: Record<string, { sum: number; count: number }> = {};
            allAnswers.forEach((ans) => {
                Object.entries(ans || {}).forEach(([id, value]) => {
                    const sectionId = id.split(".")[0];
                    if (!statsMap[sectionId]) statsMap[sectionId] = { sum: 0, count: 0 };
                    statsMap[sectionId].sum += value as number;
                    statsMap[sectionId].count += 1;
                });
            });

            return Object.entries(statsMap).map(([id, data]) => ({
                id,
                average: Number((data.sum / data.count).toFixed(2)),
            }));
        },
        staleTime: 2 * 60 * 1000, // 2 minutos
    });

    if (isLoading) return <Skeleton className="w-full h-[400px]" />;
    if (error) return <div className="text-center text-muted-foreground py-8">Erro ao carregar os dados do dashboard.</div>;

    const chartData = sections.map((section) => {
        const stat = stats?.find((s) => s.id === section.id.toString());
        return { name: section.title, average: stat ? stat.average : 0, id: section.id };
    });
    const alerts = chartData.map((d) => getRecommendation(d.name, d.average)).filter((r) => r !== null);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Atualizar dados
                </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Médias de Riscos por Categoria (Geral)</CardTitle></CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 4]} />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="average" fill="#8884d8">
                                {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.length > 0 ? alerts.map((alert, i) => (
                    <Card key={i} className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            {getIcon(alert!.title)}
                            <CardTitle className="text-lg">{alert!.title}</CardTitle>
                            <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${alert!.scoreLabel === "Crítico" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{alert!.scoreLabel}</span>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                {alert!.items.map((item, j) => <li key={j}>{item}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                )) : (
                    <Alert className="bg-green-50 border-green-200 col-span-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Tudo em ordem!</AlertTitle>
                        <AlertDescription className="text-green-700">As médias de risco estão baixas. Continue monitorando.</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};


const CompanyListTab = () => {
    const navigate = useNavigate();
    const { companies, getResponsesByCompany } = useCompanyStore();
    const [activeTab, setActiveTab] = useState<"list" | "new">("list");

    if (activeTab === "new") {
        return (
            <div className="flex justify-center pt-4">
                <CompanyRegistration
                    onCancel={() => setActiveTab("list")}
                    onSave={() => setActiveTab("list")}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Empresas Cadastradas</h2>
                    <p className="text-muted-foreground text-sm">{companies.length} empresa{companies.length !== 1 ? "s" : ""} encontrada{companies.length !== 1 ? "s" : ""}</p>
                </div>
                <Button onClick={() => setActiveTab("new")} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4" /> Nova Empresa
                </Button>
            </div>

            {companies.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="py-16 text-center">
                        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-500 mb-2">Nenhuma empresa cadastrada</h3>
                        <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">Cadastre uma empresa para organizar as avaliações por organização.</p>
                        <Button onClick={() => setActiveTab("new")} variant="outline" className="gap-2">
                            <PlusCircle className="h-4 w-4" /> Cadastrar primeira empresa
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {companies.map((company) => {
                        const responseCount = getResponsesByCompany(company.id).length;
                        return (
                            <Card
                                key={company.id}
                                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200"
                                onClick={() => navigate(`/empresa/${company.id}`)}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                            {company.nome.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-base truncate">{company.nome}</h3>
                                            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {company.cidade} — {company.uf}
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Badge variant="secondary" className="gap-1 text-xs">
                                                    <ClipboardList className="h-3 w-3" />
                                                    {responseCount} avaliação{responseCount !== 1 ? "ões" : ""}
                                                </Badge>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Avaliação de Riscos Psicossociais</h1>
                    <p className="text-muted-foreground">Gestão e Diagnóstico Organizacional</p>
                </header>

                <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="bg-white p-1 rounded-xl border mb-6">
                        <TabsTrigger value="stats" className="rounded-lg gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Dashboard Geral
                        </TabsTrigger>
                        <TabsTrigger value="companies" className="rounded-lg gap-2">
                            <Building2 className="h-4 w-4" />
                            Empresas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats">
                        <DashboardData />
                    </TabsContent>

                    <TabsContent value="companies">
                        <CompanyListTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
