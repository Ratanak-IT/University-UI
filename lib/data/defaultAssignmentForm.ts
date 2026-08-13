// features/assignments/form/data.ts

import { AssignmentFormValues, CourseOption, RecipientOption } from "../types/AssignmentFormValues";

// import type { AssignmentFormValues, CourseOption, RecipientOption } from "./types";

export const courseOptions: CourseOption[] = [
  { id: "env-sci", name: "Environmental Science", subtitle: "Primary Course" },
  { id: "biology", name: "Biology II", subtitle: "Secondary Course" },
  { id: "chemistry", name: "Chemistry I", subtitle: "Secondary Course" },
];

export const recipientOptions: RecipientOption[] = [
  { id: "all", label: "All students", subtitle: "24 recipients" },
  { id: "group-a", label: "Group A", subtitle: "12 recipients" },
  { id: "group-b", label: "Group B", subtitle: "12 recipients" },
];

export const defaultAssignmentForm: AssignmentFormValues = {
  title: "",
  instructionsHtml: "",
  courseId: courseOptions[0].id,
  recipientId: recipientOptions[0].id,
  points: 100,
  dueDate: "",
  dueTime: "",
  topic: "",
  checkPlagiarism: false,
  attachments: [],
};