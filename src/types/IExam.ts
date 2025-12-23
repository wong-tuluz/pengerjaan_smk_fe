export interface Question {
  id: number;
  number: number;
  text: string;
  type: 'single' | 'multiple'; // single = pilihan ganda, multiple = checkbox
  options: Option[];
  selectedAnswer?: string; // untuk single choice (e.g., "A")
  selectedAnswers?: string[]; // untuk multiple choice (e.g., ["A", "C"])
  isAnswered: boolean;
  isMarked?: boolean;
}

export interface Option {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface ExamSession {
  id: number;
  title: string;
  totalQuestions: number;
  answeredCount: number;
  timeRemaining: number; // dalam detik
  studentName: string;
  studentNis: string;
  isAutoSaving: boolean;
  questions: Question[];
  submitted: boolean;
}

export interface ExamState {
  session: ExamSession | null;
  currentQuestionIndex: number;
  lastSavedAt: string | null;
}

export interface SubmitExamPayload {
  examId: number;
  answers: Array<{
    questionId: number;
    type: 'single' | 'multiple';
    selectedAnswer?: string; // untuk single choice
    selectedAnswers?: string[]; // untuk multiple choice
    answeredAt: string;
  }>;
  totalTimeSpent: number;
}

export interface SavedExamState {
  session: ExamSession;
  currentQuestionIndex: number;
  lastSavedAt: string;
  examStartTime: number; // Unix timestamp untuk mencegah time drift
  examDuration: number; // Total durasi ujian dalam detik
}