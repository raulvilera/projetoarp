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
          {/* Nova Capa: Moldura de Engrenagem com Imagem Industrial e Efeito HUD */}
          <div className="flex justify-center mb-10 overflow-hidden">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-64 h-64 flex items-center justify-center"
            >
              {/* Anéis HUD Decorativos */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-primary/20 rounded-full"
              />

              {/* Moldura de Engrenagem Animada */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 text-primary/10"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                  <path d="M100 50c0-2.3-1.4-4.2-3.4-5.1l-1.9-8.4c1.8-1.5 2.7-3.9 2-6.2l-5.6-5.6c-2.3-.7-4.7.2-6.2 2l-8.4-1.9c-.9-2-2.8-3.4-5.1-3.4s-4.2 1.4-5.1 3.4l-8.4 1.9c-1.5-1.8-3.9-2.7-6.2-2l-5.6 5.6c-.7 2.3.2 4.7 2 6.2l-1.9 8.4c-2 .9-3.4 2.8-3.4 5.1s1.4 4.2 3.4 5.1l1.9 8.4c-1.8 1.5-2.7 3.9-2 6.2l5.6 5.6c2.3.7 4.7-.2 6.2-2l8.4 1.9c.9 2 2.8 3.4 5.1 3.4s4.2-1.4 5.1-3.4l8.4-1.9c1.5 1.8 3.9 2.7 6.2 2l5.6-5.6c.7-2.3-.2-4.7-2-6.2l1.9-8.4c2-.9 3.4-2.8 3.4-5.1zm-50 20c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" />
                </svg>
              </motion.div>

              {/* Imagem de Capa com Efeito de Carrossel Suave */}
              <div className="absolute inset-6 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_40px_rgba(0,163,255,0.4)] bg-slate-900">
                <motion.div
                  animate={{ x: ["-10%", "10%", "-10%"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[120%] h-full flex"
                >
                  <img
                    src="/assets/cover_industry_gear.png"
                    alt="Avaliação de Riscos Industriais"
                    className="w-full h-full object-cover opacity-80"
                  />
                </motion.div>
              </div>

              {/* Overlay de Scanline HUD */}
              <div className="absolute inset-6 rounded-full overflow-hidden pointer-events-none opacity-20 bg-gradient-to-b from-transparent via-primary/20 to-transparent bg-[length:100%_4px] animate-scanline" />
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
