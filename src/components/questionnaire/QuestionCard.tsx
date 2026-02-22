import { motion } from "framer-motion";
import LikertScale from "./LikertScale";
import type { Question } from "@/data/questionnaire";

type QuestionCardProps = {
  question: Question;
  index: number;
  value: number | undefined;
  onChange: (questionId: string, value: number) => void;
};

const QuestionCard = ({ question, index, value, onChange }: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-xl card-shadow p-5 md:p-6"
    >
      <p className="text-foreground font-medium mb-4 leading-relaxed">
        <span className="text-primary font-semibold mr-2">{question.id}</span>
        {question.text}
      </p>
      <LikertScale questionId={question.id} value={value} onChange={onChange} />
    </motion.div>
  );
};

export default QuestionCard;
