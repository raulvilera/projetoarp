import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Verificar se existe uma sessão de recuperação (o link do Supabase gera isso automaticamente)
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                console.log("Password recovery flow active");
            } else if (!session && event !== "INITIAL_SESSION") {
                // Se não houver sessão e não estivermos no fluxo de recuperação, volta pro login
                navigate("/login");
            }
        });
    }, [navigate]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Senhas não coincidem",
                description: "Certifique-se de que as duas senhas sejam iguais.",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres.",
            });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            toast({
                title: "✅ Senha alterada!",
                description: "Sua senha foi redefinida com sucesso. Você já pode logar.",
            });

            // Logout para forçar login com a nova senha e limpar tokens de recuperação
            await supabase.auth.signOut();
            navigate("/login");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao redefinir",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decorativo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4"
                    >
                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Ambiente Seguro DRPS</span>
                    </motion.div>
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                        Nova <span className="text-blue-500">Senha</span>
                    </h1>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl rounded-[32px] overflow-hidden">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-white">Criar nova senha</CardTitle>
                        <CardDescription className="text-slate-400">
                            Digite sua nova senha de acesso abaixo
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleReset}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 text-xs font-medium ml-1">Nova senha</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-slate-950/50 border-slate-800 pl-10 h-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 text-xs font-medium ml-1">Confirmar nova senha</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="bg-slate-950/50 border-slate-800 pl-10 h-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pb-8">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Atualizar e Conectar
                                        <Zap className="h-4 w-4 fill-white" />
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

// Componente auxiliar local para Label
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <label className={className}>{children}</label>
);

export default ResetPassword;
