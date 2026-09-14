import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, RefreshCw, Sparkles } from "lucide-react";
import { Francisquinho } from "../Francisquinho";

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

// 6 palavras fáceis e conectadas:
// 1. AMIZADE (Horiz: Linha 1, Cols 1..7) - Letra M na col 2, I na col 3, Z na col 4, A na col 5, D na col 6, E na col 7
// 2. AMOR (Vert: Rows 1..4, Col 5) -> A(1,5) [de AMIZADE], M(2,5), O(3,5), R(4,5)
// 3. PAZ (Horiz: Linha 3, Cols 3..5) -> P(3,3), A(3,4), Z(3,5) -- ajustado para cruzar com O(3,5)? Vamos montar uma grade perfeita e testada:
/*
Grade 9x9 (Rows 0..8, Cols 0..8):
1. VIDA (Horizontal, Linha 1, Cols 2..5) -> V(1,2), I(1,3), D(1,4), A(1,5)
2. AMOR (Vertical, Linha 1..4, Col 5) -> A(1,5)[cruza VIDA], M(2,5), O(3,5), R(4,5)
3. ESCUTA (Horizontal, Linha 4, Cols 0..5) -> E(4,0), S(4,1), C(4,2), U(4,3), T(4,4), A(4,5)[cruza com R? Não, cruzar em C ou A]
Vamos traçar exatamente as 6 palavras para que não haja nenhum conflito:

Palavra 1: AMIZADE (Horizontal, Linha 2, Cols 1..7)
(2,1)=A [label 1], (2,2)=M, (2,3)=I, (2,4)=Z, (2,5)=A, (2,6)=D, (2,7)=E

Palavra 2: ABRACO (Vertical, Linhas 2..7, Col 1)
(2,1)=A [cruza AMIZADE], (3,1)=B, (4,1)=R, (5,1)=A, (6,1)=C, (7,1)=O [label 2]

Palavra 3: CARINHO (Horizontal, Linha 6, Cols 1..7)
(6,1)=C [cruza ABRACO], (6,2)=A, (6,3)=R, (6,4)=I, (6,5)=N, (6,6)=H, (6,7)=O [label 3]

Palavra 4: RESPEITO (Vertical, Linhas 0..7, Col 3)
(0,3)=R [label 4], (1,3)=E, (2,3)=I? em AMIZADE (2,3) é 'I'! Espera: R-E-S-P-E-I-T-O tem 'S' na pos 2, não 'I'.

Vamos fazer uma montagem limpa e direta:
*/

const CROSSWORD_CELLS: CellDef[] = [
  // 5. AMOR (Vertical: Linha 0..3, Col 2)
  { r: 0, c: 2, expected: "A", numberLabel: 5 },
  // (1,2) é o M compartilhado com AMIZADE

  // 1. AMIZADE (Horizontal: Linha 1, Cols 1..7)
  { r: 1, c: 1, expected: "A", numberLabel: 1 }, // Também início de 2. APOIO
  { r: 1, c: 2, expected: "M" },
  { r: 1, c: 3, expected: "I" },
  { r: 1, c: 4, expected: "Z" },
  { r: 1, c: 5, expected: "A" },
  { r: 1, c: 6, expected: "D" },
  { r: 1, c: 7, expected: "E", numberLabel: 6 }, // Também início de 6. EMPATIA

  // 2. APOIO (Vertical: Linhas 2..5, Col 1) - inicia em (1,1)
  { r: 2, c: 1, expected: "P" },
  { r: 3, c: 1, expected: "O" },
  { r: 4, c: 1, expected: "I" },
  // (5,1) é o O compartilhado com OUVIR

  // Continuação de 5. AMOR (Vertical: Linhas 2..3, Col 2)
  { r: 2, c: 2, expected: "O" },
  { r: 3, c: 2, expected: "R" },

  // 3. OUVIR (Horizontal: Linha 5, Cols 1..5)
  { r: 5, c: 1, expected: "O", numberLabel: 3 }, // Compartilhado com APOIO
  { r: 5, c: 2, expected: "U" },
  { r: 5, c: 3, expected: "V", numberLabel: 4 }, // Compartilhado com VIDA
  { r: 5, c: 4, expected: "I" },
  { r: 5, c: 5, expected: "R" },

  // 4. VIDA (Vertical: Linhas 6..8, Col 3) - inicia em (5,3)
  { r: 6, c: 3, expected: "I" },
  { r: 7, c: 3, expected: "D" },
  { r: 8, c: 3, expected: "A" },

  // 6. EMPATIA (Vertical: Linhas 2..7, Col 7) - inicia em (1,7)
  { r: 2, c: 7, expected: "M" },
  { r: 3, c: 7, expected: "P" },
  { r: 4, c: 7, expected: "A" },
  { r: 5, c: 7, expected: "T" },
  { r: 6, c: 7, expected: "I" },
  { r: 7, c: 7, expected: "A" },
];

