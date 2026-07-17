import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About us", href: "/about-us" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-8 py-3.5"
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-rm.png"
            alt="UMS Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-black tracking-tight text-indigo-950">
            UMS
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/teacher"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Sign in
          </Link>
          <Link
            href="/demo"
            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            Book a walkthrough
          </Link>
        </div>
      </nav>
    </header>
  );
}
