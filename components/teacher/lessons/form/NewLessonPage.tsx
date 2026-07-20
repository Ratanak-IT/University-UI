import { NewLessonForm } from "./NewLessonForm";


export default function NewLessonPage() {
  return (
    <div className="p-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>&gt;</span>
        <span className="font-medium text-foreground">New lesson</span>
      </nav>

      <NewLessonForm />
    </div>
  );
}