const ROWS = 9;
const COLS = 8;

const CLUES = [
  {
    num: "1",
    direction: "HORIZONTAL",
    word: "AMIZADE",
    clue: "Sentimento de união, lealdade e carinho sincero entre colegas da escola.",
  },
  {
    num: "2",
    direction: "VERTICAL",
    word: "APOIO",
    clue: "Estender a mão e ajudar quem está passando por momentos difíceis.",
  },
  {
    num: "3",
    direction: "HORIZONTAL",
    word: "OUVIR",
    clue: "Prestar atenção com o coração quando alguém precisa desabafar.",
  },
  {
    num: "4",
    direction: "VERTICAL",
    word: "VIDA",
    clue: "O nosso bem mais precioso que celebramos no Setembro Amarelo.",
  },
  {
    num: "5",
    direction: "VERTICAL",
    word: "AMOR",
    clue: "O sentimento nobre e generoso que acolhe e transforma a convivência.",
  },
  {
    num: "6",
    direction: "VERTICAL",
    word: "EMPATIA",
    clue: "A virtude de se colocar no lugar do colega e compreender o que ele sente.",
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

  // Botão de preenchimento automático para os alunos menores
  const handleAutoSolve = () => {
    const solved: Record<string, string> = {};
    CROSSWORD_CELLS.forEach((c) => {
      solved[`${c.r}-${c.c}`] = c.expected;
    });
    setUserLetters(solved);
  };

  let correctCount = 0;
  CROSSWORD_CELLS.forEach((c) => {
    const key = `${c.r}-${c.c}`;
    const userVal = (userLetters[key] || "").toUpperCase();
    if (userVal === c.expected) correctCount++;
  });

  const isAllCorrect = correctCount === CROSSWORD_CELLS.length;

  const handleFinish = () => {
    const resultString = `${correctCount}/${CROSSWORD_CELLS.length} letras certas`;
    onContinue(resultString);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Header com Francisquinho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="waving" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Etapa 6 de 8 • Palavras Cruzadas</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Cruzadinha da Convivência (6 Palavras Fáceis)
              </h2>
              <p className="text-xs text-slate-600">
                Leia as dicas simples e digite uma letrinha em cada quadradinho branco!
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 block">Acertos</span>
            <div className="text-base font-extrabold text-[#005CA9]">
              {correctCount} de {CROSSWORD_CELLS.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Grade da Cruzadinha */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/30 border border-amber-200/70 shadow-inner max-w-full overflow-x-auto">
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
                          className="w-9 h-9 bg-slate-200/40 rounded-lg opacity-30 pointer-events-none"
                        />
                      );
                    }

                    let badgeLabel: string | null = null;
                    if (r === 0 && c === 2) badgeLabel = "5"; // AMOR
                    if (r === 1 && c === 1) badgeLabel = "1,2"; // AMIZADE & APOIO
                    if (r === 1 && c === 7) badgeLabel = "6"; // EMPATIA
                    if (r === 5 && c === 1) badgeLabel = "3"; // OUVIR
                    if (r === 5 && c === 3) badgeLabel = "4"; // VIDA

                    return (
                      <div key={key} className="relative w-9 h-9">
                        {badgeLabel && (
                          <span className="absolute top-0.5 left-1 text-[8px] font-black text-[#005CA9] pointer-events-none z-10">
                            {badgeLabel}
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

              {/* Controles de Apoio */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStatus(!showStatus)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{showStatus ? "Ocultar Dicas" : "Conferir Letras"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserLetters({})}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold cursor-pointer"
                    title="Limpar todas as letras"
                  >
                    <span>Limpar</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoSolve}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold shadow-2xs cursor-pointer"
                  title="Ajuda do Francisquinho"
                >
                  <span>✨ Dica Mágica</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dicas Fáceis com Letras Maiores e mais Legíveis */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#005CA9]" />
                Perguntas & Pistas Fáceis
              </h3>

              <div className="space-y-2">
                {CLUES.map((clue) => (
                  <div
                    key={clue.num}
                    className="p-3 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm leading-relaxed shadow-2xs"
                  >
                    <div className="font-extrabold text-[#005CA9] text-xs sm:text-sm mb-0.5 flex items-center justify-between">
                      <span>{clue.num}. {clue.direction}</span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {clue.word.length} letras
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{clue.clue}</p>
                  </div>
                ))}
              </div>
            </div>

            {isAllCorrect && (
              <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 text-xs sm:text-sm font-extrabold flex items-center gap-2.5 shadow-xs">
                <span className="text-2xl">🎉</span>
                <span>Excelente! Você acertou todas as palavras cruzadas com muito talento!</span>
              </div>
            )}
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
