// features/assignments/form/AssignmentFormMain.tsx

import { AssignmentFormValues } from "@/lib/types/AssignmentFormValues";
import { InstructionsEditor } from "./InstructionsEditor";
import { AttachmentsPanel } from "./AttachmentsPanel";



interface AssignmentFormMainProps {
  values: AssignmentFormValues;
  onChange: <K extends keyof AssignmentFormValues>(
    key: K,
    value: AssignmentFormValues[K],
  ) => void;
}

export function AssignmentFormMain({
  values,
  onChange,
}: AssignmentFormMainProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border p-6">
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          TITLE
        </span>
        <input
          type="text"
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Lab Report: Photosynthesis"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="mt-6">
          <InstructionsEditor
            value={values.instructionsHtml}
            onChange={(html) => onChange("instructionsHtml", html)}
          />
        </div>
      </div>

      <AttachmentsPanel
        attachments={values.attachments}
        onChange={(attachments) => onChange("attachments", attachments)}
      />
    </div>
  );
}