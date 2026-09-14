import React, { useState } from "react";
import { ArrowLeft, Send, Sparkles, User, Smile } from "lucide-react";
import confetti from "canvas-confetti";

interface Challenge8Props {
  onBack: () => void;
  onSubmitMessage: (message: string) => Promise<void>;
  initialMessage?: string;
  isSubmitting?: boolean;
  studentName?: string;
  studentClass?: string;
}

export const Challenge8Message: React.FC<Challenge8Props> = ({
  onBack,
  onSubmitMessage,
  initialMessage = "",
  isSubmitting = false,
  studentName = "",
  studentClass = "",
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = message.trim();

    if (!cleanMsg || cleanMsg.length < 10) {
      setError("Por favor, escreva uma mensagem com pelo menos 10 caracteres de carinho ou encorajamento.");
      return;
    }

    setError(null);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FBBF24", "#F59E0B", "#005CA9", "#38BDF8", "#10B981"],
      });
    } catch {
      // Ignored if confetti not available
    }

    await onSubmitMessage(cleanMsg);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shrink-0">
              💌
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 8 de 8 • Conclusão da Missão
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Mensagem de Apoio & Esperança
              </h2>
            </div>
          </div>
        </div>

        {/* Prompt description */}
        <div className="mb-6 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            “Escreva uma mensagem de luz e incentivo que possa fazer a diferença no dia de quem estiver passando por um momento delicado.”
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Imagine o que você gostaria de ouvir quando se sente cansado(a) ou inseguro(a). Sua mensagem fará parte do <strong>Mural da Esperança</strong> do Colégio Franciscano Sant’Anna.
          </p>
        </div>

        {/* Author Notice (Non-anonymous as requested) */}
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-slate-700">
          <User className="w-4 h-4 text-[#005CA9] shrink-0" />
          <span>
            <strong>Publicação com sua Autoria:</strong> Sua mensagem será assinada por{" "}
            <strong className="text-[#005CA9]">{studentName || "Estudante Sant’Anna"}</strong>
            {studentClass ? ` (Turma ${studentClass})` : ""}, para inspirar e acolher os colegas no Mural da Esperança!
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              id="input-mensagem-final"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite aqui suas palavras de carinho, apoio fraterno e esperança..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white leading-relaxed shadow-2xs transition-all"
            />
            <div className="absolute bottom-3 right-4 text-xs text-slate-400 font-medium">
              {message.length} caracteres
            </div>
          </div>

          {/* Quick Emojis Palette */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
              <Smile className="w-3.5 h-3.5 text-amber-600" />
              <span>Inserir emojis:</span>
            </span>
            {["🌻", "💛", "✨", "🌟", "😊", "🤗", "🕊️", "☀️", "🤝", "💪", "🌈", "💖", "🙏", "💐", "🎉"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setMessage((prev) => prev + emoji)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-base transition-transform active:scale-125 cursor-pointer shadow-2xs"
                title={`Inserir emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Navigation Actions */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              id="btn-voltar-desafio-8"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VOLTAR</span>
            </button>

            <button
              type="submit"
              id="btn-enviar-mural"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "PUBLICANDO..." : "CONCLUIR MISSÃO E PUBLICAR NO MURAL 🌻"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
