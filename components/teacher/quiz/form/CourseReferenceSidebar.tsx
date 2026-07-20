"use client";

import { COURSES } from "@/lib/types/createEmptyQuestion";
import { Link2 } from "lucide-react";


interface CourseReferenceSidebarProps {
  courseId: string;
  onCourseIdChange: (value: string) => void;
  topicId: string;
  onTopicIdChange: (value: string) => void;
  contributesToFinalGrade: boolean;
  onContributesToFinalGradeChange: (value: boolean) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function CourseReferenceSidebar({
  courseId,
  onCourseIdChange,
  topicId,
  onTopicIdChange,
  contributesToFinalGrade,
  onContributesToFinalGradeChange,
  onSaveDraft,
  onPublish,
}: CourseReferenceSidebarProps) {
  return (
    <>
      <aside className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-foreground" />
          <h2 className="text-sm font-semibold tracking-wide text-foreground">
            COURSE REFERENCE
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-foreground">Associate with Course</label>
            <select
              value={courseId}
              onChange={(e) => onCourseIdChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Course...</option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-foreground">Topic/Module</label>
            <select
              value={topicId}
              onChange={(e) => onTopicIdChange(e.target.value)}
              disabled={!courseId}
              className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {courseId ? "Select topic..." : "Select course first..."}
              </option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={contributesToFinalGrade}
              onChange={(e) => onContributesToFinalGradeChange(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
            />
            Contributes to final grade
          </label>
        </div>
      </aside>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Publish Quiz
        </button>
      </div>
    </>
  );
}