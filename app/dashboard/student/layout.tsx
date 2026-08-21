import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import NavbarStudent from "@/components/student/NavbarStudent";
import Sidebar from "@/components/student/SideBar";
import RoleGuard from "@/components/shared/RoleGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <NavbarStudent />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
