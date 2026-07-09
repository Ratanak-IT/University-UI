import StudentsPage from "@/components/teacher/my-student/StudentsPage";


export const metadata = {
  title: "Students · UMS Teacher Portal",
};

// This page assumes your Navbar + Sidebar already live in a parent layout
// (e.g. app/(dashboard)/layout.tsx), so this route only renders the
// page content that sits inside that shell.
export default function Page() {
  return (
    <main className="flex-1 bg-background p-6">
      <StudentsPage />
    </main>
  );
}