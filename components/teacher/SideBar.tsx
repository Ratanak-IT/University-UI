"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  GraduationCap,
  Users,
  Package,
  BookOpen,
  Trophy,
  UserCheck,
  Star,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard/teacher", icon: LayoutGrid }],
  },
  {
    title: "My Teaching",
    items: [
      { label: "My Classrooms", href: "/dashboard/teacher/my-classroom", icon: GraduationCap },
      { label: "My students", href: "/students", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Lessons", href: "/lessons", icon: Package },
      { label: "Assignments", href: "/assignments", icon: BookOpen },
      { label: "Quizzes", href: "/quizzes", icon: Trophy },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Attendance", href: "/attendance", icon: UserCheck },
      { label: "Grades", href: "/grades", icon: Star },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "My Profile", href: "/profile", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-[260px]"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-primary dark:border-gray-700 dark:bg-slate-800 lg:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
      <div className="flex items-center gap-3 bg-muted/60 px-6 py-5.5">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
          <Image
            src="/logo-rm.png"
            alt="UMS Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-xl font-black tracking-tight text-primary">UMS</p>
            <p className="text-xs font-medium text-muted-foreground">Teacher Portal</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
            {!isCollapsed && (
              <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-lg font-medium transition-all ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer User Profile Banner */}
      <div
        className={`flex items-center gap-3 border-t border-border bg-muted/50 px-5 py-4 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
          <Image src="/davin.jpg" alt="Chhay Davin profile" fill className="object-cover" />
        </div>

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 animate-in fade-in zoom-in-95 duration-300">
              <p className="truncate text-xs font-medium text-muted-foreground">Teacher</p>
              <p className="truncate text-lg font-semibold text-foreground">Chhay Davin</p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600 dark:hover:text-rose-400"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}


// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import {
//   LayoutGrid,
//   GraduationCap,
//   Users,
//   Package,
//   BookOpen,
//   Trophy,
//   UserCheck,
//   Star,
//   Bell,
//   User,
//   LogOut,
// } from "lucide-react";

// type NavItem = {
//   label: string;
//   href: string;
//   icon: React.ElementType;
// };

// type NavSection = {
//   title: string;
//   items: NavItem[];
// };

// const sections: NavSection[] = [
//   {
//     title: "Overview",
//     items: [{ label: "Dashboard", href: "/dashboard/teacher", icon: LayoutGrid }],
//   },
//   {
//     title: "My Teaching",
//     items: [
//       { label: "My Classrooms", href: "/dashboard/teacher/my-classroom", icon: GraduationCap },
//       { label: "My students", href: "/students", icon: Users },
//     ],
//   },
//   {
//     title: "Content",
//     items: [
//       { label: "Lessons", href: "/lessons", icon: Package },
//       { label: "Assignments", href: "/assignments", icon: BookOpen },
//       { label: "Quizzes", href: "/quizzes", icon: Trophy },
//     ],
//   },
//   {
//     title: "Manage",
//     items: [
//       { label: "Attendance", href: "/attendance", icon: UserCheck },
//       { label: "Grades", href: "/grades", icon: Star },
//     ],
//   },
//   {
//     title: "Profile",
//     items: [
//       { label: "Notifications", href: "/notifications", icon: Bell },
//       { label: "My Profile", href: "/profile", icon: User },
//     ],
//   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="flex h-screen w-[260px] flex-col border-r border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
//       {/* Logo Header */}
//       <div className="flex items-center gap-3 bg-indigo-50/60 px-6 py-5.5 dark:bg-slate-800/60">
//         <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
//           <Image
//             src="/logo-rm.png"
//             alt="UMS Logo"
//             width={48}
//             height={48}
//             className="object-contain"
//           />
//         </div>
//         <div className="min-w-0">
//           <p className="text-xl font-black tracking-tight text-indigo-950 dark:text-indigo-300">
//             UMS
//           </p>
//           <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Teacher Portal</p>
//         </div>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
//         {sections.map((section, idx) => (
//           <div key={section.title} className={idx === 0 ? "" : "mt-7"}>
//             <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//               {section.title}
//             </p>
//             <ul className="space-y-1">
//               {section.items.map((item) => {
//                 const isActive = pathname === item.href;
//                 const Icon = item.icon;

//                 return (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       className={`flex items-center gap-3 rounded-xl py-2.5 px-3.5 text-lg font-medium transition-all group ${
//                         isActive
//                           ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/40 dark:bg-slate-800 dark:text-sky-400 dark:shadow-none"
//                           : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
//                       }`}
//                     >
//                       <Icon
//                         className={`h-4.5 w-4.5 transition-colors ${
//                           isActive
//                             ? "text-indigo-600 dark:text-sky-400"
//                             : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
//                         }`}
//                         strokeWidth={isActive ? 2 : 1.75}
//                       />
//                       <span>{item.label}</span>
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         ))}
//       </nav>

//       {/* Footer User Profile Banner */}
//       <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40">
//         <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
//           <Image
//             src="/davin.jpg"
//             alt="Chhay Davin profile"
//             fill
//             className="object-cover"
//           />
//         </div>
//         <div className="min-w-0 flex-1">
//           <p className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">Teacher</p>
//           <p className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">
//             Chhay Davin
//           </p>
//         </div>
//         <button
//           type="button"
//           aria-label="Log out"
//           className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
//         >
//           <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
//         </button>
//       </div>
//     </aside>
//   );
// }