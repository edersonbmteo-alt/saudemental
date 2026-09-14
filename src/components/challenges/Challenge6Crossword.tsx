import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, RefreshCw } from "lucide-react";

interface Challenge6Props {
  onBack: () => void;
  onContinue: (resultString: string) => void;
  initialAnswers?: Record<string, string>;
}

interface CellDef {
  r: number;
  c: number;
  expected: string;
  numberLabel?: number;
}

const CROSSWORD_CELLS: CellDef[] = [
  // 1. ESPERANCA (Horizontal: Row 2, Cols 1..9)
  { r: 2, c: 1, expected: "E", numberLabel: 1 },
  { r: 2, c: 2, expected: "S" },
  { r: 2, c: 3, expected: "P" }, // Intersects EMPATIA
  { r: 2, c: 4, expected: "E" },
  { r: 2, c: 5, expected: "R" }, // Intersects RESPEITO
  { r: 2, c: 6, expected: "A" },
  { r: 2, c: 7, expected: "N" },
  { r: 2, c: 8, expected: "C" },
  { r: 2, c: 9, expected: "A" },

  // 2. EMPATIA (Vertical: Rows 0..6, Col 3)
  { r: 0, c: 3, expected: "E", numberLabel: 2 },
  { r: 1, c: 3, expected: "M" },
  { r: 3, c: 3, expected: "A" },
  { r: 4, c: 3, expected: "T" },
  { r: 5, c: 3, expected: "I" },
  { r: 6, c: 3, expected: "A" },

  // 3. RESPEITO (Vertical: Rows 2..9, Col 5)
  { r: 3, c: 5, expected: "E" },
  { r: 4, c: 5, expected: "S" },
  { r: 5, c: 5, expected: "P" },
  { r: 6, c: 5, expected: "E" }, // Intersects ESCUTA
  { r: 7, c: 5, expected: "I" },
  { r: 8, c: 5, expected: "T" },
  { r: 9, c: 5, expected: "O" },

  // 4. ESCUTA (Horizontal: Row 6, Cols 5..10)
  { r: 6, c: 6, expected: "S" },
  { r: 6, c: 7, expected: "C" },
  { r: 6, c: 8, expected: "U" },
  { r: 6, c: 9, expected: "T" },
  { r: 6, c: 10, expected: "A" },
];

const ROWS = 10;
const COLS = 11;

const CLUES = [
  {
    num: 1,
    direction: "HORIZONTAL",
    word: "ESPERANCA",
    letters: 9,
    clue: "Acreditar que tudo vai melhorar e ter a confiança de que teremos dias melhores.",
  },
  {
    num: 2,
    direction: "VERTICAL",
    word: "EMPATIA",
    letters: 7,
    clue: "A capacidade de se colocar no lugar do colega e tentar compreender o que ele sente.",
  },
  {
    num: 3,
    direction: "VERTICAL",
    word: "RESPEITO",
    letters: 8,
    clue: "Tratar bem todas as pessoas, aceitando as diferenças sem fazer brincadeiras de mau gosto.",
  },
  {
    num: 4,
    direction: "HORIZONTAL",
    word: "ESCUTA",
    letters: 6,
    clue: "Prestar atenção com carinho quando um amigo quer conversar ou desabafar com a gente.",
  },
];

