interface QuizPreviewHeaderProps {
  courseName: string;
  title: string;
  description: string;
}

export function QuizPreviewHeader({ courseName, title, description }: QuizPreviewHeaderProps) {
  return (
    <div>
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-primary dark:text-gray-200">Quizzes</span>
        <span className="text-muted-foreground">&gt;</span>
        <span className="text-primary dark:text-gray-200">{courseName}</span>
        <span className="text-muted-foreground">&gt;</span>
        <span className="font-medium text-primary dark:text-gray-200">Preview</span>
      </nav>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-1.5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}