import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  Award,
  Sparkles,
} from "lucide-react";
import { QuizQuestion } from "../../types";
import { Francisquinho } from "../Francisquinho";

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Em uma roda de conversa no recreio, colegas riem do jeito de falar de outro aluno. Como discernir se isso é uma brincadeira aceitável ou desrespeito?",
    context: "Discernimento e Convivência Coletiva",
    options: [
      {
        id: "1a",
        text: "Uma atitude só é brincadeira saudável quando há consentimento espontâneo e todos os envolvidos se sentem bem e respeitados.",
        isCorrect: true,
        reflection: "Exato! A linha divisória do respeito é o bem-estar mútuo. Se causou constrangimento ou tristeza a alguém, deixa de ser brincadeira e vira ofensa."
      },
      {
        id: "1b",
        text: "Se a maioria presente estiver se divertindo e achando engraçado, a situação é considerada uma brincadeira normal da idade.",
        isCorrect: false,
        reflection: "A aprovação da maioria nunca justifica o desconforto ou a humilhação de um colega."
      },
      {
        id: "1c",
        text: "Desde que a intenção de quem falou não tenha sido maldosa, o colega alvo da piada não deveria se importar ou reclamar.",
        isCorrect: false,
        reflection: "Boas intenções não anulam o impacto real das palavras: o respeito exige responsabilidade sobre como nossas falas afetam o outro."
      },
      {
        id: "1d",
        text: "A situação só ultrapassa os limites se houver palavras de baixo calão explícitas ou intervenção direta de um professor.",
        isCorrect: false,
        reflection: "O respeito ético e franciscano independe de vigilância externa e não depende apenas de termos explícitos."
      }
    ]
  },
  {
    id: 2,
    question: "Você percebe que um colega próximo mudou de comportamento: está mais isolado, não lancha com a turma e quase não fala. Qual é a melhor atitude?",
    context: "Sinais de Alerta e Presença Atenta",
    options: [
      {
        id: "2a",
        text: "Afastar-se e não puxar conversa, partindo do princípio de que ele prefere ficar sozinho e qualquer tentativa será invasiva.",
        isCorrect: false,
        reflection: "Muitas vezes o isolamento é um pedido silencioso de acolhimento. A indiferença reforça a sensação de solidão."
      },
      {
        id: "2b",
        text: "Aproximar-se com calma em um momento reservado, dizer com carinho que notou a mudança e colocar-se à disposição para ouvir.",
        isCorrect: true,
        reflection: "Excelente! Mostrar que você percebeu e se importa, sem pressionar nem expor a pessoa, cria uma ponte segura de confiança e afeto."
      },
      {
        id: "2c",
        text: "Pressioná-lo na frente de outros colegas para que explique imediatamente por que está tão diferente ultimamente.",
        isCorrect: false,
        reflection: "Cobranças em público geram vergonha e fazem a pessoa se fechar ainda mais em seu casulo de dor."
      },
      {
        id: "2d",
        text: "Fazer piadas sobre o desânimo dele durante a aula para tentar arrancar um sorriso e forçar uma melhora de humor.",
        isCorrect: false,
        reflection: "Ironizar ou forçar animação desrespeita o ritmo do outro e passa a impressão de que o sofrimento dele é bobagem."
      }
    ]
  },
  {
    id: 3,
    question: "Ao tentar consolar um amigo que está chorando ou desabafando sobre um problema, qual frase costuma ser MENOS acolhedora, mesmo que bem-intencionada?",
    context: "Comunicação Não-Violenta e Acolhimento",
    options: [
      {
        id: "3a",
        text: "'Não precisa ficar assim, isso é bobeira e tem gente passando por situações muito piores no mundo.'",
        isCorrect: true,
        reflection: "Correto! Essa frase desvaloriza o sentimento do amigo. Dizer que a dor é bobagem fecha as portas do diálogo sincero."
      },
      {
        id: "3b",
        text: "'Estou aqui com você. Se quiser falar eu escuto, e se quiser só ficar em silêncio eu fico ao seu lado.'",
        isCorrect: false,
        reflection: "Essa é uma postura admirável! Acolhe sem pressa e respeita o tempo da pessoa."
      },
      {
        id: "3c",
        text: "'Imagino que esteja sendo difícil para você. Como posso te ajudar a se sentir mais calmo agora?'",
        isCorrect: false,
        reflection: "Essa é uma atitude excelente, pois valida os sentimentos e se coloca humildemente a serviço do bem-estar do outro."
      },
      {
        id: "3d",
        text: "'Se você quiser, posso te acompanhar para conversar com um professor, orientador ou seus pais.'",
        isCorrect: false,
        reflection: "Oferecer apoio para buscar ajuda adulta qualificada é uma demonstração sublime de amizade responsável."
      }
    ]
  },
  {
    id: 4,
    question: "Um amigo confidencia que está em sofrimento profundo e pensando em desistir de tudo, exigindo que você prometa segredo absoluto. O que fazer?",
    context: "Responsabilidade Ética e Proteção à Vida",
    options: [
      {
        id: "4a",
        text: "Guardar o segredo a todo custo, pois quebrar a promessa de lealdade seria a pior traição entre amigos íntimos.",
        isCorrect: false,
        reflection: "A vida está SEMPRE acima de qualquer promessa. Carregar esse peso sozinho pode custar a vida de quem amamos."
      },
      {
        id: "4b",
        text: "Expor a situação em grupos de mensagens da escola para que todos os colegas mandem mensagens de apoio ao mesmo tempo.",
        isCorrect: false,
        reflection: "Exposição pública descontrolada quebra a privacidade e pode gerar um impacto traumático ainda maior."
      },
      {
        id: "4c",
        text: "Explicar que se importa muito com a vida dele e procurar com urgência a orientação escolar, professores ou a família dele.",
        isCorrect: true,
        reflection: "Perfeito! A verdadeira amizade protege a vida. Informar adultos preparados e acolhedores é a única atitude segura e responsável."
      },
      {
        id: "4d",
        text: "Concordar em guardar segredo com a condição de que ele prometa tentar melhorar o humor até a próxima semana.",
        isCorrect: false,
        reflection: "Sofrimento emocional grave não se resolve com acordos de prazo ou força de vontade individual sem suporte especializado."
      }
    ]
  },
  {
    id: 5,
    question: "Presenciar um colega sendo repetidamente excluído das atividades e ignorado pela turma sem intervir é considerado uma atitude neutra?",
    context: "Convivência e Solidariedade Franciscana",
    options: [
      {
        id: "5a",
        text: "Sim, pois quem não pratica ativamente a exclusão não tem nenhuma ligação moral com o comportamento dos outros.",
        isCorrect: false,
        reflection: "A convivência é responsabilidade de toda a comunidade escolar. A passividade silenciosa fortalece o isolamento."
      },
      {
        id: "5b",
        text: "Não, pois o silêncio de quem assiste comunica aceitação implícita e deixa o colega vulnerável sem nenhuma rede de apoio.",
        isCorrect: true,
        reflection: "Exatamente! Quem se cala diante da injustiça permite que ela continue. Incluir o colega com um simples convite quebra o ciclo de exclusão."
      },
      {
        id: "5c",
        text: "Sim, desde que a pessoa internamente discorde da atitude dos colegas e sinta compaixão em pensamento.",
        isCorrect: false,
        reflection: "Pensamentos sem gestos concretos de acolhimento não amparam quem está sofrendo na prática."
      },
      {
        id: "5d",
        text: "Apenas se o colega excluído for alguém desconhecido ou com quem você nunca conversou antes.",
        isCorrect: false,
        reflection: "O carisma franciscano ensina a acolher a todos como irmãos, sem distinção de grupo, afinidade ou proximidade prévia."
      }
    ]
  },
  {
    id: 6,
    question: "O que caracteriza a virtude da 'Escuta Ativa' durante um diálogo sincero entre colegas da escola?",
    context: "Habilidades Humanas e Escuta Empática",
    options: [
      {
        id: "6a",
        text: "Focar toda a atenção no outro com o coração, suspendendo julgamentos imediatos e sem ficar pensando na resposta antes da hora.",
        isCorrect: true,
        reflection: "Brilhante! Escutar ativamente é doar presença real: ouvir para compreender o sentimento do outro, e não apenas para rebater ou dar ordens."
      },
      {
        id: "6b",
        text: "Interromper a fala do colega com frequência para contar experiências pessoais semelhantes e demonstrar que também já sofreu.",
        isCorrect: false,
        reflection: "Ficar centralizando a conversa em si mesmo tira o espaço de quem precisava desabafar e ser compreendido."
      },
      {
        id: "6c",
        text: "Ouvir enquanto responde notificações no celular para mostrar que consegue prestar atenção em várias tarefas ao mesmo tempo.",
        isCorrect: false,
        reflection: "Dividir a atenção com telas demonstra desinteresse e transmite a mensagem de que a pessoa falando não é prioridade."
      },
      {
        id: "6d",
        text: "Apressar o colega a encontrar logo uma solução prática para o problema e parar de remoer sentimentos tristes.",
        isCorrect: false,
        reflection: "Oferecer soluções precipitadas impede que a pessoa processe o que sente com acolhimento e tranquilidade."
      }
    ]
  },
  {
    id: 7,
    question: "No ambiente digital (redes sociais, figurinhas e chats de turma), qual é o filtro ético mais seguro antes de compartilhar algo sobre um colega?",
    context: "Cidadania e Paz no Meio Digital",
    options: [
      {
        id: "7a",
        text: "Certificar-se de que a postagem não contém o nome completo da pessoa, mesmo que todos na turma reconheçam a quem se refere.",
        isCorrect: false,
        reflection: "Indiretas e piadas veladas ferem da mesma forma e criam um clima tóxico de insegurança para todos."
      },
      {
        id: "7b",
        text: "Repassar apenas em grupos privados com poucos amigos de confiança onde as mensagens somem após 24 horas.",
        isCorrect: false,
        reflection: "Telas e prints vazam rapidamente; a dignidade humana não depende de prazos de expiração ou configurações de privacidade."
      },
      {
        id: "7c",
        text: "Questionar-se: 'Esse conteúdo edifica a paz, respeita a dignidade do outro e eu gostaria que fizessem o mesmo comigo?'",
        isCorrect: true,
        reflection: "Perfeito! A empatia digital é a regra de ouro: se pode magoar, expor ou diminuir alguém, o melhor clique é o de não compartilhar."
      },
      {
        id: "7d",
        text: "Compartilhar desde que seja uma brincadeira já consagrada e encaminhada por outros estudantes mais velhos.",
        isCorrect: false,
        reflection: "Seguir a manada em atitudes ofensivas reproduz o bullying e enfraquece a nossa própria consciência ética."
      }
    ]
  },
  {
    id: 8,
    question: "Como o valor franciscano do 'Cuidado com a Vida' se traduz concretamente na nossa rotina escolar diária?",
    context: "Valores Franciscanos Sant'Anna",
    options: [
      {
        id: "8a",
        text: "Na valorização irrestrita de cada pessoa, na promoção do diálogo pacífico e na atenção fraterna a quem estiver fragilizado.",
        isCorrect: true,
        reflection: "Maravilhoso! Cuidar da vida ao estilo franciscano é cultivar a fraternidade cotidiana, olhar nos olhos dos colegas e ser instrumento de paz."
      },
      {
        id: "8b",
        text: "Apenas em campanhas oficiais e eventos pontuais do colégio, sem necessidade de aplicação nas conversas corriqueiras.",
        isCorrect: false,
        reflection: "O valor da vida se manifesta nas pequenas atitudes de cada dia: nas palavras que escolhemos, nos gestos de carinho e no acolhimento mútuo."
      },
      {
        id: "8c",
        text: "Na exigência de que todos os estudantes mantenham sempre um sorriso no rosto, mesmo quando estiverem passando por dias difíceis.",
        isCorrect: false,
        reflection: "Cuidar da vida é também acolher a tristeza e as vulnerabilidades humanas com carinho e sem cobranças irreais."
      },
      {
        id: "8d",
        text: "Em competir constantemente para ser o aluno mais elogiado pelos professores em termos de disciplina e comportamento.",
        isCorrect: false,
        reflection: "A fraternidade franciscana não é uma competição; ela nos convida à cooperação sincera e ao amor ao próximo."
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
    if (isSubmitted) return;
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
      <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xl shadow-slate-200/40">
        {/* Title Header with Mascot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <Francisquinho className="w-14 h-auto" pose="holding_heart" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Etapa 2 de 8 • Quiz da Convivência</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Quiz do Conhecimento & Empatia 🎯
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-medium">
                Responda com atenção e reflita sobre o cuidado com as pessoas ao nosso redor.
              </p>
            </div>
          </div>
          
          <div className="text-center sm:text-right bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-2xl shrink-0">
            <span className="text-xs font-bold text-slate-600 block">Progresso no Quiz</span>
            <div className="text-sm sm:text-base font-black text-[#005CA9]">
              {answeredCount} de {QUESTIONS.length} respondidas
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        {!isSubmitted ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-2xs">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">Dica do Francisquinho:</strong>
              Escolha a resposta mais acolhedora e positiva para cada pergunta. Após responder todas, clique no botão amarelo no fim da página para conferir seus acertos e reflexões!
            </div>
          </div>
        ) : (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit'] text-emerald-950">
                  Quiz Concluído com Sucesso! 🌟
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                  Você acertou <strong>{scoreInfo?.scoreString}</strong>. Veja abaixo o gabarito comentado!
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-3xl font-black text-emerald-700 font-mono">
                {scoreInfo?.percentage}%
              </span>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {QUESTIONS.map((q, idx) => {
            const selectedOptId = selectedAnswers[q.id];
            const selectedOpt = q.options.find((o) => o.id === selectedOptId);
            const correctOpt = q.options.find((o) => o.isCorrect);

            return (
              <div
                key={q.id}
                className="rounded-2xl bg-slate-50/80 border border-slate-200 p-5 sm:p-6 transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-200 text-slate-950 border border-amber-300 flex items-center justify-center text-sm font-black shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                      {q.context}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {/* Options with high-contrast text */}
                <div className="space-y-2.5 mt-4">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;

                    let buttonClasses = "bg-white border-slate-300 text-slate-800 hover:border-amber-400 hover:bg-amber-50/30";
                    let badgeClasses = "border-slate-300 bg-slate-100 text-slate-700 font-bold";
                    let badgeContent: React.ReactNode = opt.id.slice(-1).toUpperCase();

                    if (!isSubmitted) {
                      if (isSelected) {
                        buttonClasses = "bg-amber-100/70 border-2 border-amber-500 text-slate-950 font-bold shadow-xs";
                        badgeClasses = "border-amber-500 bg-amber-500 text-slate-950 font-black";
                        badgeContent = "✓";
                      }
                    } else {
                      if (opt.isCorrect) {
                        buttonClasses = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                        badgeClasses = "border-emerald-600 bg-emerald-600 text-white";
                        badgeContent = <CheckCircle2 className="w-4 h-4" />;
                      } else if (isSelected && !opt.isCorrect) {
                        buttonClasses = "bg-rose-50 border-2 border-rose-400 text-rose-950 font-semibold";
                        badgeClasses = "border-rose-600 bg-rose-600 text-white";
                        badgeContent = <XCircle className="w-4 h-4" />;
                      } else {
                        buttonClasses = "bg-white/60 border-slate-200 text-slate-500 opacity-60";
                        badgeClasses = "border-slate-200 bg-slate-100 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base leading-relaxed transition-all duration-150 flex items-start gap-3 ${
                          isSubmitted ? "cursor-default" : "cursor-pointer"
                        } ${buttonClasses}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 text-xs ${badgeClasses}`}
                        >
                          {badgeContent}
                        </div>
                        <span className="flex-1 font-medium">{opt.text}</span>
                        {isSubmitted && opt.isCorrect && (
                          <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-200 text-emerald-950 font-extrabold uppercase tracking-wider shrink-0">
                            Correta
                          </span>
                        )}
                        {isSubmitted && isSelected && !opt.isCorrect && (
                          <span className="text-xs px-2.5 py-1 rounded-md bg-rose-200 text-rose-950 font-extrabold uppercase tracking-wider shrink-0">
                            Sua escolha
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Pedagogical Reflection */}
                {isSubmitted && (
                  <div className="mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-1 text-emerald-950 text-sm">
                          {selectedOpt?.isCorrect
                            ? "✨ Muito bem! Francisquinho explica:"
                            : "💡 Reflexão do Francisquinho sobre essa questão:"}
                        </strong>
                        <p className="text-slate-800 leading-relaxed font-normal">
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

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-voltar-desafio-2"
            onClick={onBack}
            disabled={isSubmitted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>CONCLUIR E ENVIAR RESPOSTAS</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-avancar-desafio-3"
              onClick={handleProceed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#005CA9] to-sky-600 hover:from-[#004b8a] hover:to-sky-500 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-md shadow-sky-600/20 transition-all cursor-pointer"
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
