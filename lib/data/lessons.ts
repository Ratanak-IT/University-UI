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
  },
  {
    id: "lesson-2",
    title: "Network Security Fundamentals",
    description: "Exploring firewall configurations, VPN tunnels, and common…",
    date: "Nov 02,2023",
    status: "published",
    thumbnail: "network",
  },
  {
    id: "lesson-3",
    title: "Data Structures in Java",
    description: "A comprehensive overview of Linked Lists, Binary Trees, and…",
    date: "Nov 15,2023",
    status: "draft",
    thumbnail: "structures",
  },
  {
    id: "lesson-4",
    title: "Business Analytics & Visualization",
    description: "How to transform raw organizational data into…",
    date: "Oct 12,2023",
    status: "published",
    thumbnail: "analytics",
  },
  {
    id: "lesson-5",
    title: "Human-Computer Interaction",
    description: "Studying user interface design principles and cognitive…",
    date: "Nov 18,2023",
    status: "draft",
    thumbnail: "hci",
  },
  {
    id: "lesson-6",
    title: "Algorithm Complexity Analysis",
    description: "Deep dive into Big O notation and time-space tradeoffs in…",
    date: "Sept 30,2023",
    status: "published",
    thumbnail: "algorithms",
  },
];