import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Section } from "@/data/questionnaire";

type SectionViewProps = {
  section: Section;
  totalSections: number;
  answers: Record<string, number>;
  comment: string;
  onAnswer: (questionId: string, value: number) => void;
  onComment: (sectionId: number, comment: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

const SectionView = ({
  section,
  totalSections,
  answers,
  comment,
  onAnswer,
  onComment,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: SectionViewProps) => {
  const allAnswered = section.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <ProgressBar current={section.id} total={totalSections} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="mb-8">
              <div className="text-4xl mb-3">{section.icon}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {section.title}
              </h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4 mb-10">
              {section.questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  value={answers[q.id]}
                  onChange={onAnswer}
                />
              ))}
            </div>

            {/* Qualitative Feedback */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-10 space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <Label htmlFor={`comment-${section.id}`} className="font-semibold text-base">
                  Algo a acrescentar sobre {section.title.toLowerCase()}?
                </Label>
              </div>
              <Textarea
                id={`comment-${section.id}`}
                placeholder="Exemplo: 'Às vezes o software trava tarde', 'Sinto pressão maior no fechamento de mês'..."
                className="bg-white border-blue-200 focus-visible:ring-blue-400 min-h-[100px] rounded-xl text-slate-700"
                value={comment}
                onChange={(e) => onComment(section.id, e.target.value)}
              />
              <p className="text-xs text-blue-600/70 italic">
                Sua justificativa ajuda a Inteligência DRPS a propor soluções mais precisas.
              </p>
            </div>
            <div className="flex items-center justify-between pb-8">
              <Button
                variant="outline"
                onClick={onPrev}
                disabled={isFirst}
                className="gap-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button
                onClick={onNext}
                disabled={!allAnswered}
                className={`gap-2 rounded-xl ${isLast
                  ? "hero-gradient text-primary-foreground hover:opacity-90"
                  : ""
                  }`}
              >
                {isLast ? (
                  <>
                    Enviar Respostas
                    <Send className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectionView;
