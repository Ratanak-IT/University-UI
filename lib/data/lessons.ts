import { Lesson } from "../types/Lesson";

/**
 * Swap this out for data fetched from your API / database, e.g.:
 *
 *   const lessons = await getLessons({ page, filter, sort });
 */
export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Introduction to Database Normalization",
    description: "Learn the fundamental rules of 1NF, 2NF, and 3NF to ensure…",
    date: "Oct 24,2023",
    status: "published",
    thumbnail: "database",

    courseLabel: "Database Systems 301 • Module 1",
    videoUrl: "",
    duration: "38:15",
    objectives: [
      "Explain redundancy and update anomalies",
      "Apply 1NF, 2NF, and 3NF to a sample schema",
      "Identify partial and transitive dependencies",
      "Decide when denormalization is acceptable",
    ],
    moduleProgress: 20,
    moduleItems: [
      { id: "01", type: "lesson", title: "Why Normalize?", meta: "08:40", status: "completed" },
      { id: "02", type: "lesson", title: "Introduction to Database Normalization", meta: "38:15 • In Progress", status: "in-progress" },
      { id: "03", type: "lesson", title: "Denormalization Trade-offs", meta: "22:10", status: "upcoming" },
      { id: "qz", type: "quiz", title: "Module 1: Knowledge Check", meta: "10 Questions", status: "upcoming" },
    ],
  },
  {
    id: "lesson-2",
    title: "Network Security Fundamentals",
    description: "Exploring firewall configurations, VPN tunnels, and common…",
    date: "Nov 02,2023",
    status: "published",
    thumbnail: "network",

    courseLabel: "Network Security 210 • Module 2",
    videoUrl: "",
    duration: "45:30",
    objectives: [
      "Configure basic firewall rules",
      "Explain how VPN tunnels protect traffic",
      "Recognize common attack vectors",
      "Apply defense-in-depth principles",
    ],
    moduleProgress: 60,
    moduleItems: [
      { id: "01", type: "lesson", title: "Threat Landscape Overview", meta: "12:05", status: "completed" },
      { id: "02", type: "lesson", title: "Network Security Fundamentals", meta: "45:30 • In Progress", status: "in-progress" },
      { id: "as", type: "assignment", title: "Assignment: Firewall Rule Design", meta: "Due in 6 days", status: "upcoming" },
    ],
  },
  {
    id: "lesson-3",
    title: "Data Structures in Java",
    description: "A comprehensive overview of Linked Lists, Binary Trees, and…",
    date: "Nov 15,2023",
    status: "draft",
    thumbnail: "structures",

    courseLabel: "Data Structures 220 • Module 3",
    videoUrl: "",
    duration: "50:00",
    objectives: [
      "Implement singly and doubly linked lists",
      "Traverse binary trees (in/pre/post-order)",
      "Compare array-based vs. node-based structures",
      "Analyze basic time complexity trade-offs",
    ],
    moduleProgress: 0,
    moduleItems: [
      { id: "01", type: "lesson", title: "Linked Lists", meta: "18:20", status: "upcoming" },
      { id: "02", type: "lesson", title: "Data Structures in Java", meta: "50:00", status: "upcoming" },
      { id: "03", type: "lesson", title: "Binary Trees", meta: "24:45", status: "upcoming" },
    ],
  },
  {
    id: "lesson-4",
    title: "Business Analytics & Visualization",
    description: "How to transform raw organizational data into…",
    date: "Oct 12,2023",
    status: "published",
    thumbnail: "analytics",

    courseLabel: "Business Analytics 150 • Module 2",
    videoUrl: "",
    duration: "33:50",
    objectives: [
      "Choose the right chart for a dataset",
      "Build a basic executive dashboard",
      "Avoid common visualization pitfalls",
      "Tell a clear story with data",
    ],
    moduleProgress: 100,
    moduleItems: [
      { id: "01", type: "lesson", title: "Data Storytelling Basics", meta: "15:00", status: "completed" },
      { id: "02", type: "lesson", title: "Business Analytics & Visualization", meta: "33:50", status: "completed" },
      { id: "qz", type: "quiz", title: "Module 2: Knowledge Check", meta: "12 Questions", status: "completed" },
    ],
  },
  {
    id: "lesson-5",
    title: "Human-Computer Interaction",
    description: "Studying user interface design principles and cognitive…",
    date: "Nov 18,2023",
    status: "draft",
    thumbnail: "hci",

    courseLabel: "Human-Computer Interaction 305 • Module 1",
    videoUrl: "",
    duration: "29:10",
    objectives: [
      "Apply Nielsen's usability heuristics",
      "Explain cognitive load in interface design",
      "Critique an interface for accessibility issues",
      "Prototype a low-fidelity wireframe",
    ],
    moduleProgress: 0,
    moduleItems: [
      { id: "01", type: "lesson", title: "Human-Computer Interaction", meta: "29:10", status: "upcoming" },
      { id: "02", type: "lesson", title: "Usability Heuristics", meta: "20:00", status: "upcoming" },
    ],
  },
  {
    id: "lesson-6",
    title: "Algorithm Complexity Analysis",
    description: "Deep dive into Big O notation and time-space tradeoffs in…",
    date: "Sept 30,2023",
    status: "published",
    thumbnail: "algorithms",

    courseLabel: "Algorithms 240 • Module 3",
    videoUrl: "",
    duration: "41:25",
    objectives: [
      "Derive Big O for common algorithms",
      "Compare time vs. space trade-offs",
      "Analyze best, average, and worst case",
      "Apply complexity analysis to real code",
    ],
    moduleProgress: 80,
    moduleItems: [
      { id: "01", type: "lesson", title: "Big O Notation", meta: "16:30", status: "completed" },
      { id: "02", type: "lesson", title: "Algorithm Complexity Analysis", meta: "41:25 • In Progress", status: "in-progress" },
      { id: "05", type: "lesson", title: "Summary & Key Takeaways", meta: "09:15", status: "upcoming" },
    ],
  },
];