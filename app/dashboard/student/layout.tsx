import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import NavbarStudent from "@/components/student/NavbarStudent";
import Sidebar from "@/components/student/SideBar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <NavbarStudent />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <ScrollToTopButton />
      </div>
    </div>
  );
}
