// app/(portal)/assignments/new/page.tsx

"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AssignmentFormValues } from "@/lib/types/AssignmentFormValues";
import { AssignmentFormHeader } from "./AssignmentFormHeader";
import { AssignmentFormMain } from "./AssignmentFormMain";
import { AssignmentSettingsPanel } from "./AssignmentSettingsPanel";
import { SchedulingTipCard } from "./SchedulingTipCard";
import { defaultAssignmentForm } from "@/lib/data/defaultAssignmentForm";

import { createSavedAssignment, createAssignmentForClassroom } from "@/lib/api/assignment";
import { useSearchParams } from "next/navigation";

function NewAssignmentFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classroomId = searchParams?.get("classroomId");

  const [values, setValues] = useState<AssignmentFormValues>(
    defaultAssignmentForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof AssignmentFormValues>(
    key: K,
    value: AssignmentFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveAsDraft() {
    await submitAssignment(true);
  }

  async function handleAssign() {
    await submitAssignment(false);
  }

  async function submitAssignment(isDraft: boolean) {
    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    setSaving(true);

    const attachmentsFiles = values.attachments
      .map((a) => a.file)
      .filter((f): f is File => !!f);

    const payload = {
      title: values.title,
      description: values.instructionsHtml,
      maxScore: typeof values.points === "number" ? values.points : 100,
      weight: 10.0, // Default weight
    };

    let res;
    if (classroomId && !isDraft) {
      const combinedDueDate = values.dueDate && values.dueTime
        ? `${values.dueDate}T${values.dueTime}:00`
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19); // default 7 days from now

      res = await createAssignmentForClassroom(classroomId, { ...payload, dueDate: combinedDueDate }, attachmentsFiles);
    } else {
      res = await createSavedAssignment(payload, attachmentsFiles);
    }

    setSaving(false);

    if (res) {
      if (classroomId && !isDraft) {
        router.push(`/dashboard/teacher/my-classroom/${classroomId}`);
      } else {
        router.push("/dashboard/teacher/assignments");
      }
    } else {
      setError("Failed to create assignment. Please try again.");
    }
  }

  const canAssign = values.title.trim().length > 0 && !saving;

  return (
    <div className="p-6">
      <AssignmentFormHeader
        onClose={() => router.back()}
        onSaveAsDraft={handleSaveAsDraft}
        onAssign={handleAssign}
        assignDisabled={!canAssign}
      />

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <AssignmentFormMain values={values} onChange={setField} />

        <div className="flex flex-col gap-6">
          <AssignmentSettingsPanel values={values} onChange={setField} />
          <SchedulingTipCard />
        </div>
      </div>
    </div>
  );
}

export default function NewAssignmentPage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <NewAssignmentFormInner />
    </Suspense>
  );
}