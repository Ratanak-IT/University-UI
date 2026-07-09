import { Quiz, QuizStatus, SortOption } from "./quiz";

// ---------------------------------------------------------------------------
// This file is the ONLY place that should know about your backend.
// Swap the bodies of these functions for real `fetch` calls to your API
// and nothing in the components needs to change.
// ---------------------------------------------------------------------------

const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Advanced Threat Analysis",
    description:
      "In-depth assessment covering modern cybersecurity threats and mitigation strategies.",
    status: "published",
    questionCount: 25,
    durationMinutes: 60,
    updatedAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Database Fundamentals",
    description:
      "SQL basics, normalization principles, and relational database management concepts.",
    status: "draft",
    questionCount: 15,
    durationMinutes: 30,
    updatedAt: "2025-02-08T10:00:00Z",
  },
  {
    id: "3",
    title: "Network Security Quiz",
    description:
      "Mid-term assessment focusing on firewall configurations, VPN protocols, and more.",
    status: "scheduled",
    questionCount: 40,
    durationMinutes: 90,
    updatedAt: "2025-02-12T10:00:00Z",
  },
  {
    id: "4",
    title: "Cloud Architecture 101",
    description:
      "Assessing knowledge of AWS, Azure, and GCP basic services and cloud-native design.",
    status: "published",
    questionCount: 20,
    durationMinutes: 45,
    updatedAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "5",
    title: "Ethical Hacking Lab Quiz",
    description:
      "Hands-on theory assessment for penetration testing methodologies and tools.",
    status: "draft",
    questionCount: 10,
    durationMinutes: 20,
    updatedAt: "2025-02-01T10:00:00Z",
  },
];

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface GetQuizzesParams {
  status?: QuizStatus | "all";
  sort?: SortOption;
  query?: string;
}

export async function getQuizzes(params: GetQuizzesParams = {}): Promise<Quiz[]> {
  // Replace with:
  // const res = await fetch(`/api/quizzes?${new URLSearchParams(params as any)}`);
  // if (!res.ok) throw new Error("Failed to load quizzes");
  // return res.json();

  let results = [...MOCK_QUIZZES];

  if (params.status && params.status !== "all") {
    results = results.filter((q) => q.status === params.status);
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q)
    );
  }

  results.sort((a, b) => {
    if (params.sort === "title") return a.title.localeCompare(b.title);
    if (params.sort === "status") return a.status.localeCompare(b.status);
    // default: dateModified, newest first
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return delay(results);
}

export async function deleteQuiz(id: string): Promise<void> {
  // Replace with: await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
  return delay(undefined, 200);
}

export async function duplicateQuiz(id: string): Promise<Quiz> {
  // Replace with a real POST to your duplicate endpoint.
  const source = MOCK_QUIZZES.find((q) => q.id === id);
  if (!source) throw new Error("Quiz not found");
  return delay({ ...source, id: crypto.randomUUID(), title: `${source.title} (Copy)` });
}
