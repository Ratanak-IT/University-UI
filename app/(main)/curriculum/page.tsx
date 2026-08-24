// app/curriculum/page.tsx
import Curriculum from "@/components/landing/Curriculum";

export default function CurriculumPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Curriculum />
      </main>
    </div>
  );
}