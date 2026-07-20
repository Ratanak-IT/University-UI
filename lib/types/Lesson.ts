// export type LessonStatus = "published" | "draft";

// /** Visual treatment for a card's thumbnail — swap for a real image later. */
// export type ThumbnailKind =
//   | "database"
//   | "network"
//   | "structures"
//   | "analytics"
//   | "hci"
//   | "algorithms";

// export interface Lesson {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   status: LessonStatus;
//   thumbnail: ThumbnailKind;
  
// }

// export type LessonFilter = "all" | "published" | "drafts";

export type LessonStatus = "published" | "draft";

/** Visual treatment for a card's thumbnail — swap for a real image later. */
export type ThumbnailKind =
  | "database"
  | "network"
  | "structures"
  | "analytics"
  | "hci"
  | "algorithms";

export type ModuleItemType = "lesson" | "quiz" | "assignment";
export type ModuleItemStatus = "completed" | "in-progress" | "upcoming";

export interface ModuleItem {
  id: string;
  type: ModuleItemType;
  title: string;
  meta: string;
  status: ModuleItemStatus;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  date: string;
  status: LessonStatus;
  thumbnail: ThumbnailKind;

  courseLabel: string; // e.g. "Database Systems 301 • Module 1"
  videoUrl: string;
  duration: string;
  objectives: string[];
  moduleProgress: number;
  moduleItems: ModuleItem[];
}

export type LessonFilter = "all" | "published" | "drafts";
export type ClassroomFilter = string | "all";