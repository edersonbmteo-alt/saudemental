import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  Award,
} from "lucide-react";
import { QuizQuestion } from "../../types";

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Como podemos identificar com clareza quando uma brincadeira ultrapassou o limite do respeito?",
    context: "Convivência e Sensibilidade no Cotidiano Escolar",
    options: [
      {
        id: "1a",
        text: "Quando a pessoa que fez a piada achou muito engraçado e outros ao redor deram risada.",
        isCorrect: false,
        reflection: "A diversão de quem zomba nunca justifica o sofrimento de quem foi colocado em situação constrangedora."
      },
      {
        id: "1b",
        text: "Quando provoca constrangimento, mágoa, isolamento ou tristeza na pessoa que é o alvo.",
        isCorrect: true,
        reflection: "Exatamente! Uma brincadeira saudável só é boa de verdade quando todos os envolvidos se sentem bem e respeitados."
      },
      {
        id: "1c",
        text: "Somente quando alguém chama a atenção da coordenação ou do professor em sala.",
        isCorrect: false,
        reflection: "O respeito mútuo deve fazer parte da nossa própria consciência, mesmo quando nenhum adulto está olhando."
      },
      {
        id: "1d",
        text: "Se não houver agressão física, brincadeiras pesadas com palavras são sempre inofensivas.",
        isCorrect: false,
        reflection: "Palavras que machucam deixam marcas invisíveis que podem ferir tão profundamente quanto uma dor física."
      }
    ]
  },
  {
    id: 2,
    question: "No convívio do colégio, o que define a verdadeira essência da empatia?",
    context: "Compreensão e Conexão Humana",
    options: [
      {
        id: "2a",
        text: "Tentar convencer os outros de que o nosso modo de pensar é sempre o mais acertado.",
        isCorrect: false,
        reflection: "Empatia não é debate de opiniões, mas sim abrir o coração para compreender a realidade de quem está ao lado."
      },
      {
        id: "2b",
        text: "Considerar o coração e as emoções do outro antes de dizer qualquer palavra ou tomar uma atitude.",
        isCorrect: true,
        reflection: "Perfeito! Colocar-se com delicadeza no lugar do outro transforma a convivência em um ambiente acolhedor e seguro."
      },
      {
        id: "2c",
        text: "Fingir que não vê quando um colega precisa de apoio para evitar conversas desconfortáveis.",
        isCorrect: false,
        reflection: "O silêncio diante do desamparo alheio aumenta o sentimento de abandono de quem está precisando de apoio."
      },
      {
        id: "2d",
        text: "Deixar que cada estudante resolva seus dilemas completamente sozinho.",
        isCorrect: false,
        reflection: "A comunidade escolar se fortalece quando cuidamos uns dos outros com solidariedade franciscana."
      }
    ]
  },
  {
    id: 3,
    question: "Se você notar que uma palavra ou gesto seu causou mágoa em alguém, qual atitude demonstra nobreza de caráter?",
    context: "Maturidade e Responsabilidade Afetiva",
    options: [
      {
        id: "3a",
        text: "Afirmar que o colega é 'sensível demais' e que não aguenta nenhuma brincadeira.",
        isCorrect: false,
        reflection: "Minimizar o sentimento alheio apenas aprofunda a mágoa e impede que tenhamos uma convivência honesta."
      },
      {
        id: "3b",
        text: "Reconhecer o impacto gerado, ouvir com humildade e procurar sinceramente reparar o que aconteceu.",
        isCorrect: true,
        reflection: "Excelente! Reconhecer os erros e pedir desculpas sinceras é sinal de maturidade, coragem e dignidade."
      },
      {
        id: "3c",
        text: "Parar de falar com a pessoa por semanas até que o assunto seja esquecido.",
        isCorrect: false,
        reflection: "O distanciamento sem diálogo não cicatriza as relações e pode deixar uma mágoa aberta."
      },
      {
        id: "3d",
        text: "Dizer que só fez aquilo porque outros colegas pediram ou incentivaram.",
        isCorrect: false,
        reflection: "Ter personalidade é assumir a responsabilidade pelas próprias atitudes em vez de culpar o grupo."
      }
    ]
  },
  {
    id: 4,
    question: "Ao ver um colega sempre afastado ou calado no recreio, qual é o gesto mais acolhedor que podemos ter?",
    context: "Inclusão e Construção de Laços",
    options: [
      {
        id: "4a",
        text: "Aproximar-se com gentileza, puxar assunto, convidá-lo para sentar junto e, se necessário, buscar ajuda de um educador de confiança.",
        isCorrect: true,
        reflection: "Muito bem! Um simples 'Oi, quer sentar aqui com a gente?' tem o poder imenso de transformar o dia de alguém."
      },
      {
        id: "4b",
        text: "Concluir que ele prefere a solidão e nunca tentar incluí-lo nas conversas.",
        isCorrect: false,
        reflection: "Muitas vezes, a pessoa tímida ou triste anseia por uma aproximação, mas tem receio de ser rejeitada."
      },
      {
        id: "4c",
        text: "Fazer piadinhas em voz alta para ver se ele ri e resolve se manifestar.",
        isCorrect: false,
        reflection: "Isso provoca desconforto e vergonha, fazendo com que a pessoa se feche ainda mais."
      },
      {
        id: "4d",
        text: "Comentar com a turma sobre o jeito quieto dele como se fosse um defeito.",
        isCorrect: false,
        reflection: "Rótulos e comentários pelas costas criam muros. Precisamos aprender a construir pontes de amizade."
      }
    ]
  },
  {
    id: 5,
    question: "Por que falar sobre as nossas dores e pedir ajuda é um sinal de força e valorização da vida?",
    context: "Cuidado Emocional e Rede de Esperança",
    options: [
      {
        id: "5a",
        text: "Porque pedir ajuda demonstra fraqueza e incapacidade de lidar com os problemas.",
        isCorrect: false,
        reflection: "Pelo contrário! Reconhecer que precisamos de alguém exige muita lucidez, bravura e amor próprio."
      },
      {
        id: "5b",
        text: "Porque compartilhar sentimentos com pessoas de confiança alivia a carga do coração e nos ajuda a encontrar saídas para os momentos difíceis.",
        isCorrect: true,
        reflection: "Com certeza! Falar sobre o que sentimos nos conecta à esperança e lembra que nenhuma tempestade dura para sempre."
      },
      {
        id: "5c",
        text: "Apenas para transferir nossas tarefas e obrigações para outras pessoas.",
        isCorrect: false,
        reflection: "Buscar apoio nos dá clareza e acolhimento para superarmos os desafios com mais serenidade e suporte."
      },
      {
        id: "5d",
        text: "Porque engolir o sofrimento em silêncio é a melhor forma de não preocupar a família.",
        isCorrect: false,
        reflection: "O silêncio sufoca. Quem nos ama quer estar por perto para nos estender a mão e nos apoiar."
      }
    ]
  },
  {
    id: 6,
    question: "Como podemos praticar a escuta atenta quando um colega decide se abrir e desabafar conosco?",
    context: "A Arte de Escutar com o Coração",
    options: [
      {
        id: "6a",
        text: "Ouvir com atenção e carinho, sem interromper nem julgar, demonstrando que ele não está sozinho.",
        isCorrect: true,
        reflection: "Perfeito! Escutar é oferecer um abrigo seguro: não precisamos ter respostas prontas, basta estar presente de verdade."
      },
      {
        id: "6b",
        text: "Interromper logo no início para dizer que o seu próprio problema é muito mais difícil que o dele.",
        isCorrect: false,
        reflection: "Competir sobre quem sofre mais faz a outra pessoa se sentir diminuída e incompreendida."
      },
      {
        id: "6c",
        text: "Ficar mexendo no celular enquanto a pessoa fala para não criar um clima emotivo.",
        isCorrect: false,
        reflection: "A falta de atenção passa a sensação de desprezo. Olhar nos olhos e prestar atenção é sinal de profundo respeito."
      },
      {
        id: "6d",
        text: "Contar imediatamente o segredo dele para todos os outros colegas no recreio.",
        isCorrect: false,
        reflection: "Trair a confiança alheia quebra laços e fere gravemente quem buscou refúgio e acolhimento."
      }
    ]
  },
  {
    id: 7,
    question: "Nas redes sociais e grupos de mensagens escolares, qual atitude reflete a cultura da paz e empatia?",
    context: "Cidadania Digital e Convivência Respeitosa",
    options: [
      {
        id: "7a",
        text: "Compartilhar figurinhas, memes ou montagens zombando da aparência ou jeito de um colega.",
        isCorrect: false,
        reflection: "O cyberbullying se espalha rápido e causa feridas profundas. A tela do celular não diminui a nossa responsabilidade humana."
      },
      {
        id: "7b",
        text: "Criar grupos secretos para falar mal de quem não foi convidado para o grupo.",
        isCorrect: false,
        reflection: "A exclusão intencional gera sofrimento e destrói o clima fraterno de confiança entre os colegas."
      },
      {
        id: "7c",
        text: "Pensar antes de enviar: perguntar a si mesmo se a mensagem é verdadeira, gentil e necessária, protegendo os colegas de fofocas.",
        isCorrect: true,
        reflection: "Brilhante! Usar a internet para encorajar, elogiar e apoiar transforma o espaço virtual em uma fonte de amizade e bem-estar."
      },
      {
        id: "7d",
        text: "Encaminhar boatos sem verificar para não ficar de fora das novidades da escola.",
        isCorrect: false,
        reflection: "Espalhar fofocas alimenta a discórdia. Quem valoriza a paz interrompe boatos e não participa de difamações."
      }
    ]
  },
  {
    id: 8,
    question: "O que o lema franciscano 'Paz e Bem' nos inspira a cultivar no nosso dia a dia?",
    context: "Espiritualidade e Valores Franciscanos",
    options: [
      {
        id: "8a",
        text: "Buscar vencer todas as discussões a qualquer custo, mesmo magoando as pessoas.",
        isCorrect: false,
        reflection: "A paz verdadeira não nasce de impor nossa vontade, mas do respeito recíproco e da mansidão de coração."
      },
      {
        id: "8b",
        text: "Promover a reconciliação, estender a mão a quem precisa e semear esperança onde houver desânimo.",
        isCorrect: true,
        reflection: "Exatamente! Paz e Bem é um convite diário a sermos instrumentos de concórdia, compaixão e amor ao próximo."
      },
      {
        id: "8c",
        text: "Ajudar apenas quem pode nos retribuir com favores no futuro.",
        isCorrect: false,
        reflection: "A generosidade franciscana é gratuita e desinteressada: fazemos o bem simplesmente porque a vida é sagrada."
      },
      {
        id: "8d",
        text: "Ficar indiferente às dores do próximo para proteger apenas o nosso próprio conforto.",
        isCorrect: false,
        reflection: "A indiferença é o oposto do amor. São Francisco nos ensinou a olhar para cada ser humano como um irmão ou irmã."
      }
    ]
  }
];

