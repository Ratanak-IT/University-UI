// import DashboardNavbar from "@/components/teacher/DashboardNavbar";
// import Sidebar from "@/components/teacher/SideBar";

// export default function TeacherLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50">
//       <Sidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <DashboardNavbar />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }


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
      </div>
    </div>
  );
}