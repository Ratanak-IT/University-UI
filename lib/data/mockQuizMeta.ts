import { QuizMeta, QuizQuestion } from "../types/QuizAnswerOption";


export const mockQuizMeta: QuizMeta = {
  id: "quiz-advanced-threat-analysis",
  title: "Advanced Threat Analysis",
  description: "Simulating student environment for quality assurance.",
  courseName: "Cybersecurity Essentials",
  totalQuestions: 25,
  durationSeconds: 60 * 60,
};

const firstQuestion: QuizQuestion = {
  id: "q-1",
  index: 1,
  type: "multiple_choice",
  content: "What is a SQL injection attack and which layer of the OSI model does it primarily target?",
  options: [
    {
      id: "q-1-a",
      label: "A",
      text: "An exploit used to manipulate a back-end database by injecting malicious code into input fields; targets the Application Layer.",
    },
    {
      id: "q-1-b",
      label: "B",
      text: "A physical layer breach where hardware is tampered with to extract data packets; targets the Physical Layer.",
    },
    {
      id: "q-1-c",
      label: "C",
      text: "A method of flooding the network with excessive SYN requests to crash the server; targets the Transport Layer.",
    },
    {
      id: "q-1-d",
      label: "D",
      text: "A spoofing technique used to intercept wireless communication between two devices; targets the Data Link Layer.",
    },
  ],
};

// Remaining questions are placeholders — swap this whole file out for a real
// fetch from your quiz-content endpoint once it exists.
function makePlaceholderQuestion(index: number): QuizQuestion {
  const labels = ["A", "B", "C", "D"];
  return {
    id: `q-${index}`,
    index,
    type: "multiple_choice",
    content: `Placeholder question ${index} content goes here.`,
    options: labels.map((label, i) => ({
      id: `q-${index}-${label.toLowerCase()}`,
      label,
      text: `Placeholder option ${label}`,
    })),
  };
}

export const mockQuestions: QuizQuestion[] = [
  firstQuestion,
  ...Array.from({ length: 24 }, (_, i) => makePlaceholderQuestion(i + 2)),
];