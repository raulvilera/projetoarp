import { motion } from "framer-motion";
import { likertOptions } from "@/data/questionnaire";
import { cn } from "@/lib/utils";

type LikertScaleProps = {
  questionId: string;
  value: number | undefined;
  onChange: (questionId: string, value: number) => void;
};

const LikertScale = ({ questionId, value, onChange }: LikertScaleProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {likertOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(questionId, option.value)}
            className={cn(
              "flex-1 min-w-[100px] px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2",
              isSelected
                ? "border-primary bg-primary text-primary-foreground card-shadow-hover"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <span className="block text-xs font-bold mb-0.5">{option.value}</span>
            <span className="block text-xs">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default LikertScale;
