// app/teacher/layout.tsx (unchanged)
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import DashboardNavbar from "@/components/teacher/DashboardNavbar";
import Sidebar from "@/components/teacher/SideBar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <ScrollToTopButton />
      </div>
      
    </div>
  );
}

// import DashboardNavbar from "@/components/teacher/DashboardNavbar";
// import Sidebar from "@/components/teacher/SideBar";

// export default function TeacherLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }
