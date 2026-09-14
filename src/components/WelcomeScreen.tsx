import React, { useState } from "react";
import { ArrowRight, Compass, Heart, Shield, Sparkles, Users, BookOpen } from "lucide-react";
import { SantAnnaLogo } from "./SantAnnaLogo";

interface WelcomeScreenProps {
  onStartMission: (name: string, className: string) => Promise<void>;
  loading?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartMission,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedClass = className.trim();

    if (!trimmedName) {
      setError("Por favor, digite seu nome completo para iniciar a jornada.");
      return;
    }
    if (!trimmedClass) {
      setError("Por favor, informe sua turma escolar (ex: 61, 72, 8A, etc.).");
      return;
    }

    setError(null);
    try {
      await onStartMission(trimmedName, trimmedClass);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao iniciar a jornada.";
      setError(msg);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Clean & Modern Intro Container */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
        {/* Subtle Decorative Ambient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        {/* School Logo & Title */}
        <div className="relative text-center max-w-xl mx-auto">
          {/* Institutional School Logo */}
          <div className="mb-5 flex justify-center">
            <div className="px-3 py-1.5 rounded-2xl bg-white border border-slate-100 shadow-xs inline-flex items-center justify-center max-w-full">
              <SantAnnaLogo className="h-7 sm:h-8 w-auto max-w-[240px] sm:max-w-xs" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100/90 via-yellow-100/80 to-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-extrabold tracking-wide uppercase mb-3 shadow-xs">
            <span className="text-base animate-bounce">🌻</span>
            <span>Missão Interativa • Setembro Amarelo</span>
            <span className="text-base">✨</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight leading-tight">
            Jornada da Esperança & Valorização da Vida 🌻
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Seja bem-vindo(a) a esta aventura interativa de escuta, reflexão e amizade! Através de <strong>8 desafios divertidos e dinâmicos</strong>, vamos exercitar a empatia, valorizar quem caminha conosco e espalhar esperança por toda a escola.
          </p>
        </div>

        {/* Feature Highlights: Clean, Modern, Balanced */}
        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-amber-200/80 hover:bg-amber-50/30 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">8 Desafios Dinâmicos</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Vídeo, quiz reflexivo, jogos de atenção e palavras que inspiram.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-sky-200/80 hover:bg-sky-50/30 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-sky-100/80 border border-sky-200/70 flex items-center justify-center text-[#005CA9] shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Acolhimento & Respeito</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Um momento sincero para se conhecer e reconhecer quem está ao lado.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200/80 hover:bg-emerald-50/30 transition-all shadow-2xs group">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Mural Coletivo (Ao Final)</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Desbloqueado ao concluir a 8ª etapa para compartilhar palavras de incentivo.
              </div>
            </div>
          </div>
        </div>

        {/* Identification Form */}
        <form onSubmit={handleSubmit} className="relative mt-8 pt-7 border-t border-slate-100">
          <div className="text-center mb-6">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Identifique-se para Iniciar sua Missão
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Seus dados serão utilizados apenas para o registro pedagógico da atividade pelo professor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div>
              <label
                htmlFor="input-student-name"
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Seu Nome Completo
              </label>
              <input
                id="input-student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gabriel Silva"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label
                htmlFor="input-student-class"
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Sua Turma
              </label>
              <input
                id="input-student-class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: 61, 72, 81..."
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              id="btn-comecar-missao"
              disabled={loading}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-amber-500/20 hover:shadow-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "PREPARANDO MISSÃO..." : "COMEÇAR MISSÃO"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
