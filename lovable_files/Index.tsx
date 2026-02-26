import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { sections } from "@/data/questionnaire";
import WelcomeScreen from "@/components/questionnaire/WelcomeScreen";
import IdentificationScreen from "@/components/questionnaire/IdentificationScreen";
import SectionView from "@/components/questionnaire/SectionView";
import CompletionScreen from "@/components/questionnaire/CompletionScreen";
import { useToast } from "@/hooks/use-toast";

// Endpoint da Vercel (Express) que insere no Supabase usando a service key (sem RLS)
const API_URL = "https://drps-manager.vercel.app/api/responses";

type Phase = "welcome" | "identification" | "questionnaire" | "complete";

const Index = () => {
    const [phase, setPhase] = useState<Phase>("welcome");
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [funcao, setFuncao] = useState("");
    const [setor, setSetor] = useState("");
    const [empresaNome, setEmpresaNome] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleAnswer = useCallback((questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }, []);

    const saveToSupabase = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    empresa_nome: empresaNome.trim(),
                    funcao: funcao.trim(),
                    setor: setor.trim(),
                    answers,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Erro ao salvar:", data);
                toast({
                    title: "⚠️ Erro ao salvar",
                    description: "Não foi possível registrar suas respostas. Tente novamente.",
                    variant: "destructive",
                });
                return false;
            }

            return true;
        } catch (err) {
            console.error("Erro inesperado:", err);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = async () => {
        if (currentSection < sections.length - 1) {
            setCurrentSection((s) => s + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const saved = await saveToSupabase();
            if (saved) {
                toast({
                    title: "✅ Respostas enviadas!",
                    description: "Obrigado por participar da avaliação.",
                });
            }
            setPhase("complete");
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
        setEmpresaNome("");
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
                    empresaNome={empresaNome}
                    onFuncaoChange={setFuncao}
                    onSetorChange={setSetor}
                    onEmpresaNomeChange={setEmpresaNome}
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
                    isSaving={isSaving}
                />
            )}
            {phase === "complete" && (
                <CompletionScreen key="complete" onRestart={handleRestart} />
            )}
        </AnimatePresence>
    );
};

export default Index;
