// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { Plus, X, Clock, HelpCircle, Tag, CheckCircle2 } from "lucide-react";

// import QuizFilterBar, { ViewMode } from "./QuizFilterBar";
// import QuizGrid from "./QuizGrid";
// import QuizCardSkeleton from "./QuizCardSkeleton";
// import QuizEmptyState from "./QuizEmptyState";
// import { Quiz, QuizStatus, SortOption } from "@/lib/types/quiz";
// import { deleteQuiz, duplicateQuiz, getQuizzes } from "@/lib/data/quizzes";
// import { useRouter } from "next/navigation";

// type StatusFilter = QuizStatus | "all";

// export default function QuizzesPageContent() {
//   const router = useRouter();
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [status, setStatus] = useState<StatusFilter>("all");
//   const [sort, setSort] = useState<SortOption>("dateModified");
//   const [view, setView] = useState<ViewMode>("grid");

//   const loadQuizzes = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await getQuizzes({ status, sort });
//       setQuizzes(data);
//     } catch (err) {
//       setError("We couldn't load your quizzes. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [status, sort]);

//   useEffect(() => {
//     loadQuizzes();
//   }, [loadQuizzes]);

//   // --- Action handlers: wire these up to your routes / modals ------------
//   const handlePreview = (quiz: Quiz) => {
//     // e.g. router.push(`/quizzes/${quiz.id}/preview`)
//     console.log("Preview quiz:", quiz.id);
//   };

//   const handleEdit = (quiz: Quiz) => {
//     // e.g. router.push(`/quizzes/${quiz.id}/edit`)
//     console.log("Edit quiz:", quiz.id);
//   };

//   const handleCreate = () => {
//   router.push("/dashboard/teacher/quiz/create-quiz");
// };

//   const handleDuplicate = async (quiz: Quiz) => {
//     const optimisticId = crypto.randomUUID();
//     try {
//       const created = await duplicateQuiz(quiz.id);
//       setQuizzes((prev) => [created, ...prev]);
//     } catch (err) {
//       console.error("Failed to duplicate quiz", err);
//     }
//   };

//   const handleDelete = async (quiz: Quiz) => {
//     const previous = quizzes;
//     setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
//     try {
//       await deleteQuiz(quiz.id);
//     } catch (err) {
//       // Roll back on failure
//       setQuizzes(previous);
//       console.error("Failed to delete quiz", err);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
//       <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-primary dark:text-primary">My Quizzes</h1>
//           <p className="mt-1 text-slate-500">
//             Create, manage, and monitor student assessment progress.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleCreate}
//           className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
//         >
//           <Plus size={18} />
//           Create New Quiz
//         </button>
//       </div>

//       <QuizFilterBar
//         status={status}
//         onStatusChange={setStatus}
//         sort={sort}
//         onSortChange={setSort}
//         view={view}
//         onViewChange={setView}
//       />

//       {error && (
//         <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <QuizCardSkeleton key={i} />
//           ))}
//         </div>
//       ) : quizzes.length === 0 ? (
//         <QuizEmptyState onCreate={handleCreate} />
//       ) : (
//         <QuizGrid
//           quizzes={quizzes}
//           onPreview={handlePreview}
//           onEdit={handleEdit}
//           onDuplicate={handleDuplicate}
//           onDelete={handleDelete}
//           onCreate={handleCreate}
//         />
//       )}
//     </div>
"use client";

import { toast } from "@/components/shared/Toast";
import { useEffect, useState, useCallback } from "react";
import { Plus, X, Clock, HelpCircle, Tag, CheckCircle2 } from "lucide-react";

import QuizFilterBar, { ViewMode } from "./QuizFilterBar";
import QuizGrid from "./QuizGrid";
import QuizCardSkeleton from "./QuizCardSkeleton";
import QuizEmptyState from "./QuizEmptyState";
import { Quiz, QuizStatus, SortOption } from "@/lib/types/quiz";
import { deleteQuiz, duplicateQuiz, getClassrooms, getQuizzes } from "@/lib/data/quizzes";
import { useRouter } from "next/navigation";

