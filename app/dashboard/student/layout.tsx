import StudentNavbar from "@/components/student/StudentNavbar";
import StudentSidebar from "@/components/student/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentNavbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
