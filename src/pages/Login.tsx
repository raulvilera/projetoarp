import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast({
                    title: "Conta criada com sucesso!",
                    description: "Verifique seu e-mail para confirmar o cadastro.",
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate("/dashboard");
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro na autenticação",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1221] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar ao questionário
                </button>

                <Card className="bg-[#0F1A2E] border-slate-800 shadow-2xl rounded-[24px]">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                                <Lock className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">
                            {isSignUp ? "Criar nova conta" : "Acesse o Dashboard"}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {isSignUp
                                ? "Preencha os dados abaixo para se cadastrar"
                                : "Entre com seu e-mail e senha para gerenciar suas empresas"}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleAuth}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                    <Input
                                        type="email"
                                        placeholder="Seu melhor e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-[#161F30] border-slate-700 pl-10 h-11 text-white placeholder:text-slate-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                    <Input
                                        type="password"
                                        placeholder="Sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-[#161F30] border-slate-700 pl-10 h-11 text-white placeholder:text-slate-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-bold rounded-xl"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    isSignUp ? "Cadastrar" : "Entrar"
                                )}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {isSignUp ? "Já tem uma conta? Entre aqui" : "Ainda não tem conta? Cadastre-se"}
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