import {
  useGetTeacherQuizzesQuery,
  useGetQuizByIdQuery,
  useDeleteTeacherQuizMutation,
  useAssignQuizToClassroomMutation,
  useGetTeacherClassroomsQuery,
} from "@/lib/redux/apiSlice";
import ModernSelect from "@/components/shared/ModernSelect";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import QuizResultsModal from "./QuizResultsModal";

type StatusFilter = QuizStatus | "all";
type ClassroomFilter = string | "all";

export default function QuizzesPageContent() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("dateModified");
  const [view, setView] = useState<ViewMode>("grid");
  const [classroom, setClassroom] = useState<ClassroomFilter>("all");
  const [classroomOptions, setClassroomOptions] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { data: realQuizzes = [], isLoading, error: apiError } = useGetTeacherQuizzesQuery();
  const { data: teacherClassrooms = [] } = useGetTeacherClassroomsQuery();

  const [previewQuizId, setPreviewQuizId] = useState<string | null>(null);
  const [assigningQuiz, setAssigningQuiz] = useState<Quiz | null>(null);
  const [targetClassroomId, setTargetClassroomId] = useState<string>("");
  const [pendingDeleteQuiz, setPendingDeleteQuiz] = useState<Quiz | null>(null);
  const [resultsQuiz, setResultsQuiz] = useState<Quiz | null>(null);

  const [deleteQuizMutation] = useDeleteTeacherQuizMutation();
  const [assignQuizMutation, { isLoading: isAssigning }] = useAssignQuizToClassroomMutation();

  const { data: activeQuizDetail } = useGetQuizByIdQuery(previewQuizId || "", {
    skip: !previewQuizId,
  });

  const quizzes: Quiz[] = (() => {
    if (!realQuizzes || realQuizzes.length === 0) return [];
    let mapped: Quiz[] = realQuizzes.map((q) => ({
      id: q.quizId,
      title: q.title,
      description: q.description || "No description provided.",
      status: (q.status?.toLowerCase() as QuizStatus) || "published",
      classroom: q.className || "Classroom",
      questionCount: q.questions?.length || 0,
      durationMinutes: q.durationMinutes || 30,
      updatedAt: q.startAt || new Date().toISOString(),
    }));

    if (status !== "all") {
      mapped = mapped.filter((q) => q.status === status);
    }
    if (classroom !== "all") {
      mapped = mapped.filter((q) => q.classroom === classroom);
    }
    return mapped;
  })();

  const error = apiError ? "Failed to load quizzes from backend." : null;

  useEffect(() => {
    getClassrooms()
      .then(setClassroomOptions)
      .catch((err) => console.error("Failed to load classrooms", err));
  }, []);

  function triggerToast(msg: string) {
    if (msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("select")) {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  const handlePreview = (quiz: Quiz) => {
    setPreviewQuizId(quiz.id);
  };

  const handleViewResults = (quiz: Quiz) => {
    setResultsQuiz(quiz);
  };

  const handleEdit = (quiz: Quiz) => {
    router.push(`/dashboard/teacher/quiz/create-quiz?editId=${quiz.id}`);
  };

  const handleAssign = (quiz: Quiz) => {
    setAssigningQuiz(quiz);
    setTargetClassroomId("");
  };

  const handleConfirmAssign = async () => {
    if (!assigningQuiz || !targetClassroomId) {
      triggerToast("Please select a classroom to assign.");
      return;
    }
    try {
      await assignQuizMutation({
        quizId: assigningQuiz.id,
        classroomId: targetClassroomId,
      }).unwrap();
      triggerToast(`Quiz "${assigningQuiz.title}" assigned successfully!`);
      setAssigningQuiz(null);
    } catch (err: any) {
      triggerToast(err?.data?.message || "Failed to assign quiz to classroom.");
    }
  };

  const handleCreate = () => {
    router.push("/dashboard/teacher/quiz/create-quiz");
  };

  const handleDuplicate = async (quiz: Quiz) => {
    try {
      await duplicateQuiz(quiz.id);
    } catch (err) {
      console.error("Failed to duplicate quiz", err);
    }
  };

  const handleDelete = (quiz: Quiz) => {
    setPendingDeleteQuiz(quiz);
  };

  const confirmDeleteQuiz = async () => {
    if (!pendingDeleteQuiz) return;
    const quiz = pendingDeleteQuiz;
    setPendingDeleteQuiz(null);
    try {
      await deleteQuizMutation(quiz.id).unwrap();
      triggerToast("Quiz deleted successfully!");
    } catch (err: any) {
      triggerToast(err?.data?.message || "Failed to delete quiz.");
    }
  };

  return (
    <div className="px-8 py-8 md:px-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary dark:text-gray-200">My Quizzes</h1>
          <p className="mt-1 text-slate-500">
            Create, manage, and monitor student assessment progress.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          Create New Quiz
        </button>
      </div>

      <QuizFilterBar
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        classroom={classroom}
        onClassroomChange={setClassroom}
        classroomOptions={classroomOptions}
      />

      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <QuizEmptyState onCreate={handleCreate} />
      ) : (
        <QuizGrid
          quizzes={quizzes}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onAssign={handleAssign}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onViewResults={handleViewResults}
          onCreate={handleCreate}
        />
      )}

      {resultsQuiz && (
        <QuizResultsModal
          quizId={resultsQuiz.id}
          quizTitle={resultsQuiz.title}
          onClose={() => setResultsQuiz(null)}
        />
      )}

      {/* Assign to Classroom Modal */}
      {assigningQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div>
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                ASSIGN TO CLASSROOM
              </span>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                {assigningQuiz.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Select a classroom to publish this quiz to students.
              </p>
            </div>

            <div className="space-y-1.5">
              <ModernSelect
                label="Select Classroom"
                placeholder="Select Classroom..."
                value={targetClassroomId}
                onChange={(val) => setTargetClassroomId(val)}
                options={teacherClassrooms.map((c) => ({
                  value: c.classroomId,
                  label: `${c.className} (${c.classCode || "Class"})`,
                }))}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssigningQuiz(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAssigning}
                onClick={handleConfirmAssign}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
              >
                {isAssigning ? "Assigning..." : "Assign Now"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Real Backend Quiz Preview Modal */}
      {previewQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    REAL BACKEND QUIZ PREVIEW
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeQuizDetail?.className || "Classroom"}
                  </span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {activeQuizDetail?.title || "Loading Quiz..."}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreviewQuizId(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <p>{activeQuizDetail?.description || "No description provided."}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Duration: <strong>{activeQuizDetail?.durationMinutes || 30} minutes</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Questions: <strong>{activeQuizDetail?.questions?.length || 0} items</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Status: <strong className="capitalize">{activeQuizDetail?.status || "DRAFT"}</strong>
                  </span>
                </div>
              </div>

              {/* Real Questions List from Backend */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Real Question Items from Database
                </h3>

                {activeQuizDetail?.questions && activeQuizDetail.questions.length > 0 ? (
                  activeQuizDetail.questions.map((q: any, idx: number) => (
                    <div
                      key={q.questionId || idx}
                      className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <span>Question {idx + 1} of {activeQuizDetail.questions?.length}</span>
                        <span>{q.score || 1} Point(s)</span>
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {q.questionText}
                      </p>
                      {q.type === "SHORT_ANSWER" ? (
                        <div className="rounded-xl border border-emerald-600 bg-emerald-50/50 px-4 py-3 text-sm font-medium text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-200">
                          <span className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                            Answer key
                          </span>
                          <p className="mt-0.5">{q.correctAnswer || "—"}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-2">
                          {(q.options || []).map((opt: any, i: number) => {
                            // Compared by position, not text: the option's
                            // wording can change after the quiz is published,
                            // and the index is what actually decides grading.
                            const isCorrect = i === q.correctOptionIndex;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                                  isCorrect
                                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-200"
                                    : "border-slate-200 bg-slate-50/50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                                }`}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
                    No questions added to this quiz yet.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setPreviewQuizId(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteQuiz !== null}
        message={
          pendingDeleteQuiz
            ? `Are you sure you want to delete quiz "${pendingDeleteQuiz.title}"? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDeleteQuiz}
        onCancel={() => setPendingDeleteQuiz(null)}
      />
    </div>
  );
}