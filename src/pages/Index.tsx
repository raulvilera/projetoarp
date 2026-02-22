import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { sections } from "@/data/questionnaire";
import WelcomeScreen from "@/components/questionnaire/WelcomeScreen";
import IdentificationScreen from "@/components/questionnaire/IdentificationScreen";
import SectionView from "@/components/questionnaire/SectionView";
import CompletionScreen from "@/components/questionnaire/CompletionScreen";
import { useToast } from "@/hooks/use-toast";

type Phase = "welcome" | "identification" | "questionnaire" | "complete";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [funcao, setFuncao] = useState("");
  const [setor, setSetor] = useState("");
  const { toast } = useToast();

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      try {
        const response = await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ funcao, setor, answers }),
        });

        if (!response.ok) throw new Error('Falha ao enviar respostas');

        toast({
          title: "✅ Respostas enviadas!",
          description: "Obrigado por participar da avaliação.",
        });
        setPhase("complete");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "❌ Erro ao enviar",
          description: "Não foi possível salvar suas respostas. Tente novamente.",
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentSection(0);
    setFuncao("");
    setSetor("");
    setPhase("welcome");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "welcome" && (
        <WelcomeScreen key="welcome" onStart={() => setPhase("identification")} />
      )}
      {phase === "identification" && (
        <IdentificationScreen
          key="identification"
          funcao={funcao}
          setor={setor}
          onFuncaoChange={setFuncao}
          onSetorChange={setSetor}
          onNext={() => setPhase("questionnaire")}
        />
      )}
      {phase === "questionnaire" && (
        <SectionView
          key={`section-${currentSection}`}
          section={sections[currentSection]}
          totalSections={sections.length}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={currentSection === 0}
          isLast={currentSection === sections.length - 1}
        />
      )}
      {phase === "complete" && (
        <CompletionScreen key="complete" onRestart={handleRestart} />
      )}
    </AnimatePresence>
  );
};

export default Index;
