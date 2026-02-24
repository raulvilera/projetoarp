import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, BarChart3, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        // Invalida o cache de assinatura para forçar nova consulta
        queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    }, [queryClient]);

    return (
        <div className="min-h-screen bg-[#0B1221] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="bg-[#0F1A2E] border border-slate-800 rounded-[32px] p-12 max-w-md w-full text-center shadow-2xl"
            >
                {/* Ícone animado */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-extrabold text-white mb-3">
                    Assinatura ativada! 🎉
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Bem-vindo à plataforma de Avaliação de Riscos Psicossociais. Sua assinatura já está ativa e você tem acesso completo.
                </p>

                <div className="bg-[#161F30] rounded-2xl p-4 mb-8 text-left space-y-3">
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Cadastre suas empresas clientes
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Envie o questionário NR-1 para os funcionários
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        Acompanhe os resultados no Dashboard
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <BarChart3 className="h-5 w-5" />
                        Acessar Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SubscriptionSuccess;
