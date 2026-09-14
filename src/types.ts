export interface StudentSession {
  id: string;
  name: string;
  className: string;
  step: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    reflection: string;
  }[];
}

export interface StudentDataRecord {
  id: string;
  studentName: string;
  studentClass: string;
  currentStep: number;
  quizScore: string;
  quizDetails: string;
  wordSearchFound: string[];
  sevenErrorsMarked: number;
  wordsGoodSelected: string[];
  wordsGoodReflection: string;
  crosswordResult: string;
  qualitiesSelected: string[];
  qualityRecognizedOwn: string;
  qualityToDevelop: string;
  finalMessage: string;
  completed: boolean;
  startedAt: string;
  updatedAt: string;
  lastUpdated?: string;
}

export interface SharedMessage {
  id: string;
  message: string;
  author?: string;
  studentClass?: string;
  timestamp: string;
  likes: number;
  likedBy?: string[];
  editedAt?: string;
}
