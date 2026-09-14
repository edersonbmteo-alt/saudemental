import React, { useState, useEffect } from "react";
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
import { StudentSession } from "./types";
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
  const [view, setView] = useState<"welcome" | "challenge" | "mural">("welcome");
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Challenge responses state for local persistence & resume
  const [quizScore, setQuizScore] = useState("");
  const [quizDetails, setQuizDetails] = useState("");
  const [sevenErrorsMarked, setSevenErrorsMarked] = useState(0);
  const [wordSearchFound, setWordSearchFound] = useState<string[]>([]);
  const [wordsGoodSelected, setWordsGoodSelected] = useState<string[]>([]);
  const [wordsGoodReflection, setWordsGoodReflection] = useState("");
  const [crosswordResult, setCrosswordResult] = useState("");
  const [qualitiesSelected, setQualitiesSelected] = useState<string[]>([]);
  const [qualityRecognizedOwn, setQualityRecognizedOwn] = useState("");
  const [qualityToDevelop, setQualityToDevelop] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  // Check saved session in browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem("santanna_student_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.className) {
          setSession(parsed);
          setCurrentStep(parsed.step || 1);
          if (parsed.step > TOTAL_STEPS) {
            setView("mural");
          } else {
            setView("challenge");
          }
        }
      }
    } catch (e) {
      console.warn("Could not parse saved session", e);
    }
  }, []);

  // Sync session state to storage
  const updateSessionStep = (nextStep: number) => {
    setCurrentStep(nextStep);
    if (session) {
      const updated = { ...session, step: nextStep };
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
      };

      setSession(newSession);
      setCurrentStep(1);
      setView("challenge");
      localStorage.setItem("santanna_student_session", JSON.stringify(newSession));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to save progress to server
  const saveProgress = async (partialData: Record<string, unknown>, nextStep?: number) => {
    if (!session) return;
    const targetStep = nextStep !== undefined ? nextStep : currentStep;

    await api.saveProgress({
      studentId: session.id,
      studentName: session.name,
      studentClass: session.className,
      currentStep: targetStep,
      ...partialData,
    });
  };

  // Step 1: Lou Intro -> Continue
  const handleContinueFrom1 = () => {
    saveProgress({}, 2);
    updateSessionStep(2);
  };

  // Step 2: Quiz -> Continue
  const handleContinueFrom2 = (score: string, details: string) => {
    setQuizScore(score);
    setQuizDetails(details);
    saveProgress({ quizScore: score, quizDetails: details }, 3);
    updateSessionStep(3);
  };

  // Step 3: 7 Erros -> Continue
  const handleContinueFrom3 = (markedCount: number) => {
    setSevenErrorsMarked(markedCount);
    saveProgress({ sevenErrorsMarked: markedCount }, 4);
    updateSessionStep(4);
  };

  // Step 4: Caça-Palavras -> Continue
  const handleContinueFrom4 = (foundWords: string[]) => {
    setWordSearchFound(foundWords);
    saveProgress({ wordSearchFound: foundWords }, 5);
    updateSessionStep(5);
  };

  // Step 5: Palavras que Fazem Bem -> Continue
  const handleContinueFrom5 = (words: string[], reflection: string) => {
    setWordsGoodSelected(words);
    setWordsGoodReflection(reflection);
    saveProgress({ wordsGoodSelected: words, wordsGoodReflection: reflection }, 6);
    updateSessionStep(6);
  };

  // Step 6: Palavras Cruzadas -> Continue
  const handleContinueFrom6 = (resultString: string) => {
    setCrosswordResult(resultString);
    saveProgress({ crosswordResult: resultString }, 7);
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
    saveProgress(
      {
        qualitiesSelected: qualities,
        qualityRecognizedOwn: recognizedOwn,
        qualityToDevelop: toDevelop,
      },
      8
    );
    updateSessionStep(8);
  };

  // Step 8: Mensagem Final -> Post to wall & Complete mission!
  const handleSubmitFinalMessage = async (msg: string) => {
    if (!session) return;
    setIsSubmitting(true);

    try {
      setFinalMessage(msg);

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
      const completedSession = { ...session, step: 9 };
      setSession(completedSession);
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
    setSession(null);
    setCurrentStep(1);
    setView("welcome");
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
            {/* Mission WebQuest Progress Bar */}
            <ProgressBar
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              stepTitles={STEP_TITLES}
            />

            {/* Active Challenge Screen */}
            {currentStep === 1 && (
              <Challenge1Intro onContinue={handleContinueFrom1} />
            )}

            {currentStep === 2 && (
              <Challenge2Quiz
                onBack={() => updateSessionStep(1)}
                onContinue={handleContinueFrom2}
              />
            )}

            {currentStep === 3 && (
              <Challenge3SevenErrors
                onBack={() => updateSessionStep(2)}
                onContinue={handleContinueFrom3}
                initialMarkedCount={sevenErrorsMarked}
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

      {/* Discreet Teacher Modal */}
      <TeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
      />
    </div>
  );
}
