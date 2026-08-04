// app/curriculum/page.tsx
import Curriculum from "@/components/landing/Curriculum";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

export default function CurriculumPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* <Navbar /> */}
      <main className="flex-1">
        <Curriculum />
      </main>
      {/* <Footer /> */}
    </div>
  );
}