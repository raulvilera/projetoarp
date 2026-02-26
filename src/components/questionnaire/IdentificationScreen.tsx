import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type IdentificationScreenProps = {
  funcao: string;
  setor: string;
  empresaNome: string;
  onFuncaoChange: (value: string) => void;
  onSetorChange: (value: string) => void;
  onEmpresaNomeChange: (value: string) => void;
  onNext: () => void;
};

const IdentificationScreen = ({
  funcao,
  setor,
  empresaNome,
  onFuncaoChange,
  onSetorChange,
  onEmpresaNomeChange,
  onNext,
}: IdentificationScreenProps) => {
  const canProceed =
    funcao.trim().length > 0 &&
    setor.trim().length > 0 &&
    empresaNome.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Identificação
          </h2>
          <p className="text-muted-foreground">
            Começaremos a sua avaliação conhecendo um pouco de você, da sua empresa e do que você
            faz!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card rounded-2xl card-shadow p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-foreground font-medium">
              Qual a sua empresa? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="empresa"
              placeholder="Digite o nome da empresa..."
              value={empresaNome}
              onChange={(e) => onEmpresaNomeChange(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcao" className="text-foreground font-medium">
              Qual sua função? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="funcao"
              placeholder="Ex: Analista, Coordenador, Operador..."
              value={funcao}
              onChange={(e) => onFuncaoChange(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor" className="text-foreground font-medium">
              Qual o seu setor? <span className="text-destructive">*</span>
            </Label>
            <Input
              id="setor"
              placeholder="Ex: Administrativo, Operacional, RH..."
              value={setor}
              onChange={(e) => onSetorChange(e.target.value)}
              className="rounded-xl"
            />
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
            className="hero-gradient text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl gap-2 hover:opacity-90 transition-opacity"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IdentificationScreen;
