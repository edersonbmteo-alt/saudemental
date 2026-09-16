import React from "react";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  maxStepReached?: number;
  onStepClick?: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  maxStepReached = currentStep,
  onStepClick,
}) => {
  const percentage = Math.round((Math.max(currentStep, maxStepReached) / totalSteps) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 mb-4">
      {/* Top indicator with FULL STEP NAME prominent */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
            Etapa {currentStep} de {totalSteps}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            {stepTitles[currentStep - 1] || ""}
          </span>
        </div>
        <div className="text-xs font-extrabold font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          {percentage}% Concluído
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 transition-all duration-500 ease-out rounded-full shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Dots with Full Titles for Steps */}
      <div className="flex justify-between items-start mt-3 px-1">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isUnlocked = stepNum <= maxStepReached;
          const canClick = isUnlocked && !isCurrent && Boolean(onStepClick);
          const fullTitle = stepTitles[i] || `Etapa ${stepNum}`;

          return (
            <button
              key={stepNum}
              type="button"
              disabled={!canClick}
              onClick={() => canClick && onStepClick?.(stepNum)}
              className={`flex flex-col items-center group relative max-w-[85px] transition-transform ${
                canClick
                  ? "cursor-pointer hover:scale-105 active:scale-95"
                  : isCurrent
                  ? "cursor-default"
                  : "cursor-not-allowed opacity-50"
              }`}
              title={
                canClick
                  ? `Ir para Etapa ${stepNum}: ${fullTitle}`
                  : `Etapa ${stepNum}: ${fullTitle}`
              }
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isDone
                    ? "bg-[#005CA9] text-white shadow-xs group-hover:ring-2 group-hover:ring-sky-300"
                    : isCurrent
                    ? "bg-amber-400 text-slate-950 font-extrabold ring-4 ring-amber-200 scale-110 shadow-sm"
                    : isUnlocked
                    ? "bg-amber-100 text-amber-900 border border-amber-300 group-hover:bg-amber-200"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 hidden lg:block text-center leading-tight transition-colors ${
                  isCurrent
                    ? "text-slate-900 font-bold"
                    : isDone
                    ? "text-[#005CA9]"
                    : isUnlocked
                    ? "text-amber-800"
                    : "text-slate-400"
                }`}
              >
                {fullTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
