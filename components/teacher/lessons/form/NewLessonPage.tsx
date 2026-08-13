import { Suspense } from "react";
import { NewLessonForm } from "./NewLessonForm";


export default function NewLessonPage() {
  return (
    <div className="p-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>&gt;</span>
        <span className="font-medium text-foreground">New lesson</span>
      </nav>

      <Suspense fallback={
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      }>
        <NewLessonForm />
      </Suspense>
    </div>
  );
}