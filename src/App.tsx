import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Header } from "./components/Header";
import { ProgressBar } from "./components/ProgressBar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Challenge1Intro } from "./components/challenges/Challenge1Intro";
import { Challenge2Quiz } from "./components/challenges/Challenge2Quiz";
import { Challenge3SevenErrors } from "./components/challenges/Challenge3SevenErrors";
import { Challenge4WordSearch } from "./components/challenges/Challenge4WordSearch";
import { Challenge5GoodWords } from "./components/challenges/Challenge5GoodWords";
import { Challenge6Crossword } from "./components/challenges/Challenge6Crossword";
import { Challenge7Qualities } from "./components/challenges/Challenge7Qualities";
import { Challenge8Message } from "./components/challenges/Challenge8Message";
import { MuralView } from "./components/MuralView";
import { TeacherModal } from "./components/TeacherModal";
import { StudentSession, CircleMarker } from "./types";
import { api } from "./services/api";

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  "Sensibilização (Curta Lou)",
  "Quiz do Conhecimento",
  "Jogo dos 7 Erros",
  "Caça-Palavras da Empatia",
  "Palavras que Fazem Bem",
  "Palavras Cruzadas",
  "Reconheça suas Forças",
  "Mensagem ao Mural",
];

export default function App() {
  const [session, setSession] = useState<StudentSession | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [view, setView] = useState<"welcome" | "challenge" | "mural">("welcome");
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Challenge responses state for local persistence & resume
  const [quizScore, setQuizScore] = useState("");
  const [quizDetails, setQuizDetails] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [sevenErrorsMarked, setSevenErrorsMarked] = useState(0);
  const [sevenErrorsMarkers, setSevenErrorsMarkers] = useState<CircleMarker[]>([]);
  const [wordSearchFound, setWordSearchFound] = useState<string[]>([]);
  const [wordsGoodSelected, setWordsGoodSelected] = useState<string[]>([]);
  const [wordsGoodReflection, setWordsGoodReflection] = useState("");
  const [crosswordResult, setCrosswordResult] = useState("");
  const [crosswordLetters, setCrosswordLetters] = useState<Record<string, string>>({});
  const [qualitiesSelected, setQualitiesSelected] = useState<string[]>([]);
  const [qualityRecognizedOwn, setQualityRecognizedOwn] = useState("");
  const [qualityToDevelop, setQualityToDevelop] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  // Garante que SEMPRE comece no topo da página ao iniciar uma nova etapa ou tela
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentStep, view]);

  // Helper para salvar cache detalhado de respostas no navegador
  const cacheAnswers = (updates: Record<string, unknown>) => {
    try {
      const existing = JSON.parse(localStorage.getItem("santanna_student_answers") || "{}");
      const merged = { ...existing, ...updates };
      localStorage.setItem("santanna_student_answers", JSON.stringify(merged));
    } catch (e) {
      console.warn("Could not cache answers", e);
    }
  };

  // Check saved session and answers in browser
  useEffect(() => {
    try {
      // 1. Restaura sessão do aluno
      const saved = localStorage.getItem("santanna_student_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.className) {
          setSession(parsed);
          const loadedStep = Number(parsed.step || 1);
          const loadedMax = Number(parsed.maxStep || loadedStep);
          setCurrentStep(loadedStep);
          setMaxStepReached(Math.max(loadedMax, loadedStep));
          if (loadedStep > TOTAL_STEPS || parsed.completed) {
            setView("mural");
          } else {
            setView("challenge");
          }
        }
      }

      // 2. Restaura respostas salvas para NUNCA perder nada ao navegar ou clicar no logo
      const savedAnswers = localStorage.getItem("santanna_student_answers");
      if (savedAnswers) {
        const p = JSON.parse(savedAnswers);
        if (p.quizAnswers) setQuizAnswers(p.quizAnswers);
        if (p.quizScore) setQuizScore(p.quizScore);
        if (p.quizDetails) setQuizDetails(p.quizDetails);
        if (typeof p.sevenErrorsMarked === "number") setSevenErrorsMarked(p.sevenErrorsMarked);
        if (Array.isArray(p.sevenErrorsMarkers)) setSevenErrorsMarkers(p.sevenErrorsMarkers);
        if (Array.isArray(p.wordSearchFound)) setWordSearchFound(p.wordSearchFound);
        if (Array.isArray(p.wordsGoodSelected)) setWordsGoodSelected(p.wordsGoodSelected);
        if (p.wordsGoodReflection) setWordsGoodReflection(p.wordsGoodReflection);
        if (p.crosswordResult) setCrosswordResult(p.crosswordResult);
        if (p.crosswordLetters) setCrosswordLetters(p.crosswordLetters);
        if (Array.isArray(p.qualitiesSelected)) setQualitiesSelected(p.qualitiesSelected);
        if (p.qualityRecognizedOwn) setQualityRecognizedOwn(p.qualityRecognizedOwn);
        if (p.qualityToDevelop) setQualityToDevelop(p.qualityToDevelop);
        if (p.finalMessage) setFinalMessage(p.finalMessage);
      }
    } catch (e) {
      console.warn("Could not parse saved session", e);
    }
  }, []);

  // Sync session state to storage (garantindo que maxStep nunca diminui)
  const updateSessionStep = (nextStep: number) => {
    setCurrentStep(nextStep);
    const newMax = Math.max(maxStepReached, nextStep);
    setMaxStepReached(newMax);

    if (session) {
      const updated = { ...session, step: nextStep, maxStep: newMax };
      setSession(updated);
      try {
        localStorage.setItem("santanna_student_session", JSON.stringify(updated));
      } catch (e) {
        console.warn("Error saving session", e);
      }
    }
  };

  // 1. COMEÇAR MISSÃO
  const handleStartMission = async (name: string, className: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.startSession(name, className);
      const studentData = res.student || {
        id: `std_${Date.now()}`,
        studentName: name,
        studentClass: className,
        currentStep: 1,
      };

      const newSession: StudentSession = {
        id: studentData.id,
        name: studentData.studentName,
        className: studentData.studentClass,
        step: 1,
        maxStep: 1,
      };

      setSession(newSession);
      setCurrentStep(1);
      setMaxStepReached(1);
      setView("challenge");
      localStorage.setItem("santanna_student_session", JSON.stringify(newSession));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to save progress to server & Firestore
  const saveProgress = async (partialData: Record<string, unknown>, nextStep?: number) => {
    if (!session) return;
    const targetStep = nextStep !== undefined ? nextStep : currentStep;
    const safeMaxStep = Math.max(maxStepReached, targetStep);

    await api.saveProgress({
      studentId: session.id,
      studentName: session.name,
      studentClass: session.className,
      currentStep: safeMaxStep,
      ...partialData,
    });
  };

  // Step 1: Lou Intro -> Continue
  const handleContinueFrom1 = () => {
    saveProgress({}, Math.max(maxStepReached, 2));
    updateSessionStep(2);
  };

  // Step 2: Quiz -> Continue
  const handleContinueFrom2 = (score: string, details: string, answers?: Record<number, string>) => {
    setQuizScore(score);
    setQuizDetails(details);
    if (answers) {
      setQuizAnswers(answers);
      cacheAnswers({ quizScore: score, quizDetails: details, quizAnswers: answers });
    } else {
      cacheAnswers({ quizScore: score, quizDetails: details });
    }
    saveProgress({ quizScore: score, quizDetails: details }, Math.max(maxStepReached, 3));
    updateSessionStep(3);
  };

  // Step 3: 7 Erros -> Continue
  const handleContinueFrom3 = (markedCount: number, markers?: CircleMarker[]) => {
    setSevenErrorsMarked(markedCount);
    if (markers) {
      setSevenErrorsMarkers(markers);
      cacheAnswers({ sevenErrorsMarked: markedCount, sevenErrorsMarkers: markers });
    } else {
      cacheAnswers({ sevenErrorsMarked: markedCount });
    }
    saveProgress({ sevenErrorsMarked: markedCount }, Math.max(maxStepReached, 4));
    updateSessionStep(4);
  };

  // Step 4: Caça-Palavras -> Continue
  const handleContinueFrom4 = (foundWords: string[]) => {
    setWordSearchFound(foundWords);
    cacheAnswers({ wordSearchFound: foundWords });
    saveProgress({ wordSearchFound: foundWords }, Math.max(maxStepReached, 5));
    updateSessionStep(5);
  };

  // Step 5: Palavras que Fazem Bem -> Continue
  const handleContinueFrom5 = (words: string[], reflection: string) => {
    setWordsGoodSelected(words);
    setWordsGoodReflection(reflection);
    cacheAnswers({ wordsGoodSelected: words, wordsGoodReflection: reflection });
    saveProgress({ wordsGoodSelected: words, wordsGoodReflection: reflection }, Math.max(maxStepReached, 6));
    updateSessionStep(6);
  };

  // Step 6: Palavras Cruzadas -> Continue
  const handleContinueFrom6 = (resultString: string, letters?: Record<string, string>) => {
    setCrosswordResult(resultString);
    if (letters) {
      setCrosswordLetters(letters);
      cacheAnswers({ crosswordResult: resultString, crosswordLetters: letters });
    } else {
      cacheAnswers({ crosswordResult: resultString });
    }
    saveProgress({ crosswordResult: resultString }, Math.max(maxStepReached, 7));
    updateSessionStep(7);
  };

  // Step 7: Qualidades -> Continue
  const handleContinueFrom7 = (
    qualities: string[],
    recognizedOwn: string,
    toDevelop: string
  ) => {
    setQualitiesSelected(qualities);
    setQualityRecognizedOwn(recognizedOwn);
    setQualityToDevelop(toDevelop);
    cacheAnswers({
      qualitiesSelected: qualities,
      qualityRecognizedOwn: recognizedOwn,
      qualityToDevelop: toDevelop,
    });
    saveProgress(
      {
        qualitiesSelected: qualities,
        qualityRecognizedOwn: recognizedOwn,
        qualityToDevelop: toDevelop,
      },
      Math.max(maxStepReached, 8)
    );
    updateSessionStep(8);
  };

  // Step 8: Mensagem Final -> Post to wall & Complete mission!
  const handleSubmitFinalMessage = async (msg: string) => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      setFinalMessage(msg);
      cacheAnswers({ finalMessage: msg });

      // Post message with student author & class to shared mural
      await api.postMessage(msg, session.name, session.className);

      // Save complete progress record for teacher
      await api.saveProgress({
        studentId: session.id,
        studentName: session.name,
        studentClass: session.className,
        currentStep: 8,
        quizScore,
        quizDetails,
        sevenErrorsMarked,
        wordSearchFound,
        wordsGoodSelected,
        wordsGoodReflection,
        crosswordResult,
        qualitiesSelected,
        qualityRecognizedOwn,
        qualityToDevelop,
        finalMessage: msg,
        completed: true,
      });

      // Update session to completed
      const completedSession = { ...session, step: 9, maxStep: 9, completed: true };
      setSession(completedSession);
      setMaxStepReached(9);
      localStorage.setItem("santanna_student_session", JSON.stringify(completedSession));

      // Automatically open 🌻 MURAL DE MENSAGENS as strictly requested!
      setView("mural");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restart for a new student / clean session
  const handleResetSession = () => {
    localStorage.removeItem("santanna_student_session");
    localStorage.removeItem("santanna_student_answers");
    setSession(null);
    setCurrentStep(1);
    setMaxStepReached(1);
    setQuizScore("");
    setQuizDetails("");
    setQuizAnswers({});
    setSevenErrorsMarked(0);
    setSevenErrorsMarkers([]);
    setWordSearchFound([]);
    setWordsGoodSelected([]);
    setWordsGoodReflection("");
    setCrosswordResult("");
    setCrosswordLetters({});
    setQualitiesSelected([]);
    setQualityRecognizedOwn("");
    setQualityToDevelop("");
    setFinalMessage("");
    setView("welcome");
  };

  // Voltar para o início das etapas ao clicar no logo do Colégio Sant'Anna
  // Preserva 100% das etapas, respostas e progresso já alcançado pelo aluno!
  const handleGoToStart = () => {
    if (session) {
      setCurrentStep(1);
      setView("challenge");
    } else {
      setCurrentStep(1);
      setView("welcome");
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-amber-400 selection:text-slate-950 modern-grid-bg">
      {/* Universal Header */}
      <Header
        session={session}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        onResetSession={session ? handleResetSession : undefined}
        onGoToMural={session?.completed || (session?.step && session.step > TOTAL_STEPS) ? () => setView("mural") : undefined}
        showMuralButton={Boolean(session?.completed || (session?.step && session.step > TOTAL_STEPS))}
        onGoToStart={handleGoToStart}
      />

      {/* Main Mission Body */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {view === "welcome" && (
          <WelcomeScreen
            onStartMission={handleStartMission}
            loading={isSubmitting}
          />
        )}

        {view === "challenge" && (
          <>
            {/* Mission WebQuest Progress Bar com Navegação Interativa */}
            <ProgressBar
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              stepTitles={STEP_TITLES}
              maxStepReached={maxStepReached}
              onStepClick={(step) => updateSessionStep(step)}
            />

            {/* Banner amigável quando o aluno está revendo uma etapa anterior */}
            {maxStepReached > currentStep && (
              <div className="w-full max-w-4xl mx-auto px-4 mb-3">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-medium shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Você está revendo a <strong>Etapa {currentStep}</strong>. Todas as suas respostas anteriores continuam 100% salvas!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (maxStepReached > TOTAL_STEPS) {
                        setView("mural");
                      } else {
                        setCurrentStep(maxStepReached);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Retornar para Etapa {Math.min(maxStepReached, TOTAL_STEPS)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Active Challenge Screen */}
            {currentStep === 1 && (
              <Challenge1Intro onContinue={handleContinueFrom1} />
            )}

            {currentStep === 2 && (
              <Challenge2Quiz
                onBack={() => updateSessionStep(1)}
                onContinue={handleContinueFrom2}
                initialAnswers={quizAnswers}
                initialSubmitted={Boolean(quizScore)}
              />
            )}

            {currentStep === 3 && (
              <Challenge3SevenErrors
                onBack={() => updateSessionStep(2)}
                onContinue={handleContinueFrom3}
                initialMarkedCount={sevenErrorsMarked}
                initialMarkers={sevenErrorsMarkers}
              />
            )}

            {currentStep === 4 && (
              <Challenge4WordSearch
                onBack={() => updateSessionStep(3)}
                onContinue={handleContinueFrom4}
                initialFoundWords={wordSearchFound}
              />
            )}

            {currentStep === 5 && (
              <Challenge5GoodWords
                onBack={() => updateSessionStep(4)}
                onContinue={handleContinueFrom5}
                initialSelected={wordsGoodSelected}
                initialReflection={wordsGoodReflection}
              />
            )}

            {currentStep === 6 && (
              <Challenge6Crossword
                onBack={() => updateSessionStep(5)}
                onContinue={handleContinueFrom6}
                initialAnswers={crosswordLetters}
              />
            )}

            {currentStep === 7 && (
              <Challenge7Qualities
                onBack={() => updateSessionStep(6)}
                onContinue={handleContinueFrom7}
                initialSelected={qualitiesSelected}
                initialRecognized={qualityRecognizedOwn}
                initialToDevelop={qualityToDevelop}
              />
            )}

            {currentStep === 8 && (
              <Challenge8Message
                onBack={() => updateSessionStep(7)}
                onSubmitMessage={handleSubmitFinalMessage}
                initialMessage={finalMessage}
                isSubmitting={isSubmitting}
                studentName={session?.name}
                studentClass={session?.className}
              />
            )}
          </>
        )}

        {view === "mural" && (
          <MuralView
            studentName={session?.name}
            studentClass={session?.className}
            onRestartNewStudent={handleResetSession}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full border-t border-slate-200/90 bg-white/80 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>Orientação do site:</span>
            <strong className="text-slate-900 font-bold">Prof. Ederson Braga Mello</strong>
          </div>
          <div className="font-medium text-slate-500 flex items-center gap-1.5">
            <span>MISSÃO SETEMBRO AMARELO 🌻</span>
            <span className="text-slate-300">•</span>
            <span>Colégio Franciscano Sant’Anna • Santa Maria – RS</span>
          </div>
        </div>
      </footer>

      {/* Teacher Dashboard Access Modal */}
      <TeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
      />
    </div>
  );
}
