import React, { useState } from "react";
import { ArrowRight, Eye, HeartHandshake, ExternalLink, Play, Sparkles } from "lucide-react";
import { Francisquinho } from "../Francisquinho";

interface Challenge1Props {
  onContinue: () => void;
}

export const Challenge1Intro: React.FC<Challenge1Props> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header com Francisquinho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="waving" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Etapa 1 de 8 • Sensibilização</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Ponto de Partida: O Curta “Lou” (Pixar) 🎬
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Assista ao vídeo para refletir sobre convivência, empatia e reparação no recreio.
              </p>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <p className="text-sm sm:text-base text-slate-800 font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#005CA9]" />
              Assista à animação diretamente aqui:
            </p>
            <a
              href="https://www.youtube.com/watch?v=I5dkgyfs5pU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-bold hover:underline"
            >
              <span>Abrir no YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-2xl border-2 border-slate-200/90 bg-slate-950 shadow-xl relative aspect-video">
            {!isPlaying ? (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src="https://img.youtube.com/vi/I5dkgyfs5pU/hqdefault.jpg"
                  alt="Curta Lou da Pixar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex flex-col items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-300">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <span className="mt-3 px-4 py-1.5 rounded-full bg-slate-900/90 text-white text-xs sm:text-sm font-bold backdrop-blur-xs border border-white/20">
                    Clique para dar Play no vídeo
                  </span>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/I5dkgyfs5pU?autoplay=1&rel=0&modestbranding=1"
                title="Curta Lou - Pixar"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Pedagogical Text with High Contrast & Readability */}
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50/90 p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-950 font-extrabold text-base sm:text-lg">
            <HeartHandshake className="w-5 h-5 text-amber-600" />
            Um Olhar sobre a Empatia e o Convívio Escolar:
          </div>

          <p className="font-normal text-slate-800">
            Na animação <strong>Lou</strong>, o personagem J.J. começa o dia intimidando os colegas no pátio da escola. Muitas vezes, atitudes grosseiras ou brincadeiras de mau gosto escondem feridas emocionais, solidão ou a sensação de não ser aceito.
          </p>

          <p className="font-normal text-slate-800">
            O criativo personagem <em>Lou</em> nos ensina um caminho surpreendente: ao invés da mera agressão recíproca, ele convida J.J. a <strong>reparar suas atitudes</strong>. Ao devolver os brinquedos e consertar o que quebrou, J.J. experimenta a emoção mais restauradora de todas: o abraço sincero dos colegas e o sentimento de pertencer à turma.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs sm:text-sm font-bold text-center">
            <div className="p-3 rounded-xl bg-white border border-amber-300 text-amber-950 shadow-2xs">
              🤝 Escuta & Respeito
            </div>
            <div className="p-3 rounded-xl bg-white border border-sky-300 text-[#005CA9] shadow-2xs">
              💛 Acolhimento
            </div>
            <div className="p-3 rounded-xl bg-white border border-emerald-300 text-emerald-950 shadow-2xs">
              🌱 Mudança de Atitude
            </div>
            <div className="p-3 rounded-xl bg-white border border-purple-300 text-purple-950 shadow-2xs">
              ✨ Cuidado Mútuo
            </div>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-continuar-desafio-1"
            onClick={onContinue}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>AVANÇAR PARA O QUIZ</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
