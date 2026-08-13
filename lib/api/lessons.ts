export type LessonStatus = "completed" | "in-progress" | "locked" | "upcoming";

export interface ModuleItem {
  id: string;
  type: "lesson" | "quiz" | "assignment";
  title: string;
  meta: string; // duration, question count, or due date
  status: LessonStatus;
}

export interface LessonDetail {
  id: string;
  title: string;
  courseLabel: string; // "Database Systems 301 • Module 4"
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
  objectives: string[];
  moduleProgress: number; // 0-100
  moduleItems: ModuleItem[];
}

export async function getLessonById(id: string): Promise<LessonDetail> {
  // TODO: replace with real API call
  return {
    id,
    title: "Relational Algebra & The Foundation",
    courseLabel: "Database Systems 301 • Module 4",
    videoUrl: "",
    thumbnailUrl: "/thumbnails/relational-algebra.jpg",
    duration: "42:20",
    description:
      "In this lesson, we explore the mathematical underpinnings of relational databases. Understanding Relational Algebra is crucial for mastering SQL optimization and database design. We will cover the core operators: Selection, Projection, Join, and Set operations.",
    objectives: [
      "Map algebraic expressions to SQL queries",
      "Explain the significance of the Cartesian Product",
      "Identify procedural vs. declarative languages",
      "Prepare for Normalization (1NF, 2NF)",
    ],
    moduleProgress: 45,
    moduleItems: [
      { id: "01", type: "lesson", title: "Introduction", meta: "05:10", status: "completed" },
      { id: "02", type: "lesson", title: "Relational Algebra", meta: "42:20 • In Progress", status: "in-progress" },
      { id: "03", type: "lesson", title: "1NF & 2NF Normalization", meta: "28:45", status: "upcoming" },
      { id: "04", type: "lesson", title: "3NF & BCNF Deep Dive", meta: "35:12", status: "upcoming" },
      { id: "qz", type: "quiz", title: "Module 4: Knowledge Check", meta: "15 Questions", status: "upcoming" },
      { id: "as", type: "assignment", title: "Assignment: Database Schema Design", meta: "Due in 4 days", status: "upcoming" },
      { id: "05", type: "lesson", title: "Summary & Key Takeaways", meta: "08:30", status: "upcoming" },
    ],
  };
}