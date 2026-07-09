export type LessonStatus = "published" | "draft";

/** Visual treatment for a card's thumbnail — swap for a real image later. */
export type ThumbnailKind =
  | "database"
  | "network"
  | "structures"
  | "analytics"
  | "hci"
  | "algorithms";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  date: string;
  status: LessonStatus;
  thumbnail: ThumbnailKind;
}

export type LessonFilter = "all" | "published" | "drafts";