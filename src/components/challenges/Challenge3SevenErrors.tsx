import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MousePointer,
  Info,
} from "lucide-react";
import { Francisquinho } from "../Francisquinho";
import sevenErrorsImg from "../../assets/images/seven_errors.jpg";
import { getAssetUrl } from "../../utils/assetPath";

interface Challenge3Props {
  onBack: () => void;
  onContinue: (markedCount: number) => void;
  initialMarkedCount?: number;
}

interface CircleMarker {
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
}

export const Challenge3SevenErrors: React.FC<Challenge3Props> = ({
  onBack,
  onContinue,
  initialMarkedCount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [markers, setMarkers] = useState<CircleMarker[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCircle, setCurrentCircle] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    sevenErrorsImg || getAssetUrl("/seven_errors.jpg")
  );

  // Redesenha os círculos na tela de acordo com o tamanho atual do canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // Desenha todos os círculos marcados
    markers.forEach((m, idx) => {
      const cx = m.xPercent * w;
      const cy = m.yPercent * h;
      const r = Math.max(16, m.radiusPercent * w);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#F59E0B"; // Amber 500
      ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Preenchimento suave
      ctx.fillStyle = "rgba(245, 158, 11, 0.18)";
      ctx.fill();

      // Marcador numérico no topo esquerdo do círculo
      const badgeX = cx - r * 0.7;
      const badgeY = cy - r * 0.7;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#F59E0B";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), badgeX, badgeY);
      ctx.restore();
    });

    // Desenha o círculo dinâmico enquanto o usuário arrasta
    if (currentCircle) {
      const dist = Math.hypot(
        currentCircle.currentX - currentCircle.startX,
        currentCircle.currentY - currentCircle.startY
      );
      const radius = Math.max(18, dist);

      ctx.save();
      ctx.beginPath();
      ctx.arc(currentCircle.startX, currentCircle.startY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#D97706"; // Amber 600
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
      ctx.fill();
      ctx.restore();
    }
  };

  // Sincroniza dimensões do canvas com o container da imagem
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redrawCanvas();
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [markers]);

  useEffect(() => {
    redrawCanvas();
  }, [markers, currentCircle]);

  // Auxiliar de coordenadas relativas ao canvas
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setCurrentCircle({ startX: x, startY: y, currentX: x, currentY: y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentCircle) return;
    const { x, y } = getCoordinates(e);
    setCurrentCircle((prev) => (prev ? { ...prev, currentX: x, currentY: y } : null));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentCircle) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      setCurrentCircle(null);
      return;
    }

    const dist = Math.hypot(
      currentCircle.currentX - currentCircle.startX,
      currentCircle.currentY - currentCircle.startY
    );
    // Se o usuário apenas clicou ou deu um toque rápido, cria um círculo padrão de 24px
    const radius = Math.max(22, dist);

    const newMarker: CircleMarker = {
      xPercent: currentCircle.startX / canvas.width,
      yPercent: currentCircle.startY / canvas.height,
      radiusPercent: radius / canvas.width,
    };

    setMarkers((prev) => [...prev, newMarker]);
    setCurrentCircle(null);
  };

  const handleClear = () => {
    setMarkers([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleFinish = () => {
    onContinue(markers.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header com Francisquinho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="magnifying_glass" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Desafio 3 de 8 • Olhar Atento e Afetuoso</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Jogo dos 7 Erros
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs">
              Marcações: <strong>{markers.length}</strong>
            </span>
          </div>
        </div>

        {/* Instruções do Desafio */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 text-slate-800">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-slate-900 text-base">
              “Observe a imagem com atenção e marque as diferenças que você encontrar.”
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Use o mouse ou o dedo (em telas de toque) para clicar ou arrastar desenhando círculos sobre as diferenças encontradas.
            </p>
          </div>
        </div>

        {/* Barra de Ações */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <MousePointer className="w-3.5 h-3.5 text-amber-600" />
            <span>Clique ou arraste para circular as diferenças</span>
          </div>

          {/* Botão LIMPAR MARCAÇÕES */}
          <button
            type="button"
            id="btn-limpar-marcacoes"
            onClick={handleClear}
            disabled={markers.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>LIMPAR MARCAÇÕES</span>
          </button>
        </div>

        {/* Imagem Interativa e Canvas Stage */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-300 bg-slate-950 shadow-xl select-none touch-none aspect-[1376/768]"
        >
          {/* Imagem Base: Jogo dos 7 Erros */}
          <img
            src={imageSrc}
            alt="Jogo dos 7 Erros - Comparação Setembro Amarelo"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
            onError={() => {
              const fallbackUrls = [
                getAssetUrl("/seven_errors.jpg"),
                getAssetUrl("seven_errors.jpg"),
                "./seven_errors.jpg",
                "seven_errors.jpg",
                "/seven_errors.jpg",
              ];
              const nextUrl = fallbackUrls.find((url) => url && url !== imageSrc);
              if (nextUrl) {
                setImageSrc(nextUrl);
              }
            }}
          />

          {/* Canvas Interativo de Desenho por Cima */}
          <canvas
            ref={canvasRef}
            id="canvas-7-erros"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        </div>

        {/* Aviso de Apoio */}
        <div className="mt-4 text-xs text-slate-500 text-center font-medium">
          Dica: Você pode marcar quantas diferenças encontrar. Não há limite rígido nem pontuação, o foco é sua observação atenta!
        </div>

        {/* Botões de Navegação */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-3"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-3"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm tracking-wide shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>CONTINUAR →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
