import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, MousePointer, Info, Eye } from "lucide-react";

interface Challenge3Props {
  onBack: () => void;
  onContinue: (markedCount: number) => void;
  initialMarkedCount?: number;
}

interface CircleMarker {
  x: number;
  y: number;
  radius: number;
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
  const [currentCircle, setCurrentCircle] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw saved circles
    markers.forEach((m, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#005CA9"; // Sant'Anna Royal Blue
      ctx.stroke();

      // Soft transparent fill
      ctx.fillStyle = "rgba(0, 92, 169, 0.12)";
      ctx.fill();

      // Small index badge
      ctx.beginPath();
      ctx.arc(m.x - m.radius + 6, m.y - m.radius + 6, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#005CA9";
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), m.x - m.radius + 6, m.y - m.radius + 6);

      ctx.restore();
    });

    // Draw active dragging circle
    if (currentCircle) {
      const radius = Math.max(
        15,
        Math.hypot(
          currentCircle.currentX - currentCircle.startX,
          currentCircle.currentY - currentCircle.startY
        )
      );
      ctx.save();
      ctx.beginPath();
      ctx.arc(currentCircle.startX, currentCircle.startY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#F59E0B";
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fill();
      ctx.restore();
    }
  };

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

    const radius = Math.max(
      18,
      Math.hypot(
        currentCircle.currentX - currentCircle.startX,
        currentCircle.currentY - currentCircle.startY
      )
    );

    setMarkers((prev) => [
      ...prev,
      { x: currentCircle.startX, y: currentCircle.startY, radius },
    ]);
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl shrink-0">
              👀
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Etapa 3 de 8 • Olhar Atento
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Jogo dos 7 Erros: Convivência Escolar
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-50 text-[#005CA9] border border-sky-200">
              Identificadas: <strong>{markers.length}</strong>
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5 text-amber-950">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <p className="font-bold text-slate-900 text-sm sm:text-base">
              “Observe com atenção redobrada a imagem e assinale as diferenças que encontrar.”
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Com o mouse ou na tela sensível ao toque, clique e arraste para circular cada detalhe divergente entre os dois lados da cena.
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <MousePointer className="w-3.5 h-3.5 text-[#005CA9]" />
            <span>Arraste ou clique para circular os detalhes</span>
          </div>

          {/* Action Button: LIMPAR MARCAÇÕES */}
          <button
            type="button"
            id="btn-limpar-marcacoes"
            onClick={handleClear}
            disabled={markers.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>LIMPAR MARCAÇÕES</span>
          </button>
        </div>

        {/* Interactive Image & Canvas Stage */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50 shadow-md select-none touch-none aspect-video"
        >
          <img
            src="/seven_errors.jpg"
            alt="Jogo dos 7 Erros - Setembro Amarelo"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          <canvas
            ref={canvasRef}
            id="canvas-7-erros"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center font-medium">
          Dica pedagógica: O foco desta dinâmica é desenvolver nossa atenção aos detalhes e às sutilezas das atitudes de convivência.
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-3"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          <button
            type="button"
            id="btn-continuar-desafio-3"
            onClick={() => onContinue(markers.length)}
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
