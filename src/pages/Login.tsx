import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Redirecionar se já estiver logado
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate("/dashboard");
        });
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast({
                    title: "✅ Conta pré-criada!",
                    description: "Verifique seu e-mail para confirmar. Após confirmar, você precisará escolher um plano.",
                });
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                if (data.user) {
                    // Verificar assinatura imediatamente após o login
                    const { data: sub } = await supabase
                        .from("subscriptions_arp")
                        .select("status")
                        .eq("user_id", data.user.id)
                        .eq("status", "active")
                        .maybeSingle();

                    const isAdmin = data.user.email === "raulvilera@gmail.com";

                    if (sub || isAdmin) {
                        toast({ title: "Bem-vindo de volta!", description: "Acesso autorizado." });
                        navigate("/dashboard");
                    } else {
                        toast({
                            title: "Assinatura pendente",
                            description: "Identificamos que você ainda não possui um plano ativo. Escolha um para continuar.",
                        });
                        navigate("/planos");
                    }
                }
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro na autenticação",
                description: error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message,
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
                    <h1 className="text-3xl font-black text-white tracking-tight italic">
                        AVALIAÇÃO <span className="text-blue-500">ARP</span>
                    </h1>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl rounded-[32px] overflow-hidden">
                    <CardHeader className="space-y-1 text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-white">
                            {isSignUp ? "Criar conta consultor" : "Portal do Gestor"}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {isSignUp
                                ? "Cadastre-se para começar a gerenciar riscos"
                                : "Entre para acessar seus dashboards de inteligência"}
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleAuth}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 text-xs font-medium ml-1">E-mail corporativo</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="ex@empresa.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-slate-950/50 border-slate-800 pl-10 h-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 text-xs font-medium ml-1">Senha de acesso</Label>
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
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pb-8">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isSignUp ? "Solicitar Acesso" : "Conectar agora"}
                                        <Zap className="h-4 w-4 fill-white" />
                                    </span>
                                )}
                            </Button>

                            <div className="flex flex-col items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    {isSignUp ? "Já tem acesso? Faça login" : "Novo por aqui? Solicite uma conta"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="text-[11px] text-slate-600 hover:text-slate-400 flex items-center gap-1 mt-2"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Voltar ao questionário público
                                </button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-[10px] text-slate-600 mt-8 uppercase tracking-[0.2em]">
                    &copy; 2024 DRPS - Inteligência em Saúde Ocupacional
                </p>
            </motion.div>
        </div>
    );
};

// Componente auxiliar local para Label
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <label className={className}>{children}</label>
);

export default Login;
