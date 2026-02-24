import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface SubscriptionGuardProps {
    children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
    const { isActive, isLoading, hasSession } = useSubscription();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!hasSession || !isActive)) {
            navigate("/planos");
        }
    }, [isActive, isLoading, hasSession, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B1221] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="text-slate-400 text-sm">Verificando sua assinatura...</p>
                </div>
            </div>
        );
    }

    if (!hasSession || !isActive) return null;

    return <>{children}</>;
};

export default SubscriptionGuard;
