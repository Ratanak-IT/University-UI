"use client";

interface QuizDetailsSectionProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function QuizDetailsSection({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
}: QuizDetailsSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="border-b border-border pb-3 text-lg font-semibold text-foreground">
        Quiz Details
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter an authoritative title for the assessment..."
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Provide detailed instructions for students regarding the scope and rules of this quiz..."
            rows={5}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </section>
  );
}