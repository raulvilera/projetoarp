import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type SubscriptionStatus = "active" | "inactive" | "loading";

export interface SubscriptionInfo {
    status: SubscriptionStatus;
    plan: "basico" | "intermediario" | "anual" | "mensal" | null;
    expiresAt: string | null;
    subscriptionId: string | null;
    hasSession: boolean;
}

export const useSubscription = () => {
    const { data, isLoading } = useQuery<SubscriptionInfo>({
        queryKey: ["subscription-status"],
        queryFn: async (): Promise<SubscriptionInfo> => {
            try {
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("Error fetching session:", sessionError);
                    throw sessionError;
                }

                const session = sessionData?.session;

                if (!session) {
                    return { status: "inactive", plan: null, expiresAt: null, subscriptionId: null, hasSession: false };
                }

                // Bypass para o administrador/autor
                const adminEmail = "raulvilera@gmail.com";
                if (session.user.email === adminEmail) {
                    return {
                        status: "active",
                        plan: "anual", // Nome simbólico para acesso total
                        expiresAt: null,
                        subscriptionId: "admin-bypass",
                        hasSession: true,
                    };
                }

                const { data: sub, error } = await supabase
                    .from("subscriptions_arp")
                    .select("*")
                    .eq("user_id", session.user.id)
                    .eq("status", "active")
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching subscription:", error);
                    return { status: "inactive", plan: null, expiresAt: null, subscriptionId: null, hasSession: true };
                }

                if (!sub) {
                    return { status: "inactive", plan: null, expiresAt: null, subscriptionId: null, hasSession: true };
                }

                const isExpired = sub.ends_at && new Date(sub.ends_at) < new Date();
                if (isExpired) {
                    return { status: "inactive", plan: sub.plan_id, expiresAt: sub.ends_at, subscriptionId: sub.id, hasSession: true };
                }

                return {
                    status: "active",
                    plan: sub.plan_id,
                    expiresAt: sub.ends_at,
                    subscriptionId: sub.id,
                    hasSession: true,
                };
            } catch (err) {
                console.error("Unexpected error in useSubscription:", err);
                throw err;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: true,
    });

    return {
        isActive: data?.status === "active",
        hasSession: data?.hasSession ?? false,
        plan: data?.plan ?? null,
        expiresAt: data?.expiresAt ?? null,
        subscriptionId: data?.subscriptionId ?? null,
        isLoading,
    };
};
