import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface SubscriptionGuardProps {
    children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
    const { isActive, isLoading, hasSession } = useSubscription();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!hasSession) {
                navigate("/login");
            } else if (!isActive) {
                navigate("/planos");
            }
        }
    }, [isActive, isLoading, hasSession, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6 z-10"
                >
                    <div className="relative">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                        <ShieldCheck className="h-6 w-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white font-semibold tracking-wide">Autenticando acesso</p>
                        <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Verificando credenciais e assinatura...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!hasSession || !isActive) return null;

    return <>{children}</>;
};

export default SubscriptionGuard;
