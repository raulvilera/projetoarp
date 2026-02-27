import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type IdentificationScreenProps = {
  funcao: string;
  setor: string;
  empresaNome: string;
  isLocked?: boolean;
  onFuncaoChange: (value: string) => void;
  onSetorChange: (value: string) => void;
  onEmpresaNomeChange: (value: string) => void;
  onNext: () => void;
};

const SETORES_PADRAO = [
  "Administrativo",
  "Operacional / Fábrica",
  "Vendas / Comercial",
  "RH / Gente e Cultura",
  "TI / Desenvolvimento",
  "Logística",
  "Financeiro",
  "Saúde / Atendimento",
  "Educação / Docência",
  "Outro"
];

const FUNCOES_PADRAO = [
  "Operacional",
  "Analista",
  "Assistente / Auxiliar",
  "Liderança / Supervisão",
  "Gerência / Executivo",
  "Vendedor / Atendente",
  "Professor / Educador",
  "Autônomo / Terceirizado",
  "Outro"
];

const IdentificationScreen = ({
  funcao,
  setor,
  empresaNome,
  isLocked = false,
  onFuncaoChange,
  onSetorChange,
  onEmpresaNomeChange,
  onNext,
}: IdentificationScreenProps) => {
  const [showManualSetor, setShowManualSetor] = useState(false);
  const [showManualFuncao, setShowManualFuncao] = useState(false);

  const canProceed =
    funcao.trim().length > 0 &&
    setor.trim().length > 0 &&
    empresaNome.trim().length > 0;

  const handleSetorSelect = (value: string) => {
    if (value === "Outro") {
      setShowManualSetor(true);
      onSetorChange("");
    } else {
      setShowManualSetor(false);
      onSetorChange(value);
    }
  };

  const handleFuncaoSelect = (value: string) => {
    if (value === "Outro") {
      setShowManualFuncao(true);
      onFuncaoChange("");
    } else {
      setShowManualFuncao(false);
      onFuncaoChange(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-slate-50"
    >
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Identificação
          </h2>
          <p className="text-slate-500">
            Começaremos a sua avaliação conhecendo um pouco de você, da sua empresa e do que você
            faz!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-8"
        >
          <div className="space-y-3">
            <Label htmlFor="empresa" className="text-slate-700 font-semibold block">
              Qual a sua empresa? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="empresa"
              placeholder="Digite o nome da empresa..."
              value={empresaNome}
              readOnly={isLocked}
              onChange={(e) => onEmpresaNomeChange(e.target.value)}
              className={`rounded-xl h-12 border-slate-200 focus-visible:ring-blue-500 ${isLocked ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-slate-50"
                }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold block">
                Seu Setor? <span className="text-red-500">*</span>
              </Label>
              {!showManualSetor ? (
                <Select onValueChange={handleSetorSelect} value={SETORES_PADRAO.includes(setor) ? setor : (setor ? "Outro" : undefined)}>
                  <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SETORES_PADRAO.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Input
                    placeholder="Digite seu setor..."
                    value={setor}
                    onChange={(e) => onSetorChange(e.target.value)}
                    className="rounded-xl h-12 bg-slate-50 border-slate-200 pr-10"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowManualSetor(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-medium"
                  >
                    Voltar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold block">
                Sua Função? <span className="text-red-500">*</span>
              </Label>
              {!showManualFuncao ? (
                <Select onValueChange={handleFuncaoSelect} value={FUNCOES_PADRAO.includes(funcao) ? funcao : (funcao ? "Outro" : undefined)}>
                  <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {FUNCOES_PADRAO.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Input
                    placeholder="Digite sua função..."
                    value={funcao}
                    onChange={(e) => onFuncaoChange(e.target.value)}
                    className="rounded-xl h-12 bg-slate-50 border-slate-200 pr-10"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowManualFuncao(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-medium"
                  >
                    Voltar
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-8"
        >
          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-lg font-bold rounded-2xl gap-3 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 duration-200"
          >
            Iniciar Avaliação
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IdentificationScreen;
