import { Download } from "lucide-react";

export default function StudentsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Students</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and monitor student information and academic progress.
        </p>
      </div>

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
    </div>
  );
}