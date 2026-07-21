import DashboardNavbar from "@/components/student/DashboardNavbar";
import Sidebar from "@/components/student/SideBar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
    
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}