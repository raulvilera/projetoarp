import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Lock, ArrowRight } from "lucide-react";
import PremiumHUD from "@/components/ui/PremiumHUD";

type WelcomeScreenProps = {
  onStart: () => void;
};

const features = [
  { icon: Shield, label: "Confidencial e Anônimo" },
  { icon: Lock, label: "Conforme LGPD" },
  { icon: CheckCircle, label: "9 Tópicos · 90 Perguntas" },
];

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Composição Industrial-Blueprint (Imagem solicitada + HUD dinâmico) */}
          <div className="flex justify-center mb-10 overflow-hidden py-6 relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-72 h-72 flex items-center justify-center p-4 border border-blue-500/10 rounded-full shadow-2xl shadow-blue-500/5 bg-white/40 backdrop-blur-sm"
            >
              {/* Imagem Industrial de Fundo (A que o usuário quer) */}
              <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-primary/20 shadow-inner">
                <motion.div
                  animate={{ x: ["-5%", "5%", "-5%"] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[110%] h-full flex"
                >
                  <img
                    src="/assets/cover_industry_gear.png"
                    alt="Avaliação Industrial"
                    className="w-full h-full object-cover opacity-90 saturate-[0.8]"
                  />
                </motion.div>
              </div>

              {/* HUB Clean de Alta Fidelidade Sobreposto */}
              <div className="absolute inset-0 z-20">
                <PremiumHUD size={288} className="translate-y-[-10px] scale-110" />
              </div>

              {/* Elementos Decorativos de Moldura */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-t-primary/40 border-l-transparent border-r-transparent border-b-transparent rounded-full"
              />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            NR-01 — Avaliação de Riscos Psicossociais
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Diagnóstico de Riscos{" "}
            <span className="text-gradient">Psicossociais</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Contribua para um ambiente de trabalho mais saudável e seguro
            respondendo a este questionário.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-card rounded-2xl card-shadow p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 font-sans">
            Bem-vindo(a)!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Este formulário tem como objetivo avaliar os{" "}
            <strong className="text-foreground">riscos psicossociais</strong> no
            ambiente de trabalho, contribuindo para a construção de um ambiente
            mais saudável e seguro para todos.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Sua participação é{" "}
            <strong className="text-foreground">voluntária</strong> e suas
            respostas serão tratadas de forma{" "}
            <strong className="text-foreground">confidencial</strong>. Os dados
            coletados serão apresentados apenas de forma agregada ou anonimizada
            no relatório final, garantindo que nenhuma informação pessoal seja
            identificável.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            O Questionário de DRPS foi criado com base nos principais fatores de
            riscos psicossociais que têm levado ao adoecimento da classe
            trabalhadora nas organizações de acordo com o{" "}
            <strong className="text-foreground">
              Ministério do Trabalho e Emprego (MTE)
            </strong>
            .
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ao preencher este formulário, você concorda com o uso das
            informações fornecidas para fins de diagnóstico, análise e melhoria
            do clima organizacional, em conformidade com a{" "}
            <strong className="text-foreground">LGPD</strong>.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <f.icon className="w-4 h-4 text-primary" />
              {f.label}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            onClick={() => onStart()}
            size="lg"
            className="hero-gradient text-primary-foreground px-10 py-7 text-lg font-bold rounded-2xl gap-2 hover:opacity-90 shadow-2xl shadow-primary/20 transition-all active:scale-95 w-full md:w-auto"
          >
            Iniciar Avaliação Geral
            <ArrowRight className="w-5 h-5" />
          </Button>

          <button
            onClick={() => window.location.href = "/login"}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors py-2 px-4 rounded-xl hover:bg-blue-500/5"
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Acesso ao Portal do Gestor</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
