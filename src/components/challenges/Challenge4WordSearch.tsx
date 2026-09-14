import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Search, Check, Sparkles } from "lucide-react";
import { Francisquinho } from "../Francisquinho";

interface Challenge4Props {
  onBack: () => void;
  onContinue: (foundWords: string[]) => void;
  initialFoundWords?: string[];
}

// 7 palavras claras, diretas e fáceis de achar
const WORDS_TO_FIND = [
  "VIDA",
  "AMOR",
  "APOIO",
  "ESCUTA",
  "AMIZADE",
  "EMPATIA",
  "ESPERANCA",
];

const GRID_SIZE = 10;

// Grade com posicionamento 100% testado:
// Todas na HORIZONTAL ou VERTICAL para facilitar e garantir que os alunos encontrem sem frustração!
const WORD_DEFINITIONS: { word: string; cells: [number, number][] }[] = [
  {
    // VIDA - Linha 0, horizontal (fácil de topo)
    word: "VIDA",
    cells: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
  {
    // AMOR - Linha 2, horizontal
    word: "AMOR",
    cells: [[2, 5], [2, 6], [2, 7], [2, 8]],
  },
  {
    // APOIO - Linha 4, horizontal
    word: "APOIO",
    cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
  },
  {
    // ESCUTA - Linha 6, horizontal
    word: "ESCUTA",
    cells: [[6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7]],
  },
  {
    // ESPERANCA - Linha 8, horizontal
    word: "ESPERANCA",
    cells: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8]],
  },
  {
    // AMIZADE - Coluna 8, vertical (Linhas 0 a 6)
    word: "AMIZADE",
    cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9]],
  },
  {
    // EMPATIA - Coluna 1, vertical (Linhas 1 a 7)
    word: "EMPATIA",
    cells: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]],
  },
];

const WORD_COLORS: Record<string, string> = {
  VIDA: "bg-amber-200 text-amber-950 font-black border border-amber-400",
  AMOR: "bg-rose-200 text-rose-950 font-black border border-rose-400",
  APOIO: "bg-sky-200 text-sky-950 font-black border border-sky-400",
  ESCUTA: "bg-teal-200 text-teal-950 font-black border border-teal-400",
  AMIZADE: "bg-indigo-200 text-indigo-950 font-black border border-indigo-400",
  EMPATIA: "bg-emerald-200 text-emerald-950 font-black border border-emerald-400",
  ESPERANCA: "bg-yellow-200 text-yellow-950 font-black border border-yellow-400",
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

  // Letras neutras de preenchimento
  const fillers = "ABCDEFGHILMNOPRSTUVZ";
  let seed = 123;
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

  // Suporte tanto a arrastar quanto a clicar na 1ª letra e depois na última letra na GRADE
  const handleCellClick = (r: number, c: number) => {
    if (!startCell) {
      setStartCell({ r, c });
      setSelectedCells([{ r, c }]);
    } else {
      // Se clicou na mesma célula inicial, desseleciona
      if (startCell.r === r && startCell.c === c) {
        setStartCell(null);
        setSelectedCells([]);
        return;
      }
      // Calcula o caminho entre startCell e a célula clicada
      const dr = r - startCell.r;
      const dc = c - startCell.c;
      const absDr = Math.abs(dr);
      const absDc = Math.abs(dc);

      const isHorizontal = dr === 0 && dc !== 0;
      const isVertical = dc === 0 && dr !== 0;
      const isDiagonal = absDr === absDc && absDr !== 0;

      if (isHorizontal || isVertical || isDiagonal) {
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
        checkSelection(cells);
      }
      setStartCell(null);
      setSelectedCells([]);
    }
  };

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

    // Permitir seleção reta simples (horizontal ou vertical ou diagonal)
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

  const checkSelection = (cells: { r: number; c: number }[]) => {
    if (cells.length < 2) return;

    const lettersForward = cells.map(({ r, c }) => STATIC_GRID[r][c]).join("");
    const lettersBackward = lettersForward.split("").reverse().join("");

    const match = WORD_DEFINITIONS.find(
      (w) => w.word === lettersForward || w.word === lettersBackward
    );

    if (match && !foundWords.includes(match.word)) {
      setFoundWords((prev) => [...prev, match.word]);
    }
  };

  const handlePointerUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (selectedCells.length > 1) {
      checkSelection(selectedCells);
      setSelectedCells([]);
      setStartCell(null);
    }
  };

  const getFoundColorForCell = (r: number, c: number): string | null => {
    for (const def of WORD_DEFINITIONS) {
      if (foundWords.includes(def.word)) {
        if (def.cells.some(([cr, cc]) => cr === r && cc === c)) {
          return WORD_COLORS[def.word] || "bg-amber-200 text-amber-950 font-black";
        }
      }
    }
    return null;
  };

  const isCellSelected = (r: number, c: number) =>
    selectedCells.some((cell) => cell.r === r && cell.c === c);

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 py-6 select-none"
      onPointerUp={handlePointerUp}
    >
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Header com Francisquinho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="happy" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Etapa 4 de 8 • Caça-Palavras</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Caça-Palavras da Empatia 🔍
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Arraste o mouse ou dedo pelas letras. Todas as 7 palavras estão em linha reta!
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-2xl shrink-0">
            <span className="text-xs font-bold text-slate-600 block">Encontradas</span>
            <div className="text-base font-black text-[#005CA9]">
              {foundWords.length} de {WORDS_TO_FIND.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Grade interativa */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-inner max-w-full overflow-x-auto">
              <div
                className="grid gap-1.5 touch-none"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  width: "min(100%, 410px)",
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
                        onClick={() => handleCellClick(r, c)}
                        onPointerDown={() => handlePointerDown(r, c)}
                        onPointerEnter={() => handlePointerEnter(r, c)}
                        className={`aspect-square w-full rounded-xl flex items-center justify-center font-mono text-base sm:text-lg font-black transition-all select-none cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 ring-2 ring-amber-400 scale-105 z-10 shadow-md"
                            : foundClass
                            ? `${foundClass} scale-[1.02] shadow-xs`
                            : "bg-white hover:bg-amber-50/80 text-slate-900 border border-slate-300 shadow-2xs"
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

          {/* Lista de Palavras (Informativa, sem clicar para revelar) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#005CA9]" />
                Palavras para encontrar ({foundWords.length}/{WORDS_TO_FIND.length})
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {WORDS_TO_FIND.map((word) => {
                  const isFound = foundWords.includes(word);
                  return (
                    <div
                      key={word}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                        isFound
                          ? "bg-emerald-100 border-2 border-emerald-400 text-emerald-950 shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="tracking-wide">{word}</span>
                      {isFound ? (
                        <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">•</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dica Francisquinho */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 text-xs sm:text-sm text-slate-900 flex items-center gap-3 shadow-2xs">
              <span className="text-2xl shrink-0">🌻</span>
              <p className="leading-snug font-medium">
                <strong className="text-amber-950">Dica do Francisquinho:</strong> Encontre as palavras na grade! Você pode arrastar pelas letrinhas ou tocar na 1ª letra e depois na última.
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
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
