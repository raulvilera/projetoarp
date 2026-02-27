import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle, Shield, BarChart3, Building2, Zap,
    Crown, Calendar, Loader2, ArrowRight, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const getPlans = (billingPeriod: "monthly" | "annually") => [
    {
        id: "basico",
        name: "Plano Básico (Basic)",
        monthlyPrice: "R$ 497",
        annualPrice: "R$ 4.970",
        price: billingPeriod === "monthly" ? "R$ 497" : "R$ 4.970",
        period: billingPeriod === "monthly" ? "/mês" : "/ano",
        priceNum: billingPeriod === "monthly" ? 497.0 : 4970.0,
        saving: "Economize R$ 994 (17%)",
        description: "Diagnóstico inicial e mapa de riscos psicossociais.",
        highlight: false,
        icon: <Zap className="h-6 w-6" />,
        color: "from-blue-600 to-blue-800",
        features: [
            "Até 20 empresas",
            "Módulos DRPS 1 a 4",
            "Classificação & Diagnóstico",
            "Pontuação e Mapa de Risco",
            "Painel de Indicadores Geral",
            "Suporte via Email",
        ],
    },
    {
        id: "intermediario",
        name: "Plano Profissional (Pro)",
        monthlyPrice: "R$ 1.297",
        annualPrice: "R$ 12.970",
        price: billingPeriod === "monthly" ? "R$ 1.297" : "R$ 12.970",
        period: billingPeriod === "monthly" ? "/mês" : "/ano",
        priceNum: billingPeriod === "monthly" ? 1297.0 : 12970.0,
        saving: "Economize R$ 2.594 (17%)",
        description: "Gestão completa com governança e planos de ação.",
        highlight: true,
        icon: <Shield className="h-6 w-6" />,
        color: "from-violet-600 to-purple-800",
        features: [
            "Empresas ilimitadas",
            "Módulos DRPS 1 a 8",
            "Análise Técnica & Raiz",
            "Governança & Conformidade",
            "Geração de Plano de Ação",
            "Relatórios Nível Executivo",
        ],
    },
    {
        id: "corporativo",
        name: "Plano Corporativo (Enterprise)",
        monthlyPrice: "R$ 1.690",
        annualPrice: "R$ 14.900",
        price: billingPeriod === "monthly" ? "R$ 1.690" : "R$ 14.900",
        period: billingPeriod === "monthly" ? "/mês" : "/ano",
        priceNum: billingPeriod === "monthly" ? 1690.0 : 14900.0,
        saving: "Economize R$ 5.380 (26%)",
        description: "Inteligência preditiva e monitoramento contínuo.",
        highlight: false,
        icon: <Building2 className="h-6 w-6" />,
        color: "from-amber-500 to-orange-700",
        features: [
            "Acesso FULL Enterprise",
            "Módulos DRPS 1 a 10",
            "Monitoramento de Desvios",
            "Detecção de Oportunidades",
            "Suporte 24/7 Dedicado",
            "Melhor custo-benefício",
        ],
    },
];

