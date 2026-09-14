import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Search, Check, HelpCircle } from "lucide-react";

interface Challenge4Props {
  onBack: () => void;
  onContinue: (foundWords: string[]) => void;
  initialFoundWords?: string[];
}

const WORDS_TO_FIND = [
  "EMPATIA",
  "CUIDADO",
  "ESCUTA",
  "AMIZADE",
  "APOIO",
  "RESPEITO",
  "VIDA",
  "ESPERANCA",
  "GENTILEZA",
];

const GRID_SIZE = 12;

const WORD_DEFINITIONS: { word: string; cells: [number, number][] }[] = [
  {
    word: "ESPERANCA",
    cells: [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]
    ]
  },
  {
    word: "AMIZADE",
    cells: [
      [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]
    ]
  },
  {
    word: "RESPEITO",
    cells: [
      [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]
    ]
  },
  {
    word: "CUIDADO",
    cells: [
      [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]
    ]
  },
  {
    word: "ESCUTA",
    cells: [
      [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8]
    ]
  },
  {
    word: "APOIO",
    cells: [
      [8, 4], [7, 5], [6, 6], [5, 7], [4, 8]
    ]
  },
  {
    word: "GENTILEZA",
    cells: [
      [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [10, 11]
    ]
  },
  {
    word: "VIDA",
    cells: [
      [4, 10], [3, 10], [2, 10], [1, 10]
    ]
  },
  {
    word: "EMPATIA",
    cells: [
      [11, 1], [11, 2], [11, 3], [11, 4], [11, 5], [11, 6], [11, 7]
    ]
  }
];

const WORD_COLORS: Record<string, string> = {
  ESPERANCA: "bg-amber-100 text-amber-900 font-bold border border-amber-300",
  AMIZADE: "bg-sky-100 text-sky-900 font-bold border border-sky-300",
  RESPEITO: "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300",
  CUIDADO: "bg-purple-100 text-purple-900 font-bold border border-purple-300",
  ESCUTA: "bg-rose-100 text-rose-900 font-bold border border-rose-300",
  APOIO: "bg-cyan-100 text-cyan-900 font-bold border border-cyan-300",
  GENTILEZA: "bg-yellow-100 text-yellow-900 font-bold border border-yellow-300",
  VIDA: "bg-orange-100 text-orange-900 font-bold border border-orange-300",
  EMPATIA: "bg-teal-100 text-teal-900 font-bold border border-teal-300",
};

function buildInitialGrid(): string[][] {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("")
  );

  WORD_DEFINITIONS.forEach(({ word, cells }) => {
    cells.forEach(([r, c], i) => {
      grid[r][c] = word[i];
    });
  });

  const fillers = "ABCDEFGHILMNOPRSTUVZ";
  let seed = 42;
  const randomChar = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return fillers[Math.floor((seed / 233280) * fillers.length)];
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) {
        grid[r][c] = randomChar();
      }
    }
  }

  return grid;
}

const STATIC_GRID = buildInitialGrid();

export const Challenge4WordSearch: React.FC<Challenge4Props> = ({
  onBack,
  onContinue,
  initialFoundWords = [],
}) => {
  const [foundWords, setFoundWords] = useState<string[]>(initialFoundWords);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);

  const handlePointerDown = (r: number, c: number) => {
    setIsSelecting(true);
    setStartCell({ r, c });
    setSelectedCells([{ r, c }]);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (!isSelecting || !startCell) return;

    const dr = r - startCell.r;
    const dc = c - startCell.c;

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    const isHorizontal = dr === 0 && dc !== 0;
    const isVertical = dc === 0 && dr !== 0;
    const isDiagonal = absDr === absDc && absDr !== 0;

    if (!isHorizontal && !isVertical && !isDiagonal) return;

    const steps = Math.max(absDr, absDc);
    const stepR = dr === 0 ? 0 : dr / absDr;
    const stepC = dc === 0 ? 0 : dc / absDc;

    const cells: { r: number; c: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({
        r: startCell.r + i * stepR,
        c: startCell.c + i * stepC,
      });
    }

    setSelectedCells(cells);
  };

  const handlePointerUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    if (selectedCells.length < 2) {
      setSelectedCells([]);
      setStartCell(null);
      return;
    }

    const selectedLetters = selectedCells
      .map(({ r, c }) => STATIC_GRID[r][c])
      .join("");
    const reversedLetters = selectedLetters.split("").reverse().join("");

    const matchedDef = WORD_DEFINITIONS.find(
      (w) => w.word === selectedLetters || w.word === reversedLetters
    );

    if (matchedDef && !foundWords.includes(matchedDef.word)) {
      setFoundWords((prev) => [...prev, matchedDef.word]);
    }

    setSelectedCells([]);
    setStartCell(null);
  };

  const getFoundColorForCell = (r: number, c: number): string | null => {
    for (const def of WORD_DEFINITIONS) {
      if (foundWords.includes(def.word)) {
        if (def.cells.some(([cr, cc]) => cr === r && cc === c)) {
          return WORD_COLORS[def.word] || "bg-amber-100 text-amber-950 font-bold";
        }
      }
    }
    return null;
  };

  const isCellSelected = (r: number, c: number) =>
    selectedCells.some((cell) => cell.r === r && cell.c === c);

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 py-6 select-none"
      onPointerUp={handlePointerUp}
    >
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shrink-0">
              🔎
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 4 de 8 • Desafio de Busca
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Caça-Palavras da Empatia & Convivência
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Encontradas:</span>
            <div className="text-sm font-extrabold text-[#005CA9] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100 mt-0.5">
              {foundWords.length} de {WORDS_TO_FIND.length}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Localize na matriz 9 atitudes e valores fundamentais para o acolhimento e a valorização da vida. As palavras podem estar na <strong>horizontal</strong>, <strong>vertical</strong> ou <strong>diagonal</strong>. Clique e arraste sobre as letras para assinalar!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Word Search Grid */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner max-w-full overflow-x-auto">
              <div
                className="grid gap-1.5 touch-none"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  width: "min(100%, 460px)",
                }}
              >
                {STATIC_GRID.map((row, r) =>
                  row.map((letter, c) => {
                    const foundClass = getFoundColorForCell(r, c);
                    const isSelected = isCellSelected(r, c);

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onPointerDown={() => handlePointerDown(r, c)}
                        onPointerEnter={() => handlePointerEnter(r, c)}
                        className={`aspect-square w-full rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm md:text-base font-bold transition-all select-none cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 z-10 shadow-md"
                            : foundClass
                            ? `${foundClass} scale-[1.02] shadow-xs`
                            : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Word List Checklist */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#005CA9]" />
                Palavras a Encontrar ({foundWords.length}/{WORDS_TO_FIND.length})
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {WORDS_TO_FIND.map((word) => {
                  const isFound = foundWords.includes(word);
                  return (
                    <div
                      key={word}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isFound
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800 line-through opacity-90"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{word}</span>
                      {isFound ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hint Box */}
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-[#005CA9] text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#005CA9] shrink-0 mt-0.5" />
              <div className="leading-snug font-medium">
                Dica: Procure também em diagonais ou lendo de baixo para cima! Você pode prosseguir a qualquer momento.
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-4"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-4"
            onClick={() => onContinue(foundWords)}
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
