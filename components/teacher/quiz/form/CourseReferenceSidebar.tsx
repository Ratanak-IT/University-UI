import { useGetTeacherClassroomsQuery } from "@/lib/redux/apiSlice";
import { Link2, Save, Send } from "lucide-react";

interface CourseReferenceSidebarProps {
  courseId: string;
  onCourseIdChange: (value: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  submitting?: boolean;
}

export function CourseReferenceSidebar({
  courseId,
  onCourseIdChange,
  onSaveDraft,
  onPublish,
  submitting = false,
}: CourseReferenceSidebarProps) {
  const { data: classrooms = [] } = useGetTeacherClassroomsQuery();

  return (
    <>
      <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Classroom & Course Reference
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Assign to Classroom
            </label>
            <select
              value={courseId}
              onChange={(e) => onCourseIdChange(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select Classroom...</option>
              {classrooms.map((c) => (
                <option key={c.classroomId} value={c.classroomId}>
                  {c.className} ({c.classCode || "Class"})
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={onSaveDraft}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Quiz
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onPublish}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Assign to Class
        </button>
      </div>
    </>
  );
}