import React from "react";
import { ShieldCheck, UserCheck, Sparkles, HeartHandshake } from "lucide-react";
import { StudentSession } from "../types";
import { SantAnnaLogo } from "./SantAnnaLogo";

interface HeaderProps {
  session: StudentSession | null;
  onOpenTeacher: () => void;
  onResetSession?: () => void;
  onGoToMural?: () => void;
  showMuralButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onOpenTeacher,
  onResetSession,
  onGoToMural,
  showMuralButton = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs transition-all">
      {/* Micro top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-[#005CA9] to-amber-400" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Project Branding with Official Logo */}
        <div className="flex items-center gap-3.5">
          <a
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
            title="Colégio Franciscano Sant'Anna"
          >
            <SantAnnaLogo className="h-7 sm:h-8 w-auto" />
          </a>

          <div className="h-7 w-px bg-slate-200/80 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50/90 border border-amber-200/70 text-[11px] font-bold text-amber-800 tracking-wide uppercase shadow-2xs">
                <span className="text-amber-500">🌻</span> Setembro Amarelo
              </span>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-['Outfit'] hidden md:inline">
                Jornada do Acolhimento & Valorização da Vida
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-medium mt-0.5">
              <span>Santa Maria – RS</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Orientação do site: Prof. Ederson Braga Mello</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Session Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-[#005CA9]" />
              <span className="font-bold text-slate-800">{session.name}</span>
              <span className="bg-white px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-700 border border-slate-200 font-mono">
                Turma {session.className}
              </span>
              {onResetSession && (
                <button
                  type="button"
                  onClick={onResetSession}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-1 text-[11px] font-medium cursor-pointer"
                  title="Trocar estudante ou turma"
                >
                  (Sair)
                </button>
              )}
            </div>
          )}

          {showMuralButton && onGoToMural && (
            <button
              type="button"
              id="btn-nav-mural"
              onClick={onGoToMural}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Mural 🌻</span>
            </button>
          )}

          {/* Discreet Teacher Area Button */}
          <button
            type="button"
            id="btn-area-professor"
            onClick={onOpenTeacher}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 hover:text-[#005CA9] text-xs font-semibold transition-all shadow-xs group cursor-pointer"
            title="Acesso exclusivo ao painel pedagógico"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005CA9] transition-colors" />
            <span className="tracking-wide">ÁREA DO PROFESSOR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
