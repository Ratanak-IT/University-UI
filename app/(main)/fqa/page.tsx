// app/fqa/page.tsx
import Testimonials from "@/components/landing/Testimonials";

export default function FQAPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <Testimonials />
      </main>
    </div>
  );
}