export const Challenge6Crossword: React.FC<Challenge6Props> = ({
  onBack,
  onContinue,
  initialAnswers = {},
}) => {
  const [userLetters, setUserLetters] = useState<Record<string, string>>(initialAnswers);
  const [showStatus, setShowStatus] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const cellMap = new Map<string, CellDef>();
  CROSSWORD_CELLS.forEach((c) => {
    cellMap.set(`${c.r}-${c.c}`, c);
  });

  const handleInputChange = (r: number, c: number, val: string) => {
    const key = `${r}-${c}`;
    const clean = val.slice(-1).toUpperCase();

    setUserLetters((prev) => ({
      ...prev,
      [key]: clean,
    }));

    if (clean) {
      const nextKeyRow = `${r}-${c + 1}`;
      const nextKeyCol = `${r + 1}-${c}`;
      if (cellMap.has(nextKeyRow)) {
        inputRefs.current[nextKeyRow]?.focus();
      } else if (cellMap.has(nextKeyCol)) {
        inputRefs.current[nextKeyCol]?.focus();
      }
    }
  };

  const handleKeyDown = (
    r: number,
    c: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const key = `${r}-${c}`;
    if (e.key === "Backspace" && !userLetters[key]) {
      const prevKeyRow = `${r}-${c - 1}`;
      const prevKeyCol = `${r - 1}-${c}`;
      if (cellMap.has(prevKeyRow)) {
        inputRefs.current[prevKeyRow]?.focus();
      } else if (cellMap.has(prevKeyCol)) {
        inputRefs.current[prevKeyCol]?.focus();
      }
    }
  };

  let correctCount = 0;
  let filledCount = 0;
  CROSSWORD_CELLS.forEach((c) => {
    const key = `${c.r}-${c.c}`;
    const userVal = (userLetters[key] || "").toUpperCase();
    if (userVal) filledCount++;
    if (userVal === c.expected) correctCount++;
  });

  const isAllCorrect = correctCount === CROSSWORD_CELLS.length;

  const handleFinish = () => {
    const resultString = `${correctCount}/${CROSSWORD_CELLS.length} letras corretas (${filledCount} preenchidas)`;
    onContinue(resultString);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shrink-0">
              ✏️
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 6 de 8 • Desafio de Palavras
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Palavras Cruzadas: Pilares da Vida
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Acertos:</span>
            <div className="text-sm font-extrabold text-[#005CA9] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100 mt-0.5">
              {correctCount} de {CROSSWORD_CELLS.length}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Preencha a grade cruzando quatro virtudes que sustentam a convivência fraterna e a saúde emocional. Leia com sensibilidade as pistas e digite as letras correspondentes.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Crossword Grid Container */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner max-w-full overflow-x-auto">
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, 36px)`,
                }}
              >
                {Array.from({ length: ROWS }, (_, r) =>
                  Array.from({ length: COLS }, (_, c) => {
                    const cell = cellMap.get(`${r}-${c}`);
                    const key = `${r}-${c}`;
                    const letter = userLetters[key] || "";
                    const isCorrect = showStatus && letter.toUpperCase() === cell?.expected;
                    const isWrong = showStatus && letter && letter.toUpperCase() !== cell?.expected;

                    if (!cell) {
                      return (
                        <div
                          key={key}
                          className="w-9 h-9 bg-slate-200/50 rounded-lg opacity-40 pointer-events-none"
                        />
                      );
                    }

                    let badgeNumber: number | null = null;
                    if (r === 2 && c === 1) badgeNumber = 1; // ESPERANCA
                    if (r === 0 && c === 3) badgeNumber = 2; // EMPATIA
                    if (r === 2 && c === 5) badgeNumber = 3; // RESPEITO
                    if (r === 6 && c === 5) badgeNumber = 4; // ESCUTA

                    return (
                      <div key={key} className="relative w-9 h-9">
                        {badgeNumber && (
                          <span className="absolute top-0.5 left-1 text-[9px] font-black text-[#005CA9] pointer-events-none z-10">
                            {badgeNumber}
                          </span>
                        )}
                        <input
                          ref={(el) => (inputRefs.current[key] = el)}
                          type="text"
                          maxLength={1}
                          value={letter}
                          onChange={(e) => handleInputChange(r, c, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(r, c, e)}
                          className={`w-full h-full text-center font-mono font-extrabold text-base rounded-xl uppercase transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer ${
                            isCorrect
                              ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold"
                              : isWrong
                              ? "bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold"
                              : letter
                              ? "bg-amber-300 text-slate-950 font-black border-2 border-amber-400 shadow-xs"
                              : "bg-white border border-slate-300 hover:border-amber-400 text-slate-900 shadow-2xs"
                          }`}
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {/* Grid Action Controls */}
              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setShowStatus(!showStatus)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{showStatus ? "Ocultar Correção" : "Verificar Letras"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserLetters({})}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 font-semibold shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Limpar Grade</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clues List */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#005CA9]" />
                Pistas Reflexivas
              </h3>

              <div className="space-y-2.5">
                {CLUES.map((clue) => (
                  <div
                    key={clue.num}
                    className="p-3 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-[#005CA9]">
                        {clue.num}. {clue.direction} ({clue.letters} letras)
                      </span>
                    </div>
                    <p className="text-slate-600">{clue.clue}</p>
                  </div>
                ))}
              </div>
            </div>

            {isAllCorrect && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Parabéns! Todas as palavras foram preenchidas com precisão e harmonia!</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-6"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-6"
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
