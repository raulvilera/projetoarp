import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { sections } from "@/data/questionnaire";
import WelcomeScreen from "@/components/questionnaire/WelcomeScreen";
import IdentificationScreen from "@/components/questionnaire/IdentificationScreen";
import SectionView from "@/components/questionnaire/SectionView";
import CompletionScreen from "@/components/questionnaire/CompletionScreen";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStore } from "@/hooks/useCompanyStore";

type Phase = "welcome" | "identification" | "questionnaire" | "complete";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sectionComments, setSectionComments] = useState<Record<string, string>>({});
  const [funcao, setFuncao] = useState("");
  const [setor, setSetor] = useState("");
  const [empresaId, setEmpresaId] = useState<string | undefined>();
  const { toast } = useToast();
  const { addResponse } = useCompanyStore();

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleComment = useCallback((sectionId: number, comment: string) => {
    setSectionComments((prev) => ({ ...prev, [sectionId.toString()]: comment }));
  }, []);

  const handleStart = (selectedEmpresaId?: string) => {
    setEmpresaId(selectedEmpresaId);
    setPhase("identification");
  };

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      try {
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyyDmIGFoAymbihM3vb0XBJdJzipLp6Qtcpg99yoUwrMJjSNgjukTWe79OqwDdY8MuZA/exec';

        // Save locally/supabase so company folder can display it
        if (empresaId) {
          await addResponse({
            empresaId,
            funcao,
            setor,
            answers: { ...answers, ...sectionComments }
          });
        }

        try {
          await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcao, setor, answers, sectionComments, empresaId }),
          });
        } catch (scriptError) {
          // Mode 'no-cors' might still throw or we might want to log it
          console.error("Google Script submission error (expected with no-cors):", scriptError);
        }

        toast({
          title: "✅ Respostas enviadas!",
          description: "Obrigado por participar da avaliação.",
        });
        setPhase("complete");
      } catch (error) {
        console.error("Submission error:", error);
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
    setEmpresaId(undefined);
    setPhase("welcome");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "welcome" && (
        <WelcomeScreen key="welcome" onStart={handleStart} />
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
          onComment={handleComment}
          comment={sectionComments[sections[currentSection].id.toString()] || ""}
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