interface Challenge2Props {
  onBack: () => void;
  onContinue: (scoreString: string, details: string) => void;
  initialAnswers?: Record<number, string>;
}

export const Challenge2Quiz: React.FC<Challenge2Props> = ({
  onBack,
  onContinue,
  initialAnswers = {},
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(initialAnswers);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionId: string) => {
    if (isSubmitted) return; // Não pode mudar depois de enviar
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const calculateScore = () => {
    let correct = 0;
    QUESTIONS.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      if (opt?.isCorrect) correct++;
    });
    return {
      correct,
      total: QUESTIONS.length,
      percentage: Math.round((correct / QUESTIONS.length) * 100),
      scoreString: `${correct}/${QUESTIONS.length} acertos (${Math.round((correct / QUESTIONS.length) * 100)}%)`,
    };
  };

  const handleSubmitQuiz = () => {
    if (!allAnswered) return;
    setIsSubmitted(true);
  };

  const handleProceed = () => {
    const { scoreString } = calculateScore();
    const details = QUESTIONS.map((q) => {
      const selectedId = selectedAnswers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      return `Q${q.id}: ${opt?.isCorrect ? "Correto" : "Incorreto"} (${opt?.text.slice(0, 35)}...)`;
    }).join(" | ");

    onContinue(scoreString, details);
  };

  const scoreInfo = isSubmitted ? calculateScore() : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-2xl shrink-0 shadow-xs">
              🎯
            </div>
            <div>
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                <span>Etapa 2 de 8</span>
                <span>•</span>
                <span>Desafio dos 8 Enigmas Reflexivos 🧩</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
                Quiz do Conhecimento & Empatia
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Progresso no Quiz:</span>
            <div className="text-sm font-extrabold text-[#005CA9] bg-sky-50 px-3 py-1 rounded-xl border border-sky-200 mt-0.5 shadow-2xs">
              {answeredCount} de {QUESTIONS.length} respondidas
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        {!isSubmitted ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-700 text-xs sm:text-sm leading-relaxed flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Instruções do Quiz:</strong> Selecione a resposta que considerar correta para cada uma das {QUESTIONS.length} questões. <em>Atenção: o gabarito com as respostas certas será revelado somente após você enviar suas respostas, e não será possível alterá-las após o envio.</em>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit']">
                  Gabarito Liberado • {scoreInfo?.scoreString}
                </h3>
                <p className="text-xs text-emerald-800">
                  Respostas enviadas com sucesso e bloqueadas para alteração. Confira abaixo o gabarito e as reflexões pedagógicas.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {scoreInfo?.percentage}%
              </span>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {QUESTIONS.map((q, idx) => {
            const selectedOptId = selectedAnswers[q.id];
            const isAnswered = Boolean(selectedOptId);
            const selectedOpt = q.options.find((o) => o.id === selectedOptId);
            const correctOpt = q.options.find((o) => o.isCorrect);

            return (
              <div
                key={q.id}
                className="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5 sm:p-6 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {q.context}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mt-4">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;

                    let buttonClasses = "bg-white border-slate-200 text-slate-700";
                    let badgeClasses = "border-slate-300 bg-slate-100 text-slate-600";
                    let badgeContent: React.ReactNode = opt.id.slice(-1).toUpperCase();

                    if (!isSubmitted) {
                      // While answering: show neutral selection, no correct/wrong hints!
                      if (isSelected) {
                        buttonClasses = "bg-sky-50 border-[#005CA9] text-slate-900 font-semibold shadow-2xs ring-1 ring-[#005CA9]";
                        badgeClasses = "border-[#005CA9] bg-[#005CA9] text-white";
                        badgeContent = "✓";
                      } else {
                        buttonClasses = "bg-white border-slate-200 hover:border-[#005CA9]/50 hover:bg-slate-50/80 text-slate-700";
                      }
                    } else {
                      // After submission: reveal correct answers and show mistakes!
                      if (opt.isCorrect) {
                        buttonClasses = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs";
                        badgeClasses = "border-emerald-600 bg-emerald-600 text-white";
                        badgeContent = <CheckCircle2 className="w-3.5 h-3.5" />;
                      } else if (isSelected && !opt.isCorrect) {
                        buttonClasses = "bg-rose-50 border-rose-400 text-rose-950 font-medium";
                        badgeClasses = "border-rose-600 bg-rose-600 text-white";
                        badgeContent = <XCircle className="w-3.5 h-3.5" />;
                      } else {
                        buttonClasses = "bg-white/70 border-slate-200 text-slate-400 opacity-60";
                        badgeClasses = "border-slate-200 bg-slate-100 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3 ${
                          isSubmitted ? "cursor-default" : "cursor-pointer"
                        } ${buttonClasses}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${badgeClasses}`}
                        >
                          {badgeContent}
                        </div>
                        <span className="leading-relaxed flex-1">{opt.text}</span>
                        {isSubmitted && opt.isCorrect && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold uppercase tracking-wider shrink-0">
                            Correta
                          </span>
                        )}
                        {isSubmitted && isSelected && !opt.isCorrect && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold uppercase tracking-wider shrink-0">
                            Sua escolha
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Educational Feedback - REVEALED ONLY AFTER CONCLUSION */}
                {isSubmitted && (
                  <div className="mt-4 p-4 rounded-xl border text-xs leading-relaxed bg-emerald-50/70 border-emerald-200 text-emerald-950">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-1 text-emerald-900 text-sm">
                          {selectedOpt?.isCorrect
                            ? "Parabéns! Você acertou:"
                            : "Explicação Pedagógica da Resposta Correta:"}
                        </strong>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {correctOpt?.reflection}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-2"
            onClick={onBack}
            disabled={isSubmitted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLTAR</span>
          </button>

          {!isSubmitted ? (
            <button
              type="button"
              id="btn-enviar-quiz"
              disabled={!allAnswered}
              onClick={handleSubmitQuiz}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm tracking-wide shadow-md shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>CONCLUIR E ENVIAR RESPOSTAS</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-avancar-desafio-3"
              onClick={handleProceed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#005CA9] to-sky-600 hover:from-[#004b8a] hover:to-sky-500 text-white font-extrabold text-sm tracking-wide shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <span>AVANÇAR PARA O JOGO DOS 7 ERROS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
