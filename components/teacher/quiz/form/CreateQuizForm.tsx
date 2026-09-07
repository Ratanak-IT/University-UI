"use client";

import { toast } from "@/components/shared/Toast";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Send, Loader2 } from "lucide-react";
import { CourseReferenceSidebar } from "./CourseReferenceSidebar";
import { initialQuizFormData, QuizFormData, createEmptyQuestion } from "@/lib/types/createEmptyQuestion";
import { QuizDetailsSection } from "./QuizDetailsSection";
import { ScheduleSidebar } from "./ScheduleSidebar";
import { QuestionsSection } from "./QuestionsSection";
import { Quiz } from "@/lib/types/quiz";

import {
  useCreateTeacherQuizMutation,
  useUpdateTeacherQuizMutation,
  useAssignQuizToClassroomMutation,
  useGetTeacherQuizzesQuery,
  useGetQuizByIdQuery,
} from "@/lib/redux/apiSlice";

export function CreateQuizForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [form, setForm] = useState<QuizFormData>(initialQuizFormData);

  const { data: targetQuiz } = useGetQuizByIdQuery(editId || "", { skip: !editId });

  const [createQuiz, { isLoading: creating }] = useCreateTeacherQuizMutation();
  const [updateQuiz, { isLoading: updating }] = useUpdateTeacherQuizMutation();
  const [assignQuiz, { isLoading: assigning }] = useAssignQuizToClassroomMutation();

  const submitting = creating || updating || assigning;

  useEffect(() => {
    if (!editId || !targetQuiz) return;
    setForm({
      title: targetQuiz.title || "",
      description: targetQuiz.description || "",
      openingDate: targetQuiz.startAt ? targetQuiz.startAt.split("T")[0] : "",
      timeLimitMinutes: String(targetQuiz.durationMinutes || 30),
      courseId: targetQuiz.classroomId || "",
      questions: targetQuiz.questions && targetQuiz.questions.length > 0
        ? targetQuiz.questions.map((q, idx) => {
            const backendType = q.type ?? "MULTIPLE_CHOICE";

            if (backendType === "SHORT_ANSWER") {
              return {
                id: q.questionId || String(idx),
                content: q.questionText || "",
                type: "short_answer" as const,
                points: q.score || 10,
                options: [{ id: "short_1", text: q.correctAnswer || "" }],
                correctOptionId: "short_1",
              };
            }

            const opts = q.options && q.options.length > 0 ? q.options : ["Option A", "Option B"];
            // The server's own index, not a text match against the option
            // list: an option can be reworded after publishing, and a text
            // match would then point at the wrong option or none at all.
            const correctIdx = q.correctOptionIndex ?? 0;

            return {
              id: q.questionId || String(idx),
              content: q.questionText || "",
              type: backendType === "TRUE_FALSE" ? ("true_false" as const) : ("multiple_choice" as const),
              points: q.score || 10,
              options: opts.map((opt, oIdx) => ({
                id: backendType === "TRUE_FALSE" ? (oIdx === 0 ? "true" : "false") : String(oIdx),
                text: opt,
              })),
              correctOptionId:
                backendType === "TRUE_FALSE"
                  ? correctIdx === 0
                    ? "true"
                    : "false"
                  : String(correctIdx),
            };
          })
        : [createEmptyQuestion(0)],
    });
  }, [editId, targetQuiz]);

  function update<K extends keyof QuizFormData>(key: K, value: QuizFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function showToastMsg(msg: string) {
    if (msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("enter") || msg.toLowerCase().includes("select")) {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  function parseErrorMsg(err: any, fallback: string): string {
    console.error("API Error details:", err);
    if (!err) return fallback;
    if (typeof err === "string") return err;
    const data = err.data || err;
    if (typeof data === "string") return data;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.error && typeof data.error === "string") return data.error;
    if (typeof data === "object") {
      try {
        const entries = Object.entries(data).filter(([_, v]) => typeof v === "string");
        if (entries.length > 0) {
          return entries.map(([k, v]) => `${k}: ${v}`).join("; ");
        }
        const str = JSON.stringify(data);
        if (str && str !== "{}" && str !== "[]") return str;
      } catch (e) {}
    }
    if (err.message && typeof err.message === "string") return err.message;
    return fallback;
  }

  /** Frontend's lowercase union -> the backend's `QuestionType` enum. */
  function toBackendType(type: string): "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" {
    if (type === "true_false") return "TRUE_FALSE";
    if (type === "short_answer") return "SHORT_ANSWER";
    return "MULTIPLE_CHOICE";
  }

  function buildPayloadQuestions(questions: any[]) {
    if (!questions || questions.length === 0) {
      return [
        {
          questionText: "Sample Question 1",
          options: ["Option A", "Option B"],
          correctOptionIndex: 0,
          type: "MULTIPLE_CHOICE" as const,
          score: 1.0,
          questionOrder: 1,
        },
      ];
    }
    return questions.map((q, idx) => {
      const qText = (q.content || q.questionText || "").trim();
      const type = toBackendType(q.type);
      const questionText = qText.length > 0 ? qText : `Question ${idx + 1}`;
      const score = Number(q.points) > 0 ? Number(q.points) : 1.0;

      if (type === "SHORT_ANSWER") {
        // The one "option" this question type carries is the answer key
        // itself, per QuestionCard's short-answer editor above.
        const answerKey = (q.options?.[0]?.text || "").trim();
        return {
          questionText,
          options: [],
          correctAnswer: answerKey,
          type,
          score,
          questionOrder: idx + 1,
        };
      }

      const optionTexts = (q.options || [])
        .map((opt: any) => (typeof opt === "string" ? opt : opt?.text || "").trim())
        .filter((t: string) => Boolean(t));
      const validOptions = optionTexts.length > 0 ? optionTexts : ["Option A", "Option B"];

      // The index the teacher actually marked, not a text lookup: sending the
      // position rather than a copy of the label is what keeps a later
      // reword of that option from silently invalidating every submitted
      // answer, since grading now compares index to index.
      let correctIndex = 0;
      if (q.correctOptionId !== undefined && q.options) {
        const idx2 = q.options.findIndex((opt: any) => String(opt.id) === String(q.correctOptionId));
        if (idx2 >= 0 && idx2 < validOptions.length) correctIndex = idx2;
      }

      return {
        questionText,
        options: validOptions,
        correctOptionIndex: correctIndex,
        type,
        score,
        questionOrder: idx + 1,
      };
    });
  }

  async function handleSaveDraft() {
    if (!form.title.trim()) {
      showToastMsg("Please enter a Quiz Title.");
      return;
    }

    try {
      const payloadQuestions = buildPayloadQuestions(form.questions);
      const payload: any = {
        title: form.title.trim(),
        description: form.description || "",
        durationMinutes: Math.max(1, Number(form.timeLimitMinutes) || 30),
        maxAttempts: 1,
      };

      if (form.openingDate) {
        payload.startAt = `${form.openingDate}T00:00:00`;
      }

      if (payloadQuestions) {
        payload.questions = payloadQuestions;
      }

      if (editId) {
        await updateQuiz({ quizId: editId, payload }).unwrap();
        showToastMsg("Quiz updated successfully!");
      } else {
        await createQuiz(payload).unwrap();
        showToastMsg("Quiz saved successfully!");
      }

      setTimeout(() => {
        router.push("/dashboard/teacher/quiz");
      }, 1000);
    } catch (err: any) {
      console.error("Save Draft Error:", err);
      showToastMsg(parseErrorMsg(err, "Failed to save quiz. Please check fields."));
    }
  }

  async function handlePublish() {
    if (!form.title.trim()) {
      showToastMsg("Please enter a Quiz Title.");
      return;
    }

    try {
      const payloadQuestions = buildPayloadQuestions(form.questions);
      const payload: any = {
        title: form.title.trim(),
        description: form.description || "",
        durationMinutes: Math.max(1, Number(form.timeLimitMinutes) || 30),
        maxAttempts: 1,
      };

      if (form.openingDate) {
        payload.startAt = `${form.openingDate}T00:00:00`;
      }

      if (payloadQuestions) {
        payload.questions = payloadQuestions;
      }

      let targetQuizId = editId;

      if (editId) {
        await updateQuiz({ quizId: editId, payload }).unwrap();
      } else {
        const created = await createQuiz(payload).unwrap();
        targetQuizId = created?.quizId || null;
      }

      if (form.courseId && targetQuizId) {
        try {
          // assign-classroom REPLACES the whole release list — when editing a
          // quiz that's already released to other sections, those have to be
          // resent here too, or saving this form silently un-assigns them
          // (and fails outright once any of them has student attempts).
          const existingReleases = (targetQuiz?.classrooms ?? [])
            .filter((c) => c.classroomId !== form.courseId)
            .map((c) => ({
              classroomId: c.classroomId,
              availableFrom: c.availableFrom,
              availableTo: c.availableTo,
            }));
          await assignQuiz({
            quizId: targetQuizId,
            classrooms: [...existingReleases, { classroomId: form.courseId }],
          }).unwrap();
        } catch (assignErr) {
          console.warn("Classroom assign warning:", assignErr);
          showToastMsg(
            "Quiz saved, but assigning it to the classroom failed: " +
              parseErrorMsg(assignErr, "please assign it manually from the quiz list.")
          );
        }
      }

      showToastMsg(editId ? "Quiz updated successfully!" : "Quiz published successfully!");
      setTimeout(() => {
        router.push("/dashboard/teacher/quiz");
      }, 1000);
    } catch (err: any) {
      console.error("Publish Quiz Error:", err);
      showToastMsg(parseErrorMsg(err, "Failed to update quiz. Please check required fields."));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            {editId ? "Edit Quiz" : "Create New Quiz"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {editId ? "Update your assessment parameters, classroom assignment, and questions." : "Configure high-security assessment parameters, classroom assignment, and questions."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Quiz
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handlePublish}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {editId ? "Update & Assign" : "Assign to Class"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6">
          <QuizDetailsSection
            title={form.title}
            onTitleChange={(v) => update("title", v)}
            description={form.description}
            onDescriptionChange={(v) => update("description", v)}
          />

          <QuestionsSection
            questions={form.questions}
            onQuestionsChange={(v) => update("questions", v)}
          />
        </div>

        <div className="w-full space-y-6 lg:max-w-sm">
          <ScheduleSidebar
            openingDate={form.openingDate}
            onOpeningDateChange={(v) => update("openingDate", v)}
            timeLimitMinutes={form.timeLimitMinutes}
            onTimeLimitMinutesChange={(v) => update("timeLimitMinutes", v)}
          />

          <CourseReferenceSidebar
            courseId={form.courseId}
            onCourseIdChange={(v) => update("courseId", v)}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}