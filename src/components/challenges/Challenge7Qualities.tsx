import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Star, Check, Compass } from "lucide-react";
import { Francisquinho } from "../Francisquinho";

interface Challenge7Props {
  onBack: () => void;
  onContinue: (
    selectedQualities: string[],
    qualityRecognized: string,
    qualityToDevelop: string
  ) => void;
  initialSelected?: string[];
  initialRecognized?: string;
  initialToDevelop?: string;
}

const QUALITIES_LIST = [
  "Atencioso(a)",
  "Criativo(a)",
  "Responsável",
  "Amigo(a)",
  "Corajoso(a)",
  "Paciente",
  "Gentil",
  "Esforçado(a)",
  "Solidário(a)",
  "Curioso(a)",
  "Respeitoso(a)",
  "Persistente",
  "Leal",
  "Determinado(a)",
  "Colaborativo(a)",
];

export const Challenge7Qualities: React.FC<Challenge7Props> = ({
  onBack,
  onContinue,
  initialSelected = [],
  initialRecognized = "",
  initialToDevelop = "",
}) => {
  const [selectedQualities, setSelectedQualities] = useState<string[]>(initialSelected);
  const [qualityRecognized, setQualityRecognized] = useState(initialRecognized);
  const [qualityToDevelop, setQualityToDevelop] = useState(initialToDevelop);
  const [error, setError] = useState<string | null>(null);

  const toggleQuality = (item: string) => {
    setSelectedQualities((prev) =>
      prev.includes(item) ? prev.filter((q) => q !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    if (selectedQualities.length === 0) {
      setError("Por favor, selecione ao menos uma qualidade com a qual você se identifica.");
      return;
    }
    if (!qualityRecognized.trim()) {
      setError("Por favor, descreva a qualidade que você reconhece em si mesmo(a).");
      return;
    }
    if (!qualityToDevelop.trim()) {
      setError("Por favor, descreva a qualidade que você gostaria de desenvolver ainda mais.");
      return;
    }

    setError(null);
    onContinue(selectedQualities, qualityRecognized.trim(), qualityToDevelop.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="holding_heart" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 7 de 8 • Autoconhecimento
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Reconhecendo Nossas Forças & Virtudes
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Selecionadas:</span>
            <div className="text-sm font-extrabold text-[#005CA9] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100 mt-0.5">
              {selectedQualities.length}
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-800 mb-6 leading-relaxed font-normal">
          Cuidar da própria saúde emocional começa pelo reconhecimento generoso de quem nós somos. Cada ser humano carrega talentos, dons e virtudes que tornam a convivência escolar mais rica e humana.
        </p>

        {/* Qualities Grid Selection */}
        <div className="mb-8">
          <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            1. Assinale as características que você reconhece em sua personalidade:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {QUALITIES_LIST.map((quality) => {
              const isSelected = selectedQualities.includes(quality);
              return (
                <button
                  key={quality}
                  type="button"
                  onClick={() => toggleQuality(quality)}
                  className={`p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-amber-300 border-2 border-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-200 scale-[1.02]"
                      : "bg-white hover:bg-amber-50/70 text-slate-800 border border-slate-300 hover:border-amber-400 shadow-2xs"
                  }`}
                >
                  <span className="truncate">{quality}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 stroke-[3] text-slate-950" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep reflection fields */}
        <div className="pt-6 border-t border-slate-100 space-y-5">
          <div className="text-sm sm:text-base font-extrabold text-slate-950 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#005CA9]" />
            2. Olhar Pessoal & Plano de Crescimento:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-2xs">
              <label
                htmlFor="input-qualidade-reconhecida"
                className="block text-xs sm:text-sm font-extrabold text-slate-950 mb-2"
              >
                Uma qualidade que você reconhece e valoriza em si:
              </label>
              <textarea
                id="input-qualidade-reconhecida"
                rows={3}
                value={qualityRecognized}
                onChange={(e) => setQualityRecognized(e.target.value)}
                placeholder="Ex: Valorizo minha capacidade de ser leal aos amigos e ouvir quem está em um momento difícil..."
                className="w-full p-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-2xs font-medium"
              />
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-2xs">
              <label
                htmlFor="input-qualidade-desenvolver"
                className="block text-xs sm:text-sm font-extrabold text-[#005CA9] mb-2"
              >
                Uma virtude que você gostaria de aprimorar ainda mais:
              </label>
              <textarea
                id="input-qualidade-desenvolver"
                rows={3}
                value={qualityToDevelop}
                onChange={(e) => setQualityToDevelop(e.target.value)}
                placeholder="Ex: Quero exercitar mais a paciência nas horas de estresse e ter mais calma para ouvir opiniões diferentes..."
                className="w-full p-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-[#005CA9] transition-all shadow-2xs font-medium"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-7"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-7"
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
