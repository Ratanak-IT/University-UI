export type IconKind = "assignment" | "slides" | "question" | "chart" | "alert";

export interface AssignmentMeta {
  label: string;
  variant: "due" | "overdue" | "none";
}

export interface AssignmentItem {
  id: string;
  title: string;
  postedDate: string;
  icon: IconKind;
  /** Right-hand meta: a due date, a status label, or omitted for "—" */
  meta?: AssignmentMeta;
}

export interface AssignmentGroup {
  id: string;
  title: string;
  items: AssignmentItem[];
}