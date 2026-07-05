import DashboardNavbar from "@/components/teacher/DashboardNavbar";
import Sidebar from "@/components/teacher/SideBar";


export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}