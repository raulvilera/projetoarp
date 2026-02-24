import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sections } from "@/data/questionnaire";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldAlert, Zap, TrendingUp, Users, Target, Lock, MessageSquare, Scale } from "lucide-react";

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
    if (average < 1.5) return null; // Risk is low

    const recommendations: Record<string, string[]> = {
        "Assédio": [
            "Implementar treinamentos obrigatórios sobre ética e respeito.",
            "Fortalecer o canal de denúncias anônimo.",
            "Realizar palestras de conscientização trimestrais."
        ],
        "Carga Excessiva de Trabalho": [
            "Revisar o dimensionamento das equipes.",
            "Implementar políticas de 'direito à desconexão'.",
            "Promover cursos de gestão de tempo e priorização."
        ],
        "Reconhecimento e Recompensas": [
            "Estruturar um plano de cargos e salários transparente.",
            "Treinar lideranças para fornecer feedbacks construtivos.",
            "Criar programas de reconhecimento semanal/mensal."
        ],
        "Clima Organizacional": [
            "Promover eventos de integração (team building).",
            "Realizar pesquisas de clima com maior frequência.",
            "Criar espaços de convivência confortáveis."
        ],
        "Autonomia e Controle sobre o Trabalho": [
            "Implementar modelos de gestão por resultados (OKRs).",
            "Reduzir microgestão através de treinamentos para líderes.",
            "Permitir maior flexibilidade de horários."
        ],
        "Pressão e Metas": [
            "Revisar as metas para garantir que sejam realistas (SMART).",
            "Oferecer suporte psicológico ou programas de bem-estar.",
            "Garantir períodos de descanso adequados após picos de demanda."
        ],
        "Insegurança e Ameaças": [
            "Melhorar a transparência sobre a saúde financeira da empresa.",
            "Estabelecer critérios claros e justos para demissões.",
            "Comunicar abertamente mudanças organizacionais com antecedência."
        ],
        "Conflitos Interpessoais e Falta de Comunicação": [
            "Implementar treinamentos de comunicação não-violenta (CNV).",
            "Criar fóruns abertos para discussão de problemas internos.",
            "Fortalecer o papel do RH como mediador de conflitos."
        ],
        "Alinhamento entre Vida Pessoal e Profissional": [
            "Oferecer benefícios como auxílio-creche ou convênios de lazer.",
            "Implementar regime de trabalho híbrido ou flexível.",
            "Evitar reuniões fora do horário comercial ou nas segundas de manhã/sextas à tarde."
        ]
    };

    const scoreLabel = average > 3 ? "Crítico" : "Moderado";
    const items = recommendations[title] || ["Avaliar as causas raiz deste descontentamento.", "Consultar as equipes afetadas para co-criar soluções."];

    return { title, scoreLabel, items };
};

const DashboardData = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyyDmIGFoAymbihM3vb0XBJdJzipLp6Qtcpg99yoUwrMJjSNgjukTWe79OqwDdY8MuZA/exec';
            const response = await fetch(APPS_SCRIPT_URL);
            if (!response.ok) throw new Error("Erro ao carregar estatísticas");

            const sheetsData = await response.json() as any[];

            const allAnswers = sheetsData.map(r => {
                try {
                    return typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : r.answers_json;
                } catch (e) {
                    return {};
                }
            });

            const statsMap: Record<string, { sum: number, count: number }> = {};
            allAnswers.forEach(ans => {
                Object.entries(ans || {}).forEach(([id, value]) => {
                    const sectionId = id.split('.')[0];
                    if (!statsMap[sectionId]) {
                        statsMap[sectionId] = { sum: 0, count: 0 };
                    }
                    statsMap[sectionId].sum += (value as number);
                    statsMap[sectionId].count += 1;
                });
            });

            return Object.entries(statsMap).map(([id, data]) => ({
                id,
                average: Number((data.sum / data.count).toFixed(2))
            }));
        },
    });

    if (isLoading) return <Skeleton className="w-full h-[400px]" />;
    if (error) return <div>Erro ao carregar os dados do dashboard.</div>;

    const chartData = sections.map((section) => {
        const stat = stats?.find((s) => s.id === section.id.toString());
        return {
            name: section.title,
            average: stat ? stat.average : 0,
            id: section.id,
        };
    });

    const alerts = chartData
        .map((d) => getRecommendation(d.name, d.average))
        .filter((r) => r !== null);

    const COLORS = ["#f87171", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa", "#f59e0b", "#f43f5e", "#6366f1", "#14b8a6"];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Médias de Riscos por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 4]} />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="average" fill="#8884d8">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.length > 0 ? (
                    alerts.map((alert, i) => (
                        <Card key={i} className="border-l-4 border-l-red-500">
                            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                                {getIcon(alert!.title)}
                                <CardTitle className="text-lg">{alert!.title}</CardTitle>
                                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${alert!.scoreLabel === "Crítico" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {alert!.scoreLabel}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                    {alert!.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert className="bg-green-50 border-green-200 col-span-full">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Tudo em ordem!</AlertTitle>
                        <AlertDescription className="text-green-700">
                            As médias de risco estão baixas. Continue monitorando e promovendo o bem-estar organizacional.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Avaliação de Riscos Psicossociais</h1>
                        <p className="text-muted-foreground">Dashboard Geral e Medidas a Serem Adotadas</p>
                    </div>
                </header>
                <DashboardData />
            </div>
        </div>
    );
};

export default Dashboard;
