// ─── Centralized Assignment API Service ──────────────────────────────

export {
  useGetSavedAssignmentsQuery,
  useCreateSavedAssignmentMutation,
  useCreateAssignmentForClassroomMutation,
  useAssignAssignmentToClassroomMutation,
  useGetClassroomAssignmentsQuery,
  useGetAssignmentDetailQuery,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
  useSubmitAssignmentMutation,
} from "@/lib/redux/apiSlice";

export interface FileResponse {
  fileId: string;
  fileOriginalName: string;
  /**
   * The backend record field is `previewUrl`, so that is what arrives on the
   * wire. This was declared as `filePreviewUrl` — a name the API never sends —
   * which made every attachment link resolve to `href={undefined}`, so
   * clicking a submitted file did nothing at all.
   */
  previewUrl: string;
}

export interface AssignmentResponse {
  assignmentId: string;
  classroomId: string | null;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  weight: number;
  files: FileResponse[];
  createdAt: string;
  createdBy: string;
}

export interface SubmissionResponse {
  /** Null for a MISSING row — that student has no submission to identify. */
  submissionId: string | null;
  assignmentId: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  /** Presigned MinIO URL. Absent when the student has no avatar. */
  avatarUrl?: string;
  files: FileResponse[];
  submittedAt: string | null;
  /**
   * MISSING means "on the roster, nothing handed in". The endpoint now returns
   * the whole roster rather than submissions alone, so a teacher can see who
   * still owes work.
   */
  status: "SUBMITTED" | "LATE" | "GRADED" | "MISSING";
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
}

