import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Check,
  AlertTriangle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Francisquinho } from "../Francisquinho";

interface Challenge5Props {
  onBack: () => void;
  onContinue: (selectedWords: string[], reflection: string) => void;
  initialSelected?: string[];
  initialReflection?: string;
}

// Lista focada de palavras que fazem bem (o aluno deve escolher 5)
const GOOD_WORDS = [
  "Acolhimento",
  "Amizade",
  "Respeito",
  "Esperança",
  "Cuidado",
  "Escuta",
  "Apoio",
  "Gentileza",
  "Empatia",
  "Gratidão",
  "Paz",
  "Abraço",
];

// Lista de atitudes que machucam (o aluno deve escolher 5 para nunca fazer)
const HURTFUL_WORDS = [
  "Fofoca",
  "Apelido Maldoso",
  "Deboche",
  "Exclusão",
  "Preconceito",
  "Mentira",
  "Humilhação",
  "Xingamento",
  "Ignorar o Colega",
  "Julgamento",
  "Intimidação",
  "Grosseria",
];

export const Challenge5GoodWords: React.FC<Challenge5Props> = ({
  onBack,
  onContinue,
  initialSelected = [],
  initialReflection = "",
}) => {
  const [selectedGood, setSelectedGood] = useState<string[]>(
    initialSelected
      .filter((w) => !w.includes("[Machuca]"))
      .map((w) => w.replace("[Faz Bem] ", ""))
      .slice(0, 5)
  );

  const [identifiedHurtful, setIdentifiedHurtful] = useState<string[]>(
    initialSelected
      .filter((w) => w.includes("[Machuca]"))
      .map((w) => w.replace("[Machuca] ", ""))
      .slice(0, 5)
  );

  const [reflection, setReflection] = useState(initialReflection);
  const [error, setError] = useState<string | null>(null);

  const toggleGood = (word: string) => {
    setError(null);
    if (selectedGood.includes(word)) {
      setSelectedGood(selectedGood.filter((w) => w !== word));
    } else {
      if (selectedGood.length >= 5) {
        setError("Você já escolheu as 5 palavras que fazem bem! Se quiser trocar, desmarque uma antes.");
        return;
      }
      setSelectedGood([...selectedGood, word]);
    }
  };

  const toggleHurtful = (word: string) => {
    setError(null);
    if (identifiedHurtful.includes(word)) {
      setIdentifiedHurtful(identifiedHurtful.filter((w) => w !== word));
    } else {
      if (identifiedHurtful.length >= 5) {
        setError("Você já selecionou as 5 atitudes que nunca devemos fazer! Para trocar, desmarque uma.");
        return;
      }
      setIdentifiedHurtful([...identifiedHurtful, word]);
    }
  };

  const handleFinish = () => {
    if (selectedGood.length < 5) {
      setError(`Selecione exatamente 5 palavras que fazem bem (você escolheu ${selectedGood.length}).`);
      return;
    }
    if (identifiedHurtful.length < 5) {
      setError(`Selecione exatamente 5 atitudes que machucam que nunca devemos fazer (você escolheu ${identifiedHurtful.length}).`);
      return;
    }

    setError(null);
    const combined = [
      ...selectedGood.map((w) => `[Faz Bem] ${w}`),
      ...identifiedHurtful.map((w) => `[Machuca] ${w}`),
    ];
    // Sem exigência de mínimo de caracteres na reflexão
    onContinue(combined, reflection.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Header com Francisquinho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="holding_heart" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Etapa 5 de 8 • Palavras & Convivência</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Palavras que Iluminam o Coração 💛
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Escolha as <strong>5 que fazem bem</strong> e as <strong>5 que nunca devemos fazer</strong> com os outros.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`text-center px-3.5 py-1.5 rounded-xl border transition-all ${
              selectedGood.length === 5
                ? "bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black shadow-2xs"
                : "bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold"
            }`}>
              <span className="text-[10px] uppercase font-bold block">Faz Bem</span>
              <span className="text-sm sm:text-base font-black">{selectedGood.length}/5</span>
            </div>
            <div className={`text-center px-3.5 py-1.5 rounded-xl border transition-all ${
              identifiedHurtful.length === 5
                ? "bg-rose-100 border-2 border-rose-400 text-rose-950 font-black shadow-2xs"
                : "bg-rose-50 border border-rose-300 text-rose-900 font-bold"
            }`}>
              <span className="text-[10px] uppercase font-bold block">Machucam</span>
              <span className="text-sm sm:text-base font-black">{identifiedHurtful.length}/5</span>
            </div>
          </div>
        </div>

        {/* Section 1: 5 Palavras que Fazem Bem */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-950 flex items-center justify-center text-xs">
                💛
              </span>
              1. Selecione as 5 atitudes mais importantes que fazem bem:
            </h3>
            <span className="text-xs sm:text-sm font-black text-emerald-900">
              {selectedGood.length} de 5 selecionadas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
            {GOOD_WORDS.map((word) => {
              const isSelected = selectedGood.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleGood(word)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500"
                      : "bg-white hover:bg-emerald-100/60 text-slate-850 border border-slate-300 hover:border-emerald-400 shadow-2xs"
                  }`}
                >
                  <span className="truncate">{word}</span>
                  {isSelected ? (
                    <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: 5 Atitudes que Machucam */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-rose-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-200 text-rose-950 flex items-center justify-center text-xs">
                🚫
              </span>
              2. Selecione 5 atitudes que machucam e que NUNCA devemos fazer:
            </h3>
            <span className="text-xs sm:text-sm font-black text-rose-900">
              {identifiedHurtful.length} de 5 selecionadas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
            {HURTFUL_WORDS.map((word) => {
              const isSelected = identifiedHurtful.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleHurtful(word)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-500"
                      : "bg-white hover:bg-rose-100/60 text-slate-850 border border-slate-300 hover:border-rose-400 shadow-2xs"
                  }`}
                >
                  <span className="truncate">{word}</span>
                  {isSelected ? (
                    <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pergunta Fácil e sem mínimo de caracteres */}
        <div className="pt-4 border-t border-slate-100">
          <label
            htmlFor="input-palavras-reflexao"
            className="block text-sm sm:text-base font-extrabold text-slate-950 mb-2 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-amber-500" />
            3. Como você pode ajudar um amigo que estiver triste hoje? (Pergunta fácil! Escreva com suas palavras):
          </label>
          <textarea
            id="input-palavras-reflexao"
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Ex: Dando um abraço, ouvindo o que ele tem pra dizer ou chamando pra brincar..."
            className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
          />
          <div className="text-xs sm:text-sm text-slate-600 mt-1.5 px-1 font-medium">
            🌻 <strong>Dica do Francisquinho:</strong> Escreva livremente, qualquer resposta com carinho é válida!
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