const PricingPage = () => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.id) {
                setUserId(data.session.user.id);

                // Verificar se há uma intenção de checkout após o login
                const searchParams = new URLSearchParams(location.search);
                if (searchParams.get("intent") === "checkout") {
                    const pendingId = localStorage.getItem("pending_plan_id");
                    if (pendingId) {
                        localStorage.removeItem("pending_plan_id");
                        handleSubscribe(pendingId, data.session.user.id);
                    }
                }
            }
        });
    }, [location.search]);

    const handleSubscribe = async (planId: string, currentUserId?: string) => {
        const activeUserId = currentUserId || userId;

        if (!activeUserId) {
            // Salvar intenção para depois do login
            localStorage.setItem("pending_plan_id", planId);
            toast({
                title: "Quase lá!",
                description: "Faça seu login para concluir a assinatura.",
            });
            navigate("/login");
            return;
        }

        setLoadingPlan(planId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const email = session?.user?.email;

            // Determinar o ID correto do plano baseado no período de faturamento
            let planIdToSend = planId;
            if (billingPeriod === "annually") {
                if (planId === "corporativo") {
                    planIdToSend = "anual";
                } else if (!planId.endsWith("_anual")) {
                    planIdToSend = `${planId}_anual`;
                }
            } else {
                if (planId === "anual") {
                    planIdToSend = "corporativo";
                }
            }

            const response = await fetch("/api/subscription/create-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: planIdToSend,
                    userId: activeUserId,
                    email: email
                }),
            });

            if (!response.ok) throw new Error("Erro ao criar preferência de pagamento");

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                throw new Error("Link de pagamento não gerado");
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro ao processar pagamento",
                description: "Não foi possível iniciar o checkout. Tente novamente.",
            });
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1221] flex flex-col items-center justify-center px-4 py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Plataforma oficial NR-1</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Escolha seu plano
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Avaliação de Riscos Psicossociais conforme a NR-1. Diagnóstico completo, relatórios automáticos e recomendações de ação.
                </p>
                <p className="text-slate-500 text-sm mt-3 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    Mais de 50 empresas já avaliadas na plataforma
                </p>

                {/* Período de Cobrança Toggle */}
                <div className="flex items-center justify-center gap-4 mt-10">
                    <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>Mensal</span>
                    <button
                        onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annually" : "monthly")}
                        className="w-14 h-7 bg-slate-800 rounded-full relative p-1 transition-colors hover:bg-slate-700"
                    >
                        <motion.div
                            animate={{ x: billingPeriod === "monthly" ? 0 : 28 }}
                            className="w-5 h-5 bg-blue-500 rounded-full shadow-lg"
                        />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${billingPeriod === "annually" ? "text-white" : "text-slate-500"}`}>Anual</span>
                        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                            -17% OFF (2 meses grátis)
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {getPlans(billingPeriod).map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={`relative rounded-[28px] p-[2px] ${plan.highlight
                            ? "bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30"
                            : "bg-slate-800"
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                ⭐ MAIS POPULAR
                            </div>
                        )}

                        <div className="bg-[#0F1A2E] rounded-[26px] p-8 h-full flex flex-col">
                            {/* Ícone e nome */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} text-white mb-5`}>
                                {plan.icon}
                            </div>

                            <h2 className="text-white text-2xl font-bold mb-1">{plan.name}</h2>
                            <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                            {/* Preço Dinâmico (Principal) */}
                            <div className="flex items-end gap-1 mb-2">
                                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                <span className="text-slate-400 text-lg pb-1">{plan.period}</span>
                            </div>

                            {/* Comparativo sempre visível */}
                            <div className="mb-6">
                                {billingPeriod === "monthly" ? (
                                    <p className="text-slate-500 text-sm">
                                        Ou <span className="text-slate-300 font-semibold">{plan.annualPrice}</span> no plano anual
                                        <br />
                                        <span className="text-green-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                                            <Star className="h-3 w-3 fill-green-500" />
                                            {plan.saving}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-slate-500 text-sm">
                                        Valor equivalente a <span className="text-slate-300 font-semibold">{plan.monthlyPrice}/mês</span>
                                        <br />
                                        <span className="text-green-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Pagamento anual único
                                        </span>
                                    </p>
                                )}
                            </div>

                            <p className="text-slate-500 text-[10px] mt-2 italic">* O plano é selecionado automaticamente com base no seu volume de empresas.</p>

                            {/* Features */}
                            <ul className="space-y-3 flex-1 mb-8">
                                {plan.features.map((feat) => (
                                    <li key={feat} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            {/* Botão */}
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loadingPlan !== null}
                                className={`w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-white transition-all duration-200 ${plan.highlight
                                    ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 shadow-lg shadow-purple-500/30"
                                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 shadow-lg shadow-blue-500/20"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loadingPlan === plan.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Assinar agora
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col md:flex-row items-center gap-6 text-slate-500 text-sm"
            >
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Pagamento 100% seguro via Mercado Pago</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-slate-700" />
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Cancele quando quiser</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-slate-700" />
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>NR-1 compliant</span>
                </div>
            </motion.div>

            <button
                onClick={() => navigate(-1)}
                className="mt-8 text-slate-600 hover:text-slate-400 text-sm transition-colors"
            >
                ← Voltar
            </button>
        </div>
    );
};

export default PricingPage;
