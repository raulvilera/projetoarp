import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Lock, ArrowRight, Building2, ChevronDown, Factory, Heart, Network, BarChart3 } from "lucide-react";
import { useCompanyStore } from "@/hooks/useCompanyStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WelcomeScreenProps = {
  onStart: (empresaId?: string) => void;
};

const features = [
  { icon: Shield, label: "Confidencial e Anônimo" },
  { icon: Lock, label: "Conforme LGPD" },
  { icon: CheckCircle, label: "9 Tópicos · 90 Perguntas" },
];

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const { companies } = useCompanyStore();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>();

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

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
          {/* Composição Holográfica Animada (Holograma 2.0) */}
          <div className="flex justify-center mb-10 overflow-hidden">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-64 h-64 flex items-center justify-center"
            >
              {/* Carrossel de Ícones Animados */}
              <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_50px_rgba(0,163,255,0.4)] bg-slate-900/40 backdrop-blur-md">
                <motion.div
                  animate={{ x: ["0%", "-75%"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-[400%] h-full flex items-center"
                >
                  {[
                    {
                      icon: (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                          <Factory size={48} className="text-blue-400" />
                        </motion.div>
                      ),
                      label: "Ambiente"
                    },
                    {
                      icon: (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Heart size={48} className="text-red-500" />
                        </motion.div>
                      ),
                      label: "Saúde"
                    },
                    {
                      icon: (
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                          <Network size={48} className="text-emerald-400" />
                        </motion.div>
                      ),
                      label: "Rede"
                    },
                    {
                      icon: (
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                          <BarChart3 size={48} className="text-amber-400" />
                        </motion.div>
                      ),
                      label: "Dados"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="w-1/4 h-full flex flex-col items-center justify-center relative">
                      {/* Anéis HUD Internos */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-32 h-32 border border-blue-500/20 rounded-full border-dashed"
                      />
                      <div className="z-10 bg-slate-900/50 p-6 rounded-full border border-white/5 backdrop-blur-sm">
                        {item.icon}
                      </div>
                      <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/60">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Anéis HUD Externos de Alta Velocidade */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-primary/20 rounded-full border-t-primary/60 border-l-transparent border-r-transparent border-b-transparent"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-primary/10 rounded-full border-dashed"
              />

              {/* Overlay de Scanline HUD */}
              <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none opacity-30 bg-gradient-to-b from-transparent via-primary/10 to-transparent bg-[length:100%_6px] animate-pulse" />
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

        {/* Company selector — shown only when companies are registered */}
        {companies.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Selecione sua empresa para que os dados sejam organizados corretamente:
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-between rounded-xl border-2 hover:border-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {selectedCompany ? selectedCompany.nome : "Selecionar empresa..."}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[380px]">
                {companies.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onSelect={() => setSelectedCompanyId(c.id)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {c.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{c.nome}</p>
                      <p className="text-xs text-muted-foreground">{c.cidade} — {c.uf}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}

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
          className="flex justify-center"
        >
          <Button
            onClick={() => onStart(selectedCompanyId)}
            size="lg"
            className="hero-gradient text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl gap-2 hover:opacity-90 transition-opacity"
          >
            Iniciar Avaliação
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
