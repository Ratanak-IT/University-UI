import DashboardNavbar from "@/components/teacher/DashboardNavbar";
import Sidebar from "@/components/teacher/SideBar";
import RoleGuard from "@/components/shared/RoleGuard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["TEACHER"]}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
