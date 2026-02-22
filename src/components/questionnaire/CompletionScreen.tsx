import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CompletionScreenProps = {
  onRestart: () => void;
};

const CompletionScreen = ({ onRestart }: CompletionScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 hero-gradient rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Avaliação Concluída!
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Suas respostas foram registradas com sucesso.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Obrigado por contribuir para um ambiente de trabalho mais saudável e
            seguro. Os dados serão analisados de forma confidencial e
            anonimizada.
          </p>

          <Button
            variant="outline"
            onClick={onRestart}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Realizar nova avaliação
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompletionScreen;
