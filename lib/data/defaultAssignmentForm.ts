// features/assignments/form/data.ts

import { AssignmentFormValues } from "../types/AssignmentFormValues";

export const defaultAssignmentForm: AssignmentFormValues = {
  title: "",
  instructionsHtml: "",
  points: 100,
  dueDate: "",
  dueTime: "",
  attachments: [],
};