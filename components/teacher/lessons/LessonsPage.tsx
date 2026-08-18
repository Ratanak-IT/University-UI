"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Send, CheckCircle, Pencil } from "lucide-react";
import LessonsFilterBar from "./LessonsFilterBar";
import LessonCard from "./LessonCard";
import LessonsPagination from "./LessonsPagination";
import { Lesson, LessonFilter, ClassroomFilter } from "@/lib/types/Lesson";
import { fetchSavedLessons, assignSavedLesson, deleteLesson, updateLesson } from "@/lib/api/lesson";
import { fetchTeacherClassrooms } from "@/lib/api/teacher";
import { toast } from "@/components/shared/Toast";

const PAGE_SIZE = 6;

export default function LessonsPage() {
  const [activeFilter, setActiveFilter] = useState<LessonFilter>("all");
  const [classroom, setClassroom] = useState<ClassroomFilter>("all");
  const [page, setPage] = useState(1);
  
  const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Assign Modal State
  const [assigningLessonId, setAssigningLessonId] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Lesson Modal State
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);

  function handleOpenEditLesson(lesson: Lesson) {
    setEditingLesson(lesson);
    setEditTitle(lesson.title || "");
    setEditContent(lesson.description || "");
  }

  async function handleSaveEditLesson() {
    if (!editingLesson || !editTitle.trim()) return;
    setUpdating(true);
    const res = await updateLesson(editingLesson.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
    });
    setUpdating(false);
    if (res) {
      toast.success("Lesson updated successfully!");
      setEditingLesson(null);
      loadData();
    } else {
      toast.error("Failed to update lesson. Please try again.");
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const ok = await deleteLesson(lessonId);
    if (ok) {
      toast.success("Lesson deleted successfully!");
      loadData();
    } else {
      toast.error("Failed to delete lesson. Please try again.");
    }
  }

  async function loadData() {
    setLoading(true);
    try {
      const [saved, classes] = await Promise.all([
        fetchSavedLessons(),
        fetchTeacherClassrooms(),
      ]);

      if (saved) {
        const mapped: Lesson[] = saved.map((l) => ({
          id: l.lessonId,
          title: l.title,
          description: l.content || "",
          date: l.createdAt
            ? new Date(l.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          status: l.classroomId ? "published" : "draft",
          thumbnail: "database",
          classroomId: l.classroomId || undefined,
        }));
        setLessonsList(mapped);
      }
      if (classes) {
        setClassrooms(classes.map(c => ({ id: c.classroomId, name: c.className || "Classroom" })));
      }
    } catch (err) {
      console.error("Error loading lessons:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const classroomOptions = useMemo(() => {
    return classrooms.map(c => c.name).sort();
  }, [classrooms]);

  const filteredLessons = useMemo(() => {
    let result = lessonsList;
    if (activeFilter === "published") {
      result = result.filter((lesson) => lesson.status === "published");
    } else if (activeFilter === "drafts") {
      result = result.filter((lesson) => lesson.status === "draft");
    }

    if (classroom !== "all") {
      const targetClass = classrooms.find(c => c.name === classroom);
      if (targetClass) {
        result = result.filter(lesson => lesson.classroomId === targetClass.id);
      }
    }
    return result;
  }, [lessonsList, activeFilter, classroom, classrooms]);

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visibleLessons = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredLessons.slice(start, start + PAGE_SIZE);
  }, [filteredLessons, safePage]);

  function handleAssignClick(lessonId: string) {
    setAssigningLessonId(lessonId);
    setSelectedClassroomId("");
    setMessage(null);
  }

  async function handleConfirmAssign() {
    if (!assigningLessonId || !selectedClassroomId) return;
    setActionLoading(true);
    setMessage(null);

    const res = await assignSavedLesson(assigningLessonId, selectedClassroomId);
    setActionLoading(false);

    if (res) {
      setMessage({ type: "success", text: "Lesson assigned successfully!" });
      await loadData();
      setTimeout(() => {
        setAssigningLessonId(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: "Failed to assign lesson. Please try again." });
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LessonsFilterBar
        active={activeFilter}
        onChange={(next) => {
          setActiveFilter(next);
          setPage(1);
        }}
        classroom={classroom}
        onClassroomChange={(next) => {
          setClassroom(next);
          setPage(1);
        }}
        classroomOptions={classroomOptions}
        shownCount={filteredLessons.length}
        totalCount={lessonsList.length}
      />

      {visibleLessons.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No lessons match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onAssign={lesson.status === "draft" ? handleAssignClick : undefined}
              onEdit={handleOpenEditLesson}
              onDelete={handleDeleteLesson}
            />
          ))}
        </div>
      )}

      {filteredLessons.length > PAGE_SIZE && (
        <LessonsPagination
          shownStudents={visibleLessons.length}
          totalStudents={filteredLessons.length}
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Pencil className="h-5 w-5 text-indigo-600" />
              Edit Lesson
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update the details of your lesson below.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter lesson title..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Content / Description
                </label>
                <textarea
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Enter lesson content or description..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                disabled={updating}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-55 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditLesson}
                disabled={updating || !editTitle.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-55"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Classroom Modal */}
      {assigningLessonId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Send className="h-5 w-5 text-indigo-600" />
              Assign Lesson to Classroom
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select which classroom you want to assign this lesson template to. A copy of the lesson will be created inside that classroom.
            </p>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3.5 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {message.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="mt-5">
              <label htmlFor="assign-classroom" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Select Classroom
              </label>
              <select
                id="assign-classroom"
                value={selectedClassroomId}
                onChange={(e) => setSelectedClassroomId(e.target.value)}
                disabled={actionLoading || message?.type === "success"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="" disabled>Choose classroom...</option>
                {classrooms.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-850">
              <button
                type="button"
                onClick={() => setAssigningLessonId(null)}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-55 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-850"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                disabled={actionLoading || !selectedClassroomId || message?.type === "success"}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-55"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Confirm Assign"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}