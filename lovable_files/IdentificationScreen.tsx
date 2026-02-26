// Arquivo: src/components/questionnaire/IdentificationScreen.tsx
// COLE ESTE ARQUIVO NO PROJETO LOVABLE substituindo o original
// Adicionado campo "Nome da Empresa" que é obrigatório para vincular a resposta
import { motion } from "framer-motion";
import { Building2, Briefcase, Users } from "lucide-react";

interface IdentificationScreenProps {
    funcao: string;
    setor: string;
    empresaNome: string;
    onFuncaoChange: (v: string) => void;
    onSetorChange: (v: string) => void;
    onEmpresaNomeChange: (v: string) => void;
    onNext: () => void;
}

const IdentificationScreen = ({
    funcao,
    setor,
    empresaNome,
    onFuncaoChange,
    onSetorChange,
    onEmpresaNomeChange,
    onNext,
}: IdentificationScreenProps) => {
    const canProceed = funcao.trim().length > 0 && setor.trim().length > 0 && empresaNome.trim().length > 0;

    return (
        <motion.div
            key="identification"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4"
        >
            <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Identificação</h2>
                    <p className="text-slate-400 text-sm">
                        Suas respostas são anônimas. Preencha os campos para continuar.
                    </p>
                </div>

                {/* Nome da Empresa */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Building2 className="h-4 w-4" />
                        Nome da Empresa *
                    </label>
                    <input
                        type="text"
                        value={empresaNome}
                        onChange={(e) => onEmpresaNomeChange(e.target.value)}
                        placeholder="Digite o nome da empresa onde você trabalha..."
                        className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* Função */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Briefcase className="h-4 w-4" />
                        Sua Função / Cargo *
                    </label>
                    <input
                        type="text"
                        value={funcao}
                        onChange={(e) => onFuncaoChange(e.target.value)}
                        placeholder="Ex: Analista, Técnico, Gerente..."
                        className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* Setor */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Users className="h-4 w-4" />
                        Setor / Departamento *
                    </label>
                    <input
                        type="text"
                        value={setor}
                        onChange={(e) => onSetorChange(e.target.value)}
                        placeholder="Ex: RH, Financeiro, Operações..."
                        className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 shadow-lg
            ${canProceed
                            ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 hover:shadow-blue-500/30 hover:shadow-xl"
                            : "bg-slate-700 cursor-not-allowed opacity-50"
                        }`}
                >
                    Iniciar Avaliação →
                </button>

                <p className="text-center text-xs text-slate-500">
                    * Campos obrigatórios. Suas respostas são completamente anônimas.
                </p>
            </div>
        </motion.div>
    );
};

export default IdentificationScreen;
