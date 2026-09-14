import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Plus,
  Check,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

interface Challenge5Props {
  onBack: () => void;
  onContinue: (selectedWords: string[], reflection: string) => void;
  initialSelected?: string[];
  initialReflection?: string;
}

const GOOD_WORDS = [
  "Acolhimento",
  "Amizade",
  "Respeito",
  "Esperança",
  "Cuidado",
  "Escuta",
  "Apoio",
  "Gentileza",
  "Confiança",
  "Empatia",
  "Paciência",
  "Solidariedade",
  "Compreensão",
  "Afeto",
  "Gratidão",
  "Perdão",
  "Elogio",
  "União",
  "Diálogo",
  "Compaixão",
  "Inclusão",
  "Paz",
  "Generosidade",
  "Alegria",
  "Abraço",
  "Encorajamento",
];

const HURTFUL_WORDS = [
  "Fofoca",
  "Julgamento",
  "Apelido Maldoso",
  "Ofensa",
  "Deboche",
  "Desprezo",
  "Indiferença",
  "Exclusão",
  "Agressão",
  "Preconceito",
  "Mentira",
  "Rótulo",
  "Humilhação",
  "Intolerância",
  "Xingamento",
  "Crueldade",
  "Inveja",
  "Ironia Destrutiva",
  "Falsidade",
  "Ignorar o Outro",
];

export const Challenge5GoodWords: React.FC<Challenge5Props> = ({
  onBack,
  onContinue,
  initialSelected = [],
  initialReflection = "",
}) => {
  const [selectedGood, setSelectedGood] = useState<string[]>(
    initialSelected.filter((w) => !HURTFUL_WORDS.includes(w))
  );
  const [identifiedHurtful, setIdentifiedHurtful] = useState<string[]>(
    initialSelected.filter((w) => HURTFUL_WORDS.includes(w))
  );
  const [customWordInput, setCustomWordInput] = useState("");
  const [customCategory, setCustomCategory] = useState<"good" | "hurtful">("good");
  const [availableGoodWords, setAvailableGoodWords] = useState<string[]>(GOOD_WORDS);
  const [availableHurtfulWords, setAvailableHurtfulWords] = useState<string[]>(HURTFUL_WORDS);
  const [reflection, setReflection] = useState(initialReflection);
  const [error, setError] = useState<string | null>(null);

  const toggleGood = (word: string) => {
    setSelectedGood((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const toggleHurtful = (word: string) => {
    setIdentifiedHurtful((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customWordInput.trim();
    if (!clean) return;

    if (customCategory === "good") {
      if (!availableGoodWords.some((w) => w.toLowerCase() === clean.toLowerCase())) {
        setAvailableGoodWords((prev) => [...prev, clean]);
      }
      if (!selectedGood.includes(clean)) {
        setSelectedGood((prev) => [...prev, clean]);
      }
    } else {
      if (!availableHurtfulWords.some((w) => w.toLowerCase() === clean.toLowerCase())) {
        setAvailableHurtfulWords((prev) => [...prev, clean]);
      }
      if (!identifiedHurtful.includes(clean)) {
        setIdentifiedHurtful((prev) => [...prev, clean]);
      }
    }

    setCustomWordInput("");
  };

  const handleFinish = () => {
    if (selectedGood.length === 0) {
      setError("Por favor, selecione pelo menos uma palavra que faz bem ao coração.");
      return;
    }
    if (identifiedHurtful.length === 0) {
      setError("Por favor, identifique pelo menos uma palavra ou atitude que machuca para refletirmos juntos.");
      return;
    }
    if (!reflection.trim() || reflection.trim().length < 10) {
      setError("Por favor, escreva uma breve reflexão explicando a sua escolha (mínimo de 10 caracteres).");
      return;
    }

    setError(null);
    // Combine selected good and identified hurtful for reporting
    const combined = [
      ...selectedGood.map((w) => `[Faz Bem] ${w}`),
      ...identifiedHurtful.map((w) => `[Machuca] ${w}`),
    ];
    onContinue(combined, reflection.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shrink-0">
              💛
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 5 de 8 • Expressão & Consciência
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Palavras que Fazem Bem
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="text-center bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Faz Bem</span>
              <span className="text-sm font-extrabold text-emerald-800">{selectedGood.length}</span>
            </div>
            <div className="text-center bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Machuca</span>
              <span className="text-sm font-extrabold text-rose-800">{identifiedHurtful.length}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Nossas palavras têm força: elas podem acolher, iluminar e salvar o dia de alguém, ou ferir e afastar. Nesta atividade, identifique tanto as <strong>palavras que constroem a paz</strong> quanto aquelas que <strong>machucam e precisamos eliminar</strong> do nosso vocabulário.
        </p>

        {/* Section 1: Good Words */}
        <div className="mb-8 p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
              💛
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 font-['Outfit']">
              1. Palavras que Fazem Bem (Luz, Acolhimento & Respeito)
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-3.5">
            Selecione as palavras que você considera fundamentais para praticar e espalhar no colégio:
          </p>

          <div className="flex flex-wrap gap-2">
            {availableGoodWords.map((word) => {
              const isSelected = selectedGood.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleGood(word)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs scale-105"
                      : "bg-white hover:bg-emerald-100/60 text-slate-700 border border-emerald-200 shadow-2xs"
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Hurtful Words */}
        <div className="mb-8 p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs">
              ⚠️
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-rose-950 font-['Outfit']">
              2. Palavras e Atitudes que Machucam (Alerta & Prevenção)
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-3.5">
            Identifique aquelas que causam dor, ferem os sentimentos e que devemos combater juntos:
          </p>

          <div className="flex flex-wrap gap-2">
            {availableHurtfulWords.map((word) => {
              const isSelected = identifiedHurtful.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleHurtful(word)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-rose-600 text-white shadow-xs scale-105"
                      : "bg-white hover:bg-rose-100/60 text-slate-700 border border-rose-200 shadow-2xs"
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Word */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Adicionar outra palavra ou atitude à atividade:
          </label>
          <form onSubmit={handleAddCustomWord} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customWordInput}
              onChange={(e) => setCustomWordInput(e.target.value)}
              placeholder="Digite a palavra..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs"
            />
            <div className="flex items-center gap-2">
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as "good" | "hurtful")}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="good">Palavra que Faz Bem</option>
                <option value="hurtful">Palavra que Machuca</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005CA9] hover:bg-[#004b8a] text-white font-bold text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Reflection Textarea */}
        <div className="pt-4 border-t border-slate-100">
          <label
            htmlFor="input-palavras-reflexao"
            className="block text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#005CA9]" />
            3. Como podemos transformar as palavras que machucam em acolhimento na nossa escola? Dê um exemplo prático de como substituir uma atitude que fere por uma palavra que faz bem:
          </label>
          <textarea
            id="input-palavras-reflexao"
            rows={4}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Compartilhe aqui sua reflexão e pensamentos com sinceridade..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white leading-relaxed transition-all shadow-2xs"
          />
          <div className="flex justify-between items-center text-xs text-slate-500 mt-2 px-1 font-medium">
            <span>Mínimo de 10 caracteres</span>
            <span>{reflection.length} caracteres</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-5"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-5"
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
