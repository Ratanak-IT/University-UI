import { ClipboardList, type LucideIcon } from "lucide-react";

export type UpcomingItem = {
  title: string;
  due: string;
};

export type FeedItem =
  | {
      type: "activity";
      id: string;
      icon: LucideIcon;
      iconBg: string;
      iconColor: string;
      title: string;
      date: string;
    }
  | {
      type: "post";
      id: string;
      author: string;
      avatar: string;
      date: string;
      paragraphs: string[];
      attachment?: {
        name: string;
        kind: string;
      };
    };

export const classroom = {
  id: "web-development",
  badge: "Grade 12-A · Frontend",
  title: "Web Development",
  semester: "Semester 2",
  students: 32,
  room: "Room 204",
  classCode: "HAJ2ZKPZ",
};

export const tabs = [
  "Stream",
  "Lessons",
  "Assignments",
  "Quizzes",
  "People",
  "Attendance",
  "Grades",
];

export const upcoming: UpcomingItem[] = [];

export const feed: FeedItem[] = [
  {
    type: "activity",
    id: "activity-1",
    icon: ClipboardList,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    title:
      "Dr. Elena Vance posted a new assignment: Cybersecurity Fundamentals Quiz",
    date: "Oct 22",
  },
  {
    type: "post",
    id: "post-1",
    author: "Dr. Elena Vance",
    avatar: "https://i.pravatar.cc/80?img=12",
    date: "Oct 24, 10:33 AM",
    paragraphs: [
      `Welcome to the new semester! I've uploaded the introductory slides for the "Network Protocols" unit. Please review them before Thursday's lecture.`,
      "Remember, our lab sessions will be moved to the West Wing starting next week.",
    ],
    attachment: {
      name: "Intro_to_Networking_v2.pdf",
      kind: "PDF Document",
    },
  },
];