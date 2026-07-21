// app/(portal)/assignments/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssignmentFormValues } from "@/lib/types/AssignmentFormValues";
import { AssignmentFormHeader } from "./AssignmentFormHeader";
import { AssignmentFormMain } from "./AssignmentFormMain";
import { AssignmentSettingsPanel } from "./AssignmentSettingsPanel";
import { SchedulingTipCard } from "./SchedulingTipCard";
import { defaultAssignmentForm } from "@/lib/data/defaultAssignmentForm";


export default function NewAssignmentPage() {
  const router = useRouter();
  const [values, setValues] = useState<AssignmentFormValues>(
    defaultAssignmentForm,
  );

  function setField<K extends keyof AssignmentFormValues>(
    key: K,
    value: AssignmentFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveAsDraft() {
    // await saveAssignmentDraftMutation(values)
    console.log("save as draft:", values);
  }

  function handleAssign() {
    // Build FormData for the Spring Boot endpoint:
    // const formData = new FormData();
    // formData.append("title", values.title);
    // formData.append("instructionsHtml", values.instructionsHtml);
    // formData.append("courseId", values.courseId);
    // ...
    // values.attachments.forEach((a) => a.file && formData.append("files", a.file));
    // await createAssignmentMutation(formData);
    console.log("assign:", values);
  }

  const canAssign = values.title.trim().length > 0;

  return (
    <div className="p-6">
      <AssignmentFormHeader
        onClose={() => router.back()}
        onSaveAsDraft={handleSaveAsDraft}
        onAssign={handleAssign}
        assignDisabled={!canAssign}
      />

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