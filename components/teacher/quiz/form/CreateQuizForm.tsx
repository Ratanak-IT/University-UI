"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/lib/redux/apiSlice";

export function CreateQuizForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [form, setForm] = useState<QuizFormData>(initialQuizFormData);
  const [toast, setToast] = useState<string | null>(null);

  const { data: quizzes = [] } = useGetTeacherQuizzesQuery(undefined, { skip: !editId });

  const [createQuiz, { isLoading: creating }] = useCreateTeacherQuizMutation();
  const [updateQuiz, { isLoading: updating }] = useUpdateTeacherQuizMutation();
  const [assignQuiz, { isLoading: assigning }] = useAssignQuizToClassroomMutation();

  const submitting = creating || updating || assigning;

  useEffect(() => {
    if (!editId || !quizzes || quizzes.length === 0) return;
    const target = quizzes.find((q) => q.quizId === editId);
    if (target) {
      setForm({
        title: target.title || "",
        description: target.description || "",
        openingDate: target.startAt ? target.startAt.split("T")[0] : "",
        timeLimitMinutes: String(target.durationMinutes || 30),
        courseId: target.classroomId || "",
        topicId: "Module 1",
        contributesToFinalGrade: true,
        questions: target.questions && target.questions.length > 0
          ? target.questions.map((q, idx) => ({
              id: q.questionId || String(idx),
              content: q.questionText || "",
              type: "multiple_choice",
              points: q.score || 10,
              options: (q.options || ["Option A", "Option B"]).map((opt, oIdx) => ({
                id: String(oIdx),
                text: typeof opt === "string" ? opt : (opt as any)?.text || "Option",
              })),
              correctOptionId: "0",
            }))
          : [createEmptyQuestion(0)],
      });
    }
  }, [editId, quizzes]);

  function update<K extends keyof QuizFormData>(key: K, value: QuizFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function buildPayloadQuestions(questions: any[]) {
    return questions.map((q, idx) => {
      const optionTexts = (q.options || [])
        .map((opt: any) => opt.text)
        .filter((t: string) => Boolean(t && t.trim()));
      const validOptions = optionTexts.length > 0 ? optionTexts : ["Option A", "Option B"];
      const correctOpt = q.options?.find((opt: any) => opt.id === q.correctOptionId);
      const correctAnswer = correctOpt?.text || validOptions[0];

      return {
        questionText: q.content || `Question ${idx + 1}`,
        options: validOptions,
        correctAnswer,
        score: q.points || 1,
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
      const payload = {
        title: form.title,
        description: form.description || "",
        durationMinutes: Number(form.timeLimitMinutes) || 30,
        maxAttempts: 1,
        questions: payloadQuestions,
      };

      if (editId) {
        await updateQuiz({ quizId: editId, payload }).unwrap();
        showToastMsg("Quiz updated in Real API (ទុកសិន) successfully!");
      } else {
        await createQuiz(payload).unwrap();
        showToastMsg("Quiz saved to Real API (ទុកសិន) successfully!");
      }

      setTimeout(() => {
        router.push("/dashboard/teacher/quiz");
      }, 1000);
    } catch (err: any) {
      showToastMsg(err?.data?.message || "Failed to save quiz. Please try again.");
    }
  }

  async function handlePublish() {
    if (!form.title.trim()) {
      showToastMsg("Please enter a Quiz Title.");
      return;
    }

    if (!form.courseId) {
      showToastMsg("Please select a classroom to assign this quiz to.");
      return;
    }

    try {
      const payloadQuestions = buildPayloadQuestions(form.questions);
      const payload = {
        title: form.title,
        description: form.description || "",
        durationMinutes: Number(form.timeLimitMinutes) || 30,
        maxAttempts: 1,
        questions: payloadQuestions,
      };

      let targetQuizId = editId;

      if (editId) {
        await updateQuiz({ quizId: editId, payload }).unwrap();
      } else {
        const created = await createQuiz(payload).unwrap();
        targetQuizId = created?.quizId || null;
      }

      if (form.courseId && targetQuizId) {
        await assignQuiz({ quizId: targetQuizId, classroomId: form.courseId }).unwrap();
      }

      showToastMsg("Quiz assigned to classroom (assign ភ្លាមៗ) successfully!");
      setTimeout(() => {
        router.push("/dashboard/teacher/quiz");
      }, 1000);
    } catch (err: any) {
      showToastMsg(err?.data?.message || "Failed to publish quiz. Please try again.");
    }
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
      <p className="mt-1.5 text-muted-foreground">
        Configure high-security assessment parameters, classroom assignment, and questions.
      </p>

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
            topicId={form.topicId}
            onTopicIdChange={(v) => update("topicId", v)}
            contributesToFinalGrade={form.contributesToFinalGrade}
            onContributesToFinalGradeChange={(v) => update("contributesToFinalGrade", v)}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}