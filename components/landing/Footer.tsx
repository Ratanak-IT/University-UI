import Link from "next/link";
import Image from "next/image";

const GROUPS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Teacher portal", href: "/dashboard/teacher" },
    ],
  },
  {
    heading: "Institution",
    links: [
      { label: "Book a walkthrough", href: "/demo" },
      { label: "About us", href: "/about-us" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Student data policy", href: "/data" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-rm.png"
                alt="UMS Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div>
                <p className="text-xl font-black tracking-tight text-indigo-950">
                  UMS
                </p>
                <p className="text-xs font-medium text-slate-500">
                  University Management
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-[24ch] text-sm text-slate-500">
              Timetables, enrollment, attendance, and grades. Built in Phnom
              Penh.
            </p>
          </div>

          {GROUPS.map((g) => (
            <div key={g.heading}>
              <p className="text-[11px] font-bold tracking-wider text-slate-400">
                {g.heading.toUpperCase()}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-600 transition-colors hover:text-indigo-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} UMS</p>
          <p className="text-xs text-slate-400">ខ្មែរ · English</p>
        </div>
      </div>
    </footer>
  );
}
