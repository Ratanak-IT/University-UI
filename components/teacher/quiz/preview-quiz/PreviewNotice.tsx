import { LogOut } from "lucide-react";

interface PreviewNoticeProps {
  onFinishPreview: () => void;
}

export function PreviewNotice({ onFinishPreview }: PreviewNoticeProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5">
      <p className="text-sm text-muted-foreground">
        You are currently viewing this quiz exactly as a student would see it. Data entered here
        will not be saved.
      </p>
      <button
        type="button"
        onClick={onFinishPreview}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
      >
        <LogOut className="h-4 w-4" />
        Finish Preview
      </button>
    </div>
  );
}